"""
Enhanced Redis Service for Motia with Multi-Redis Support
Maintains backward compatibility while adding smart routing and load balancing
"""

import os
import json
import asyncio
import random
from typing import Any, Optional, Dict, List, Union
from datetime import datetime, timedelta
from dataclasses import dataclass

# Import Redis with error handling
try:
    import redis
    import aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

# Import our configuration
try:
    from ..config.redis_config import (
        RedisConfigService, 
        RedisDataCategory, 
        LoadBalancingStrategy,
        RedisInstanceConfig
    )
except ImportError:
    # Fallback if config not available
    RedisConfigService = None
    RedisDataCategory = None


@dataclass
class CacheOptions:
    """Options for cache operations"""
    category: Optional[str] = None
    ttl: Optional[int] = None
    force_instance: Optional[str] = None
    skip_load_balancing: bool = False


@dataclass
class CacheResult:
    """Result of cache operations"""
    success: bool
    data: Any = None
    error: Optional[str] = None
    instance_used: Optional[str] = None
    response_time: Optional[float] = None


class LoadBalancer:
    """Simple load balancer for Redis instances"""
    
    def __init__(self, config_service: RedisConfigService):
        self.config_service = config_service
        self.request_counts = {}
        self.last_used_index = 0
    
    def select_instance(self, category: RedisDataCategory = None) -> Optional[RedisInstanceConfig]:
        """Select Redis instance based on strategy"""
        strategy = self.config_service.get_load_balancing_strategy()
        instances = self.config_service.get_instances()
        
        if not instances:
            return None
        
        # Data type routing (highest priority)
        if category and strategy in [LoadBalancingStrategy.SMART, LoadBalancingStrategy.DATA_TYPE]:
            instance = self.config_service.get_instance_for_data_type(category)
            if instance:
                return instance
        
        # Fallback strategies
        instance_list = list(instances.values())
        
        if strategy == LoadBalancingStrategy.ROUND_ROBIN:
            self.last_used_index = (self.last_used_index + 1) % len(instance_list)
            return instance_list[self.last_used_index]
        
        elif strategy == LoadBalancingStrategy.LEAST_USED:
            # Select instance with least requests
            least_used = min(instance_list, key=lambda i: self.request_counts.get(i.id, 0))
            return least_used
        
        else:  # SMART or fallback
            # For smart strategy, prefer data type routing, fallback to least used
            if category:
                instance = self.config_service.get_instance_for_data_type(category)
                if instance:
                    return instance
            
            # Fallback to least used
            least_used = min(instance_list, key=lambda i: self.request_counts.get(i.id, 0))
            return least_used
    
    def record_request(self, instance_id: str):
        """Record a request to an instance"""
        self.request_counts[instance_id] = self.request_counts.get(instance_id, 0) + 1


