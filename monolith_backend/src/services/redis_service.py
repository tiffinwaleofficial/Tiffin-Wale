import os
import json
from typing import Any, Optional, Dict, List
from datetime import datetime, timedelta
import asyncio

# Import Redis with error handling
try:
    import redis
    import aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    print("Redis modules not available, using mock implementation")

class RedisService:
    """
    Redis service for caching and session management in Motia Steps
    """
    
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL")
        self.redis_host = os.getenv("REDIS_HOST")
        self.redis_port = int(os.getenv("REDIS_PORT", 15802))
        self.redis_password = os.getenv("REDIS_PASSWORD")
        self.redis_username = os.getenv("REDIS_USERNAME", "default")
        
        # TTL configurations
        self.ttl_default = int(os.getenv("CACHE_TTL_DEFAULT", 300))  # 5 minutes
        self.ttl_auth = int(os.getenv("CACHE_TTL_AUTH", 900))        # 15 minutes
        self.ttl_ml = int(os.getenv("CACHE_TTL_ML", 1800))           # 30 minutes
        self.ttl_analytics = int(os.getenv("CACHE_TTL_ANALYTICS", 600))  # 10 minutes
        
        self._redis_client = None
        self._async_redis_client = None

    async def get_async_client(self):
        """Get async Redis client"""
        if not REDIS_AVAILABLE:
            return None
            
        if self._async_redis_client is None:
            self._async_redis_client = await aioredis.from_url(
                self.redis_url,
                decode_responses=True,
                retry_on_timeout=True,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30
            )
        return self._async_redis_client

    def get_sync_client(self):
        """Get synchronous Redis client"""
        if not REDIS_AVAILABLE:
            return None
            
        if self._redis_client is None:
            self._redis_client = redis.from_url(
                self.redis_url,
                decode_responses=True,
                retry_on_timeout=True,
                socket_keepalive=True,
                socket_keepalive_options={},
                health_check_interval=30
            )
        return self._redis_client

    async def set_cache(self, key: str, value: Any, ttl: Optional[int] = None, category: str = "default") -> bool:
        """
        Set cache with automatic TTL based on category
        """
        try:
            client = await self.get_async_client()
            if not client:
                return False  # Redis not available
            
            # Determine TTL based on category
            if ttl is None:
                ttl_map = {
                    "auth": self.ttl_auth,
                    "ml": self.ttl_ml,
                    "analytics": self.ttl_analytics,
                    "default": self.ttl_default
                }
                ttl = ttl_map.get(category, self.ttl_default)
            
            # Serialize value
            if isinstance(value, (dict, list)):
                value = json.dumps(value, default=str)
            elif not isinstance(value, str):
                value = str(value)
            
            # Set with TTL
            await client.setex(key, ttl, value)
            return True
            
        except Exception as e:
            print(f"Redis set error: {e}")
            return False

    async def get_cache(self, key: str) -> Optional[Any]:
        """
        Get cache value
        """
        try:
            client = await self.get_async_client()
            if not client:
                return None  # Redis not available
                
            value = await client.get(key)
            
            if value is None:
                return None
            
            # Try to deserialize JSON
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
                
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    async def delete_cache(self, key: str) -> bool:
        """
        Delete cache key
        """
        try:
            client = await self.get_async_client()
            result = await client.delete(key)
            return result > 0
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False

    async def exists(self, key: str) -> bool:
        """
        Check if key exists
        """
        try:
            client = await self.get_async_client()
            return await client.exists(key) > 0
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False

    async def increment(self, key: str, amount: int = 1, ttl: Optional[int] = None) -> Optional[int]:
        """
        Increment counter
        """
        try:
            client = await self.get_async_client()
            
            # Use pipeline for atomic operations
            pipe = client.pipeline()
            pipe.incr(key, amount)
            if ttl:
                pipe.expire(key, ttl)
            
            results = await pipe.execute()
            return results[0]
            
        except Exception as e:
            print(f"Redis increment error: {e}")
            return None

    async def set_hash(self, key: str, mapping: Dict[str, Any], ttl: Optional[int] = None) -> bool:
        """
        Set hash fields
        """
        try:
            client = await self.get_async_client()
            
            # Serialize values in mapping
            serialized_mapping = {}
            for k, v in mapping.items():
                if isinstance(v, (dict, list)):
                    serialized_mapping[k] = json.dumps(v, default=str)
                else:
                    serialized_mapping[k] = str(v)
            
            await client.hset(key, mapping=serialized_mapping)
            
            if ttl:
                await client.expire(key, ttl)
                
            return True
            
        except Exception as e:
            print(f"Redis hash set error: {e}")
            return False

    async def get_hash(self, key: str, field: Optional[str] = None) -> Optional[Any]:
        """
        Get hash field(s)
        """
        try:
            client = await self.get_async_client()
            
            if field:
                value = await client.hget(key, field)
                if value is None:
                    return None
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            else:
                hash_data = await client.hgetall(key)
                if not hash_data:
                    return None
                
                # Deserialize all values
                result = {}
                for k, v in hash_data.items():
                    try:
                        result[k] = json.loads(v)
                    except json.JSONDecodeError:
                        result[k] = v
                return result
                
        except Exception as e:
            print(f"Redis hash get error: {e}")
            return None

    async def add_to_list(self, key: str, value: Any, ttl: Optional[int] = None, max_length: Optional[int] = None) -> bool:
        """
        Add to list (LPUSH)
        """
        try:
            client = await self.get_async_client()
            
            # Serialize value
            if isinstance(value, (dict, list)):
                value = json.dumps(value, default=str)
            elif not isinstance(value, str):
                value = str(value)
            
            pipe = client.pipeline()
            pipe.lpush(key, value)
            
            if max_length:
                pipe.ltrim(key, 0, max_length - 1)
            
            if ttl:
                pipe.expire(key, ttl)
            
            await pipe.execute()
            return True
            
        except Exception as e:
            print(f"Redis list add error: {e}")
            return False

    async def get_list(self, key: str, start: int = 0, end: int = -1) -> List[Any]:
        """
        Get list range
        """
        try:
            client = await self.get_async_client()
            values = await client.lrange(key, start, end)
            
            # Deserialize values
            result = []
            for value in values:
                try:
                    result.append(json.loads(value))
                except json.JSONDecodeError:
                    result.append(value)
            
            return result
            
        except Exception as e:
            print(f"Redis list get error: {e}")
            return []

    async def cache_ml_prediction(self, model_name: str, input_hash: str, prediction: Any) -> bool:
        """
        Cache ML prediction with specific key format
        """
        key = f"ml:{model_name}:{input_hash}"
        return await self.set_cache(key, prediction, category="ml")

    async def get_ml_prediction(self, model_name: str, input_hash: str) -> Optional[Any]:
        """
        Get cached ML prediction
        """
        key = f"ml:{model_name}:{input_hash}"
        return await self.get_cache(key)

    async def cache_user_session(self, user_id: str, session_data: Dict[str, Any]) -> bool:
        """
        Cache user session data
        """
        key = f"session:{user_id}"
        return await self.set_cache(key, session_data, category="auth")

    async def get_user_session(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user session data
        """
        key = f"session:{user_id}"
        return await self.get_cache(key)

    async def invalidate_user_session(self, user_id: str) -> bool:
        """
        Invalidate user session
        """
        key = f"session:{user_id}"
        return await self.delete_cache(key)

    async def cache_analytics_data(self, metric_name: str, data: Any, timestamp: Optional[str] = None) -> bool:
        """
        Cache analytics data with timestamp
        """
        if timestamp is None:
            timestamp = datetime.now().isoformat()
        
        key = f"analytics:{metric_name}:{timestamp}"
        return await self.set_cache(key, data, category="analytics")

    async def get_analytics_data(self, metric_name: str, start_time: Optional[str] = None) -> List[Any]:
        """
        Get analytics data for a metric
        """
        try:
            client = await self.get_async_client()
            pattern = f"analytics:{metric_name}:*"
            keys = await client.keys(pattern)
            
            if not keys:
                return []
            
            # Sort keys by timestamp
            keys.sort()
            
            # Get values
            values = await client.mget(keys)
            result = []
            
            for value in values:
                if value:
                    try:
                        result.append(json.loads(value))
                    except json.JSONDecodeError:
                        result.append(value)
            
            return result
            
        except Exception as e:
            print(f"Redis analytics get error: {e}")
            return []

    async def health_check(self) -> Dict[str, Any]:
        """
        Redis health check
        """
        try:
            client = await self.get_async_client()
            
            # Test basic operations
            test_key = "health_check_test"
            await client.set(test_key, "test_value", ex=10)
            value = await client.get(test_key)
            await client.delete(test_key)
            
            info = await client.info()
            
            return {
                "status": "healthy",
                "connected": True,
                "test_passed": value == "test_value",
                "redis_version": info.get("redis_version"),
                "used_memory": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed")
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "connected": False,
                "error": str(e)
            }

    async def close(self):
        """
        Close Redis connections
        """
        if self._async_redis_client:
            await self._async_redis_client.close()
        if self._redis_client:
            self._redis_client.close()

# Global Redis service instance
redis_service = RedisService()
