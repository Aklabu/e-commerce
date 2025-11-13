from rest_framework.views import exception_handler
from rest_framework import status
from datetime import datetime


def custom_exception_handler(exc, context):
    """
    Custom exception handler for consistent error responses
    
    Args:
        exc: The exception instance
        context: Context information about the exception
    
    Returns:
        Response object with standardized error format
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # If response is None, it means the exception is not handled by DRF
    if response is None:
        return None
    
    # Customize the response data
    custom_response_data = {
        "success": False,
        "statusCode": response.status_code,
        "message": get_error_message(exc, response),
        "data": format_error_data(response.data),
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    
    response.data = custom_response_data
    return response


def get_error_message(exc, response):
    """
    Extract a meaningful error message from the exception
    
    Args:
        exc: The exception instance
        response: The response object
    
    Returns:
        String error message
    """
    # Handle different exception types
    if hasattr(exc, 'detail'):
        if isinstance(exc.detail, dict):
            # Get the first error message from dict
            first_key = next(iter(exc.detail))
            first_error = exc.detail[first_key]
            
            if isinstance(first_error, list):
                return str(first_error[0])
            return str(first_error)
        elif isinstance(exc.detail, list):
            return str(exc.detail[0])
        else:
            return str(exc.detail)
    
    # Default error messages based on status code
    status_messages = {
        status.HTTP_400_BAD_REQUEST: "Bad Request",
        status.HTTP_401_UNAUTHORIZED: "Unauthorized",
        status.HTTP_403_FORBIDDEN: "Forbidden",
        status.HTTP_404_NOT_FOUND: "Not Found",
        status.HTTP_405_METHOD_NOT_ALLOWED: "Method Not Allowed",
        status.HTTP_500_INTERNAL_SERVER_ERROR: "Internal Server Error",
    }
    
    return status_messages.get(
        response.status_code,
        "An error occurred"
    )


def format_error_data(error_data):
    """
    Format error data for consistent structure
    
    Args:
        error_data: Error data from the response
    
    Returns:
        Formatted error data
    """
    if isinstance(error_data, dict):
        formatted_errors = {}
        for key, value in error_data.items():
            if isinstance(value, list):
                formatted_errors[key] = [str(item) for item in value]
            else:
                formatted_errors[key] = str(value)
        return formatted_errors
    elif isinstance(error_data, list):
        return [str(item) for item in error_data]
    else:
        return {"detail": str(error_data)}