class EnhancedRedisService:
    """
    Enhanced Redis service with multi-instance support and smart routing
    Maintains backward compatibility with existing RedisService interface
    """
    
    def __init__(self):
        # Initialize configuration
        if RedisConfigService:
            self.config_service = RedisConfigService()
            self.load_balancer = LoadBalancer(self.config_service)
        else:
            self.config_service = None
            self.load_balancer = None
        
        # Redis clients for each instance
        self._redis_clients = {}
        self._async_redis_clients = {}
        
        # Backward compatibility - legacy single Redis config
        self.redis_url = os.getenv("REDIS_URL")
        self.redis_host = os.getenv("REDIS_HOST")
        self.redis_port = int(os.getenv("REDIS_PORT", 6379))
        self.redis_password = os.getenv("REDIS_PASSWORD")
        self.redis_username = os.getenv("REDIS_USERNAME", "default")
        
        # TTL configurations
        self.ttl_default = int(os.getenv("CACHE_TTL_DEFAULT", 300))
        self.ttl_auth = int(os.getenv("CACHE_TTL_AUTH", 900))
        self.ttl_ml = int(os.getenv("CACHE_TTL_ML", 1800))
        self.ttl_analytics = int(os.getenv("CACHE_TTL_ANALYTICS", 600))
        
        # Legacy clients for backward compatibility
        self._redis_client = None
        self._async_redis_client = None
        
        # Performance tracking
        self.performance_stats = {
            "total_requests": 0,
            "cache_hits": 0,
            "cache_misses": 0,
            "errors": 0,
            "instance_usage": {}
        }
    
    async def get_async_client(self, instance_id: str = None) -> Optional[Any]:
        """Get async Redis client for specific instance or default"""
        if not REDIS_AVAILABLE:
            return None
        
        # If no instance specified and multi-Redis not configured, use legacy
        if not instance_id and not self.config_service:
            return await self._get_legacy_async_client()
        
        # Multi-Redis mode
        if instance_id and instance_id in self._async_redis_clients:
            return self._async_redis_clients[instance_id]
        
        # Create new client for instance
        if self.config_service:
            instance = self.config_service.get_instance(instance_id) if instance_id else None
            if not instance:
                # Fallback to any available instance
                instances = self.config_service.get_instances()
                if instances:
                    instance = list(instances.values())[0]
            
            if instance:
                connection_string = self.config_service.get_connection_string(instance)
                client = await aioredis.from_url(
                    connection_string,
                    decode_responses=True,
                    retry_on_timeout=True,
                    socket_keepalive=True,
                    socket_keepalive_options={},
                    health_check_interval=30
                )
                self._async_redis_clients[instance.id] = client
                return client
        
        # Fallback to legacy
        return await self._get_legacy_async_client()
    
    async def _get_legacy_async_client(self):
        """Get legacy async Redis client for backward compatibility"""
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
    
    def get_sync_client(self, instance_id: str = None):
        """Get sync Redis client for specific instance or default"""
        if not REDIS_AVAILABLE:
            return None
        
        # If no instance specified and multi-Redis not configured, use legacy
        if not instance_id and not self.config_service:
            return self._get_legacy_sync_client()
        
        # Multi-Redis mode
        if instance_id and instance_id in self._redis_clients:
            return self._redis_clients[instance_id]
        
        # Create new client for instance
        if self.config_service:
            instance = self.config_service.get_instance(instance_id) if instance_id else None
            if not instance:
                # Fallback to any available instance
                instances = self.config_service.get_instances()
                if instances:
                    instance = list(instances.values())[0]
            
            if instance:
                connection_string = self.config_service.get_connection_string(instance)
                client = redis.from_url(
                    connection_string,
                    decode_responses=True,
                    retry_on_timeout=True,
                    socket_keepalive=True,
                    socket_keepalive_options={},
                    health_check_interval=30
                )
                self._redis_clients[instance.id] = client
                return client
        
        # Fallback to legacy
        return self._get_legacy_sync_client()
    
    def _get_legacy_sync_client(self):
        """Get legacy sync Redis client for backward compatibility"""
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
    
    async def set_cache(self, key: str, value: Any, ttl: int = None, category: str = None) -> CacheResult:
        """
        Set cache value with intelligent instance selection
        Maintains backward compatibility while adding smart routing
        """
        start_time = datetime.now()
        
        try:
            # Determine category and TTL
            data_category = RedisDataCategory(category) if category and RedisDataCategory else None
            if ttl is None:
                if self.config_service and data_category:
                    ttl = self.config_service.get_ttl_for_category(data_category)
                else:
                    ttl = self.ttl_default
            
            # Select instance
            instance = None
            if self.load_balancer and data_category:
                instance = self.load_balancer.select_instance(data_category)
            
            # Get client
            client = await self.get_async_client(instance.id if instance else None)
            if not client:
                return CacheResult(success=False, error="Redis client not available")
            
            # Serialize value
            serialized_value = json.dumps(value) if not isinstance(value, str) else value
            
            # Set cache
            await client.set(key, serialized_value, ex=ttl)
            
            # Record performance
            self.performance_stats["total_requests"] += 1
            if instance:
                self.load_balancer.record_request(instance.id)
                self.performance_stats["instance_usage"][instance.id] = \
                    self.performance_stats["instance_usage"].get(instance.id, 0) + 1
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            return CacheResult(
                success=True,
                data=True,
                instance_used=instance.id if instance else "legacy",
                response_time=response_time
            )
            
        except Exception as e:
            self.performance_stats["errors"] += 1
            return CacheResult(success=False, error=str(e))
    
    async def get_cache(self, key: str, category: str = None) -> CacheResult:
        """
        Get cache value with intelligent instance selection
        """
        start_time = datetime.now()
        
        try:
            # Determine category
            data_category = RedisDataCategory(category) if category and RedisDataCategory else None
            
            # Select instance
            instance = None
            if self.load_balancer and data_category:
                instance = self.load_balancer.select_instance(data_category)
            
            # Get client
            client = await self.get_async_client(instance.id if instance else None)
            if not client:
                return CacheResult(success=False, error="Redis client not available")
            
            # Get cache
            value = await client.get(key)
            
            # Record performance
            self.performance_stats["total_requests"] += 1
            if value is not None:
                self.performance_stats["cache_hits"] += 1
            else:
                self.performance_stats["cache_misses"] += 1
            
            if instance:
                self.load_balancer.record_request(instance.id)
                self.performance_stats["instance_usage"][instance.id] = \
                    self.performance_stats["instance_usage"].get(instance.id, 0) + 1
            
            # Deserialize value
            if value:
                try:
                    deserialized_value = json.loads(value)
                except (json.JSONDecodeError, TypeError):
                    deserialized_value = value
            else:
                deserialized_value = None
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            return CacheResult(
                success=True,
                data=deserialized_value,
                instance_used=instance.id if instance else "legacy",
                response_time=response_time
            )
            
        except Exception as e:
            self.performance_stats["errors"] += 1
            return CacheResult(success=False, error=str(e))
    
    async def delete_cache(self, key: str, category: str = None) -> CacheResult:
        """Delete cache key with intelligent instance selection"""
        start_time = datetime.now()
        
        try:
            # Determine category
            data_category = RedisDataCategory(category) if category and RedisDataCategory else None
            
            # Select instance
            instance = None
            if self.load_balancer and data_category:
                instance = self.load_balancer.select_instance(data_category)
            
            # Get client
            client = await self.get_async_client(instance.id if instance else None)
            if not client:
                return CacheResult(success=False, error="Redis client not available")
            
            # Delete key
            result = await client.delete(key)
            
            # Record performance
            self.performance_stats["total_requests"] += 1
            if instance:
                self.load_balancer.record_request(instance.id)
                self.performance_stats["instance_usage"][instance.id] = \
                    self.performance_stats["instance_usage"].get(instance.id, 0) + 1
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            return CacheResult(
                success=True,
                data=result > 0,
                instance_used=instance.id if instance else "legacy",
                response_time=response_time
            )
            
        except Exception as e:
            self.performance_stats["errors"] += 1
            return CacheResult(success=False, error=str(e))
    
    async def exists_cache(self, key: str, category: str = None) -> CacheResult:
        """Check if cache key exists"""
        start_time = datetime.now()
        
        try:
            # Determine category
            data_category = RedisDataCategory(category) if category and RedisDataCategory else None
            
            # Select instance
            instance = None
            if self.load_balancer and data_category:
                instance = self.load_balancer.select_instance(data_category)
            
            # Get client
            client = await self.get_async_client(instance.id if instance else None)
            if not client:
                return CacheResult(success=False, error="Redis client not available")
            
            # Check existence
            exists = await client.exists(key)
            
            # Record performance
            self.performance_stats["total_requests"] += 1
            if instance:
                self.load_balancer.record_request(instance.id)
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            return CacheResult(
                success=True,
                data=bool(exists),
                instance_used=instance.id if instance else "legacy",
                response_time=response_time
            )
            
        except Exception as e:
            self.performance_stats["errors"] += 1
            return CacheResult(success=False, error=str(e))
    
    # Backward compatibility methods (maintain exact same interface)
    
    async def set(self, key: str, value: Any, ttl: int = None):
        """Backward compatibility method"""
        result = await self.set_cache(key, value, ttl)
        return result.success
    
    async def get(self, key: str):
        """Backward compatibility method"""
        result = await self.get_cache(key)
        return result.data if result.success else None
    
    async def delete(self, key: str):
        """Backward compatibility method"""
        result = await self.delete_cache(key)
        return result.data if result.success else False
    
    async def exists(self, key: str):
        """Backward compatibility method"""
        result = await self.exists_cache(key)
        return result.data if result.success else False
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        total_requests = self.performance_stats["total_requests"]
        cache_hits = self.performance_stats["cache_hits"]
        
        hit_rate = (cache_hits / total_requests * 100) if total_requests > 0 else 0
        
        return {
            "total_requests": total_requests,
            "cache_hits": cache_hits,
            "cache_misses": self.performance_stats["cache_misses"],
            "hit_rate_percentage": round(hit_rate, 2),
            "errors": self.performance_stats["errors"],
            "instance_usage": self.performance_stats["instance_usage"],
            "multi_redis_enabled": self.config_service is not None,
            "total_instances": self.config_service.get_instance_count() if self.config_service else 1,
            "total_capacity": f"{self.config_service.get_total_capacity()}MB" if self.config_service else "Unknown"
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for all instances"""
        health_results = {}
        
        if self.config_service:
            # Multi-Redis health check
            instances = self.config_service.get_instances()
            
            for instance_id, instance in instances.items():
                try:
                    client = await self.get_async_client(instance_id)
                    if client:
                        # Test basic operations
                        test_key = f"health_check_test_{instance_id}"
                        await client.set(test_key, "test_value", ex=10)
                        value = await client.get(test_key)
                        await client.delete(test_key)
                        
                        info = await client.info()
                        
                        health_results[instance_id] = {
                            "status": "healthy",
                            "connected": True,
                            "test_passed": value == "test_value",
                            "redis_version": info.get("redis_version"),
                            "used_memory": info.get("used_memory_human"),
                            "connected_clients": info.get("connected_clients"),
                            "total_commands_processed": info.get("total_commands_processed"),
                            "instance_name": instance.name,
                            "max_memory": f"{instance.max_memory}MB"
                        }
                    else:
                        health_results[instance_id] = {
                            "status": "unhealthy",
                            "connected": False,
                            "error": "Client not available"
                        }
                        
                except Exception as e:
                    health_results[instance_id] = {
                        "status": "unhealthy",
                        "connected": False,
                        "error": str(e)
                    }
        else:
            # Legacy single Redis health check
            try:
                client = await self.get_async_client()
                if client:
                    test_key = "health_check_test"
                    await client.set(test_key, "test_value", ex=10)
                    value = await client.get(test_key)
                    await client.delete(test_key)
                    
                    info = await client.info()
                    
                    health_results["legacy"] = {
                        "status": "healthy",
                        "connected": True,
                        "test_passed": value == "test_value",
                        "redis_version": info.get("redis_version"),
                        "used_memory": info.get("used_memory_human"),
                        "connected_clients": info.get("connected_clients"),
                        "total_commands_processed": info.get("total_commands_processed")
                    }
                else:
                    health_results["legacy"] = {
                        "status": "unhealthy",
                        "connected": False,
                        "error": "Client not available"
                    }
                    
            except Exception as e:
                health_results["legacy"] = {
                    "status": "unhealthy",
                    "connected": False,
                    "error": str(e)
                }
        
        # Overall system health
        healthy_instances = sum(1 for result in health_results.values() if result.get("status") == "healthy")
        total_instances = len(health_results)
        
        return {
            "overall_status": "healthy" if healthy_instances == total_instances else "degraded" if healthy_instances > 0 else "unhealthy",
            "healthy_instances": healthy_instances,
            "total_instances": total_instances,
            "instances": health_results,
            "performance_stats": self.get_performance_stats(),
            "multi_redis_enabled": self.config_service is not None
        }
    
    async def close(self):
        """Close all Redis connections"""
        # Close multi-Redis clients
        for client in self._async_redis_clients.values():
            if client:
                await client.close()
        
        for client in self._redis_clients.values():
            if client:
                client.close()
        
        # Close legacy clients
        if self._async_redis_client:
            await self._async_redis_client.close()
        if self._redis_client:
            self._redis_client.close()


# Create enhanced service instance
enhanced_redis_service = EnhancedRedisService()

# Maintain backward compatibility by also exposing as redis_service
redis_service = enhanced_redis_service
