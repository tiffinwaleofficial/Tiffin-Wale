from pydantic import BaseModel
from typing import Optional
import os
import json
import base64
import httpx
from datetime import datetime, timedelta

# Using Motia's built-in state management - no external Redis imports needed

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    _id: str
    email: str
    firstName: str
    lastName: str
    role: str

class LoginResponse(BaseModel):
    statusCode: int
    message: str
    data: dict

config = {
    "type": "api",
    "name": "UserLogin",
    "description": "TiffinWale user authentication endpoint",
    "flows": ["tiffinwale-auth"],
    "method": "POST",
    "path": "/auth/login",
    "bodySchema": LoginRequest.model_json_schema(),
    "responseSchema": {
        200: LoginResponse.model_json_schema(),
        401: {
            "type": "object",
            "properties": {
                "statusCode": {"type": "number"},
                "message": {"type": "string"},
                "error": {"type": "string"}
            }
        }
    },
    "emits": ["user.authenticated", "auth.login.success", "auth.login.failed"]
}

async def handler(req, context):
    """
    Motia Authentication Workflow - Connects to NestJS Backend
    This is a workflow orchestrator, not business logic
    """
    try:
        body = req.get("body", {})
        email = body.get("email", "").lower().strip()
        password = body.get("password", "")
        
        context.logger.info("Motia Auth Workflow Started", {
            "email": email, 
            "timestamp": datetime.now().isoformat(),
            "traceId": context.trace_id
        })

        # Step 1: Forward authentication to NestJS backend (real business logic)
        nestjs_backend_url = "http://localhost:3001/api/auth/login"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                nestjs_backend_url,
                json={"email": email, "password": password},
                headers={"Content-Type": "application/json"}
            )
            
            context.logger.info("NestJS Backend Response", {
                "status_code": response.status_code,
                "email": email,
                "traceId": context.trace_id
            })
            
            if response.status_code == 200:
                # Step 2: Extract real authentication data from NestJS
                auth_response = response.json()
                
                # Step 3: Cache successful authentication using Motia's built-in state management
                user_cache_key = f"auth:user:{email}"
                await context.state.set("auth_cache", user_cache_key, auth_response)
                
                # Step 4: Emit workflow events for downstream processing
                await context.emit({
                    "topic": "user.authenticated",
                    "data": {
                        "userId": auth_response.get("user", {}).get("_id"),
                        "email": email,
                        "role": auth_response.get("user", {}).get("role"),
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                await context.emit({
                    "topic": "auth.login.success",
                    "data": {
                        "userId": auth_response.get("user", {}).get("_id"),
                        "email": email,
                        "timestamp": datetime.now().isoformat(),
                        "authMethod": "email_password"
                    }
                })

                context.logger.info("Motia Auth Workflow Completed Successfully", {
                    "userId": auth_response.get("user", {}).get("_id"),
                    "email": email,
                    "traceId": context.trace_id
                })

                # Step 5: Return the exact NestJS response (no modification)
                return {
                    "status": 200,
                    "body": auth_response
                }
                
            else:
                # Step 6: Handle authentication failure
                error_response = response.json() if response.content else {"message": "Authentication failed"}
                
                await context.emit({
                    "topic": "auth.login.failed",
                    "data": {
                        "email": email,
                        "reason": "invalid_credentials",
                        "status_code": response.status_code,
                        "timestamp": datetime.now().isoformat(),
                        "source": "nestjs_backend"
                    }
                })

                context.logger.info("Motia Auth Workflow Failed", {
                    "email": email,
                    "status_code": response.status_code,
                    "traceId": context.trace_id
                })

                return {
                    "status": response.status_code,
                    "body": error_response
                }

    except httpx.TimeoutException:
        context.logger.error("NestJS Backend Timeout", {
            "email": body.get("email", ""),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "auth.login.failed",
            "data": {
                "email": body.get("email", ""),
                "reason": "backend_timeout",
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 503,
            "body": {
                "statusCode": 503,
                "message": "Authentication service temporarily unavailable",
                "error": "Service Timeout"
            }
        }

    except Exception as error:
        context.logger.error("Motia Auth Workflow Error", {
            "error": str(error),
            "email": body.get("email", ""),
            "traceId": context.trace_id
        })

        await context.emit({
            "topic": "auth.login.failed",
            "data": {
                "email": body.get("email", ""),
                "reason": "workflow_error",
                "error": str(error),
                "timestamp": datetime.now().isoformat()
            }
        })

        return {
            "status": 500,
            "body": {
                "statusCode": 500,
                "message": "Authentication workflow failed",
                "error": "Internal server error"
            }
        }
