from rest_framework.response import Response
from rest_framework import status
from datetime import datetime


class CustomResponse:
    """Custom response handler for consistent API responses"""
    
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        """
        Return a successful response
        
        Args:
            data: Response data
            message: Success message
            status_code: HTTP status code
        
        Returns:
            Response object with standardized format
        """
        response_data = {
            "success": True,
            "statusCode": status_code,
            "message": message,
            "data": data if data is not None else {},
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        return Response(response_data, status=status_code)
    
    @staticmethod
    def error(message="Error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        """
        Return an error response
        
        Args:
            message: Error message
            errors: Detailed error information
            status_code: HTTP status code
        
        Returns:
            Response object with standardized format
        """
        response_data = {
            "success": False,
            "statusCode": status_code,
            "message": message,
            "data": errors if errors is not None else {},
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        return Response(response_data, status=status_code)