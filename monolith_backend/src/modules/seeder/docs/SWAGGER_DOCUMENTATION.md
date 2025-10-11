# 📚 Advanced Seeder System - Swagger API Documentation

## 🎯 Overview

The Advanced Phase-Based Seeder System provides comprehensive Swagger/OpenAPI documentation for all endpoints, making it easy to understand and test the seeding functionality directly from the browser.

## 🔗 Accessing Swagger Documentation

Once your backend is running, access the interactive Swagger UI at:

```
http://localhost:3001/api-docs
```

## 📋 Complete API Documentation

### 🏷️ **Seeder Tag**

All seeder endpoints are grouped under the `seeder` tag in Swagger UI for easy navigation.

### 🔄 **Seeding Operations**

#### 1. **POST** `/seeder/seed` - Comprehensive Seeding
- **Description**: Execute all seeding phases with optional configuration
- **Request Body**: Optional configuration object
- **Response**: Complete seeding summary with phase results
- **Example Response**:
```json
{
  "success": true,
  "totalDuration": 120000,
  "phasesCompleted": 3,
  "totalRecords": 487,
  "phaseResults": [
    {
      "phase": "core",
      "success": true,
      "collectionsSeeded": ["users"],
      "recordCounts": { "users": 67 },
      "duration": 15000
    }
  ],
  "errors": [],
  "validation": {
    "isValid": true,
    "errors": [],
    "warnings": []
  }
}
```

#### 2. **POST** `/seeder/phase/{phaseName}` - Phase-Specific Seeding
- **Parameters**: 
  - `phaseName`: Enum of available phases (core, partner, communication, etc.)
- **Request Body**: Optional phase configuration
- **Response**: Phase execution results

#### 3. **POST** `/seeder/profile/{profileName}` - Profile-Based Seeding
- **Parameters**: 
  - `profileName`: Enum of profiles (minimal, standard, extensive)
- **Response**: Complete seeding summary

#### 4. **POST** `/seeder/seedDummyData` - Legacy Endpoint
- **Description**: Backward compatibility endpoint
- **Response**: Basic seeding completion message

### 📊 **Monitoring Operations**

#### 5. **GET** `/seeder/status` - Real-time Status
- **Description**: Monitor seeding progress with live updates
- **Response**: Current status with progress percentage
- **Example Response**:
```json
{
  "isRunning": true,
  "currentPhase": "partner",
  "progress": 65,
  "totalPhases": 3,
  "completedPhases": ["core"],
  "errors": [],
  "startTime": "2025-01-11T10:30:00Z",
  "estimatedCompletion": "~2m"
}
```

#### 6. **GET** `/seeder/validate` - Data Validation
- **Description**: Comprehensive data integrity validation
- **Response**: Validation results with errors and warnings
- **Example Response**:
```json
{
  "isValid": true,
  "errors": [],
  "warnings": [
    "Orders: 5 orders with total amount mismatch",
    "Subscriptions: 2 subscriptions with invalid date ranges"
  ]
}
```

#### 7. **GET** `/seeder/stats` - Collection Statistics
- **Description**: Get statistics for all collections
- **Response**: Array of collection statistics

### ⚙️ **Configuration Operations**

#### 8. **GET** `/seeder/config` - Get Configuration
- **Description**: Retrieve current seeder configuration
- **Response**: Complete configuration object

#### 9. **POST** `/seeder/config` - Update Configuration
- **Description**: Update seeder configuration
- **Request Body**: Configuration updates object
- **Response**: Success confirmation

### 🧹 **Cleanup Operations**

#### 10. **DELETE** `/seeder/phase/{phaseName}` - Clean Phase
- **Parameters**: Phase name to clean
- **Response**: 204 No Content (success)

#### 11. **DELETE** `/seeder/all` - Clean All Data
- **Description**: Remove all seeded data
- **Response**: 204 No Content (success)

### ℹ️ **Information Operations**

#### 12. **GET** `/seeder/phases` - Available Phases
- **Description**: List all available seeding phases
- **Response**: Array of phase information with dependencies

