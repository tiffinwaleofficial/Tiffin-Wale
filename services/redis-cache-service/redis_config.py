"""
Redis Configuration Manager for Motia
Centralized Redis instance management with load balancing and health monitoring
"""

import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum


class RedisDataCategory(str, Enum):
    """Redis data categories for intelligent routing"""
    AUTH = "auth"
    ORDERS = "orders"
    NOTIFICATIONS = "notifications"
    ANALYTICS = "analytics"
    USER = "user"
    MENU = "menu"
    ML = "ml"
    CACHE = "cache"
    DEFAULT = "default"


class LoadBalancingStrategy(str, Enum):
    """Load balancing strategies"""
    ROUND_ROBIN = "round_robin"
    LEAST_USED = "least_used"
    SMART = "smart"
    DATA_TYPE = "data_type"


@dataclass
class RedisInstanceConfig:
    """Configuration for a single Redis instance"""
    id: str
    name: str
    url: str
    host: str
    port: int
    password: str
    username: str
    database: int
    max_memory: int  # in MB
    data_types: List[RedisDataCategory]
    
    # Connection settings
    connection_timeout: int = 5000
    command_timeout: int = 3000
    retry_attempts: int = 3
    retry_delay: int = 100


@dataclass
class TTLConfig:
    """TTL configuration for different data types"""
    default: int = 300  # 5 minutes
    auth: int = 900     # 15 minutes
    orders: int = 1800  # 30 minutes
    user: int = 3600    # 1 hour
    menu: int = 7200    # 2 hours
    analytics: int = 600  # 10 minutes
    notifications: int = 300  # 5 minutes
    ml: int = 86400     # 24 hours
    cache: int = 1800   # 30 minutes


class RedisConfigService:
    """Centralized Redis configuration management"""
    
    def __init__(self):
        self.load_balancing_strategy = LoadBalancingStrategy(
            os.getenv("REDIS_LOAD_BALANCE_STRATEGY", "smart")
        )
        self.ttl_config = TTLConfig()
        self._instances = self._load_instances()
        self._data_type_mapping = self._create_data_type_mapping()
    
    def _load_instances(self) -> Dict[str, RedisInstanceConfig]:
        """Load Redis instances from environment variables"""
        instances = {}
        
        # Primary Redis Instance
        primary_types_str = os.getenv("REDIS_PRIMARY_TYPES", "auth,orders,notifications,analytics")
        primary_types = [RedisDataCategory(t.strip()) for t in primary_types_str.split(",")]
        
        primary = RedisInstanceConfig(
            id="primary",
            name="Primary Redis Instance",
            url=os.getenv("REDIS_PRIMARY_URL", ""),
            host=os.getenv("REDIS_PRIMARY_HOST", "localhost"),
            port=int(os.getenv("REDIS_PRIMARY_PORT", 6379)),
            password=os.getenv("REDIS_PRIMARY_PASSWORD", ""),
            username=os.getenv("REDIS_PRIMARY_USERNAME", "default"),
            database=int(os.getenv("REDIS_PRIMARY_DB", 0)),
            max_memory=int(os.getenv("REDIS_PRIMARY_MAX_MEMORY", 30)),
            data_types=primary_types
        )
        instances["primary"] = primary
        
        # Secondary Redis Instance
        secondary_types_str = os.getenv("REDIS_SECONDARY_TYPES", "user,menu,ml,cache")
        secondary_types = [RedisDataCategory(t.strip()) for t in secondary_types_str.split(",")]
        
        secondary = RedisInstanceConfig(
            id="secondary",
            name="Secondary Redis Instance",
            url=os.getenv("REDIS_SECONDARY_URL", ""),
            host=os.getenv("REDIS_SECONDARY_HOST", "localhost"),
            port=int(os.getenv("REDIS_SECONDARY_PORT", 6379)),
            password=os.getenv("REDIS_SECONDARY_PASSWORD", ""),
            username=os.getenv("REDIS_SECONDARY_USERNAME", "default"),
            database=int(os.getenv("REDIS_SECONDARY_DB", 0)),
            max_memory=int(os.getenv("REDIS_SECONDARY_MAX_MEMORY", 30)),
            data_types=secondary_types
        )
        instances["secondary"] = secondary
        
        return instances
    
    def _create_data_type_mapping(self) -> Dict[RedisDataCategory, str]:
        """Create mapping from data types to instance IDs"""
        mapping = {}
        
        for instance_id, instance in self._instances.items():
            for data_type in instance.data_types:
                mapping[data_type] = instance_id
        
        # Default fallback to primary
        mapping[RedisDataCategory.DEFAULT] = "primary"
        
        return mapping
    
    def get_instances(self) -> Dict[str, RedisInstanceConfig]:
        """Get all Redis instances"""
        return self._instances.copy()
    
    def get_instance(self, instance_id: str) -> Optional[RedisInstanceConfig]:
        """Get specific Redis instance by ID"""
        return self._instances.get(instance_id)
    
    def get_instance_for_data_type(self, data_type: RedisDataCategory) -> Optional[RedisInstanceConfig]:
        """Get Redis instance for specific data type"""
        instance_id = self._data_type_mapping.get(data_type, "primary")
        return self._instances.get(instance_id)
    
    def get_ttl_for_category(self, category: RedisDataCategory) -> int:
        """Get TTL for specific data category"""
        return getattr(self.ttl_config, category.value, self.ttl_config.default)
    
    def get_connection_string(self, instance: RedisInstanceConfig) -> str:
        """Get Redis connection string for instance"""
        if instance.url:
            return instance.url
        
        auth_part = ""
        if instance.username and instance.password:
            auth_part = f"{instance.username}:{instance.password}@"
        elif instance.password:
            auth_part = f":{instance.password}@"
        
        return f"redis://{auth_part}{instance.host}:{instance.port}/{instance.database}"
    
    def get_load_balancing_strategy(self) -> LoadBalancingStrategy:
        """Get current load balancing strategy"""
        return self.load_balancing_strategy
    
    def set_load_balancing_strategy(self, strategy: LoadBalancingStrategy):
        """Set load balancing strategy"""
        self.load_balancing_strategy = strategy
    
    def get_total_capacity(self) -> int:
        """Get total Redis capacity across all instances"""
        return sum(instance.max_memory for instance in self._instances.values())
    
    def get_instance_count(self) -> int:
        """Get total number of Redis instances"""
        return len(self._instances)
    
    def validate_configuration(self) -> Dict[str, Any]:
        """Validate Redis configuration"""
        issues = []
        warnings = []
        
        # Check if instances are configured
        if not self._instances:
            issues.append("No Redis instances configured")
        
        # Check for missing URLs
        for instance_id, instance in self._instances.items():
            if not instance.url and not (instance.host and instance.port):
                issues.append(f"Instance '{instance_id}' missing connection details")
        
        # Check data type coverage
        covered_types = set()
        for instance in self._instances.values():
            covered_types.update(instance.data_types)
        
        all_types = set(RedisDataCategory)
        uncovered_types = all_types - covered_types
        if uncovered_types:
            warnings.append(f"Uncovered data types: {[t.value for t in uncovered_types]}")
        
        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "total_instances": len(self._instances),
            "total_capacity": self.get_total_capacity(),
            "covered_data_types": [t.value for t in covered_types]
        }


# Global configuration instance
redis_config = RedisConfigService()