#### 13. **GET** `/seeder/profiles` - Available Profiles
- **Description**: List all available seeding profiles
- **Response**: Array of profile information with estimates

## 🎨 **Swagger UI Features**

### **Interactive Testing**
- **Try It Out**: Test endpoints directly from the browser
- **Request Examples**: Pre-filled request bodies for easy testing
- **Response Examples**: Sample responses for each endpoint
- **Parameter Validation**: Built-in validation for required fields

### **Detailed Schemas**
- **Request DTOs**: Fully documented request body schemas
- **Response DTOs**: Comprehensive response object documentation
- **Enum Values**: All possible values for enum parameters
- **Field Descriptions**: Detailed descriptions for all fields

### **Error Handling**
- **HTTP Status Codes**: All possible response codes documented
- **Error Examples**: Sample error responses
- **Validation Errors**: Clear validation error messages

## 🚀 **Usage Examples**

### **Quick Start Testing**
1. Navigate to `http://localhost:3001/api-docs`
2. Expand the `seeder` tag
3. Try the **POST** `/seeder/profile/minimal` endpoint
4. Click "Try it out" → "Execute"
5. Monitor progress with **GET** `/seeder/status`

### **Advanced Configuration**
1. Use **POST** `/seeder/seed` with custom configuration:
```json
{
  "profile": "standard",
  "incremental": true,
  "skipCleanup": false
}
```

### **Phase-Specific Development**
1. Use **POST** `/seeder/phase/core` for user data only
2. Use **POST** `/seeder/phase/communication` for chat testing
3. Monitor with **GET** `/seeder/status`

## 📖 **Schema Documentation**

### **SeederConfig Schema**
```typescript
{
  profile: 'minimal' | 'standard' | 'extensive',
  incremental: boolean,
  skipCleanup: boolean,
  volumes: VolumeConfig,
  imageStrategy: ImageStrategy,
  geographic: GeographicConfig
}
```

### **SeederStatus Schema**
```typescript
{
  isRunning: boolean,
  currentPhase?: string,
  progress: number,
  totalPhases: number,
  completedPhases: string[],
  errors: string[],
  startTime?: Date,
  estimatedCompletion?: string
}
```

### **ValidationResult Schema**
```typescript
{
  isValid: boolean,
  errors: string[],
  warnings: string[]
}
```

## 🎯 **Benefits of Swagger Documentation**

### **For Developers**
- **Self-Documenting**: API documentation stays in sync with code
- **Interactive Testing**: Test endpoints without external tools
- **Type Safety**: Clear request/response schemas
- **Error Handling**: Comprehensive error documentation

### **For Testing**
- **Manual Testing**: Easy endpoint testing from browser
- **API Exploration**: Discover all available functionality
- **Parameter Validation**: Built-in request validation
- **Response Examples**: Clear expected output formats

### **For Integration**
- **Client Generation**: Generate client libraries from OpenAPI spec
- **API Contracts**: Clear contracts for frontend integration
- **Documentation Export**: Export API spec for external use
- **Version Control**: Track API changes over time

## 🔧 **Swagger Configuration**

The Swagger configuration is automatically generated from the decorators in the controller:

- **@ApiTags**: Groups endpoints under "seeder"
- **@ApiOperation**: Provides endpoint summaries and descriptions
- **@ApiParam**: Documents path and query parameters
- **@ApiBody**: Documents request body schemas
- **@ApiResponse**: Documents response schemas and examples
- **@ApiProperty**: Documents DTO properties

## 🎉 **Complete Coverage**

The Advanced Seeder System provides **100% Swagger documentation coverage** for:

- ✅ **All 13 API endpoints** fully documented
- ✅ **Request/Response schemas** with examples
- ✅ **Parameter validation** with enum values
- ✅ **Error responses** with status codes
- ✅ **Interactive testing** capability
- ✅ **Type-safe contracts** for frontend integration

Access the complete interactive documentation at `http://localhost:3001/api-docs` once your backend is running! 🚀

---

**Documentation Status**: ✅ **COMPLETE**  
**Coverage**: 100% of all endpoints  
**Interactive**: Yes - Full Swagger UI support  
**Last Updated**: January 2025
