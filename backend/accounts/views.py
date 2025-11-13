from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from datetime import timedelta

from .models import (
    Customer, BillingAddress, DeliveryAddress,
    TradeInformation, TradeDocument, OTP
)
from .serializers import (
    CustomerRegistrationSerializer, LoginSerializer,
    VerifyEmailSerializer, ResendOTPSerializer,
    ForgotPasswordSerializer, VerifyResetOTPSerializer,
    ResetPasswordSerializer, ChangePasswordSerializer,
    CustomerProfileSerializer, CustomerProfileUpdateSerializer,
    BillingAddressSerializer, DeliveryAddressSerializer,
    TradeInformationSerializer,
    RefreshTokenSerializer
)
from utils.response import CustomResponse


# Registration Views
class RegisterAPIView(APIView):
    """Step 1: Register customer account"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = CustomerRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            customer = serializer.save()
            
            # NOTE: OTP will be sent after address completion
            # No email sent here anymore
            
            return CustomResponse.success(
                data={
                    "customer_id": str(customer.id),
                    "email": customer.email,
                    "customer_type": customer.customer_type
                },
                message="Registration successful. Please complete billing address.",
                status_code=status.HTTP_201_CREATED
            )
        
        return CustomResponse.error(
            message="Registration failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_verification_email(self, email, otp):
        """Helper method to send verification email"""
        subject = "Email Verification - Seidik Ecommerce"
        message = f"Your verification code is: {otp}\n\nThis code will expire in 10 minutes."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


class BillingAddressRegisterAPIView(APIView):
    """Step 2: Add billing address during registration"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return CustomResponse.error(
                message="Email is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return CustomResponse.error(
                message="Customer not found. Please register first.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        serializer = BillingAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=customer)
            return CustomResponse.success(
                data=serializer.data,
                message="Billing address added successfully. Please complete delivery address.",
                status_code=status.HTTP_201_CREATED
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class DeliveryAddressRegisterAPIView(APIView):
    """Step 3: Add delivery address during registration"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return CustomResponse.error(
                message="Email is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return CustomResponse.error(
                message="Customer not found. Please register first.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        serializer = DeliveryAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=customer)
            
            if customer.customer_type == 'Trade':
                message = "Delivery address added successfully. Please complete trade information."
            else:
                # RETAIL CUSTOMER: Send OTP after delivery address
                otp_code = OTP.generate_otp()
                OTP.objects.create(email=customer.email, otp=otp_code)
                self.send_verification_email(customer.email, otp_code)
                message = "Delivery address added successfully. Verification email sent. Please verify your email."
            
            return CustomResponse.success(
                data=serializer.data,
                message=message,
                status_code=status.HTTP_201_CREATED
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_verification_email(self, email, otp):
        """Helper method to send verification email"""
        subject = "Email Verification - Seidik Ecommerce"
        message = f"Your verification code is: {otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


class TradeInformationRegisterAPIView(APIView):
    """Step 4: Add trade information during registration (Trade only)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return CustomResponse.error(
                message="Email is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return CustomResponse.error(
                message="Customer not found. Please register first.",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if customer.customer_type != 'Trade':
            return CustomResponse.error(
                message="Only Trade customers can submit trade information",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        if hasattr(customer, 'trade_information'):
            return CustomResponse.error(
                message="Trade information already exists for this customer",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = TradeInformationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=customer)
            
            # TRADE CUSTOMER: Send OTP after trade information
            otp_code = OTP.generate_otp()
            OTP.objects.create(email=customer.email, otp=otp_code)
            self.send_verification_email(customer.email, otp_code)
            
            return CustomResponse.success(
                data=serializer.data,
                message="Trade information submitted successfully. Verification email sent. Please verify your email.",
                status_code=status.HTTP_201_CREATED
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_verification_email(self, email, otp):
        """Helper method to send verification email"""
        subject = "Email Verification - Seidik Ecommerce"
        message = f"Your verification code is: {otp}\n\nThis code will expire in 10 minutes."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


class VerifyEmailAPIView(APIView):
    """Final Step: Verify email with OTP"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            
            try:
                otp_obj = OTP.objects.filter(email=email, otp=otp_code).latest('created_at')
                
                if not otp_obj.is_valid():
                    return CustomResponse.error(
                        message="Invalid or expired OTP",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                
                otp_obj.is_used = True
                otp_obj.save()
                
                customer = Customer.objects.get(email=email)
                customer.is_verified = True
                customer.save()
                
                return CustomResponse.success(
                    message="Email verified successfully. Registration complete! You can now login.",
                    status_code=status.HTTP_200_OK
                )
                
            except OTP.DoesNotExist:
                return CustomResponse.error(
                    message="Invalid OTP",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            except Customer.DoesNotExist:
                return CustomResponse.error(
                    message="User not found",
                    status_code=status.HTTP_404_NOT_FOUND
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ResendOTPAPIView(APIView):
    """Resend OTP for email verification"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                customer = Customer.objects.get(email=email)
                
                if customer.is_verified:
                    return CustomResponse.error(
                        message="Email is already verified",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                
                otp_code = OTP.generate_otp()
                OTP.objects.create(email=email, otp=otp_code)
                self.send_verification_email(email, otp_code)
                
                return CustomResponse.success(
                    message="OTP sent successfully",
                    status_code=status.HTTP_200_OK
                )
                
            except Customer.DoesNotExist:
                return CustomResponse.error(
                    message="User not found",
                    status_code=status.HTTP_404_NOT_FOUND
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_verification_email(self, email, otp):
        subject = "Email Verification"
        message = f"Your verification code is: {otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


# Authentication Views
class LoginAPIView(APIView):
    """User login"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            remember_me = serializer.validated_data.get('remember_me', False)
            
            user = authenticate(email=email, password=password)
            
            if user is None:
                return CustomResponse.error(
                    message="Invalid credentials",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            if not user.is_verified:
                return CustomResponse.error(
                    message="Email not verified. Please verify your email first.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            if not user.is_active:
                return CustomResponse.error(
                    message="Account is deactivated",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            
            refresh = RefreshToken.for_user(user)
            if remember_me:
                refresh.set_exp(lifetime=timedelta(days=30))
            
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'customer_type': user.customer_type,
                    'is_verified': user.is_verified
                }
            }
            
            return CustomResponse.success(
                data=response_data,
                message="Login successful",
                status_code=status.HTTP_200_OK
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class LogoutAPIView(APIView):
    """User logout"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return CustomResponse.error(
                    message="Refresh token is required",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return CustomResponse.success(
                message="Logout successful",
                status_code=status.HTTP_200_OK
            )
            
        except TokenError:
            return CustomResponse.error(
                message="Invalid or expired token",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return CustomResponse.error(
                message="Logout failed",
                status_code=status.HTTP_400_BAD_REQUEST
            )


class RefreshTokenAPIView(APIView):
    """Refresh JWT token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data['refresh']
                refresh = RefreshToken(refresh_token)
                
                response_data = {'access': str(refresh.access_token)}
                
                return CustomResponse.success(
                    data=response_data,
                    message="Token refreshed successfully",
                    status_code=status.HTTP_200_OK
                )
                
            except TokenError:
                return CustomResponse.error(
                    message="Invalid or expired refresh token",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


# Password Management Views
class ForgotPasswordAPIView(APIView):
    """Send OTP for password reset"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                Customer.objects.get(email=email)
                
                otp_code = OTP.generate_otp()
                OTP.objects.create(email=email, otp=otp_code)
                self.send_reset_email(email, otp_code)
                
                return CustomResponse.success(
                    message="Password reset OTP sent to your email",
                    status_code=status.HTTP_200_OK
                )
                
            except Customer.DoesNotExist:
                return CustomResponse.error(
                    message="User with this email does not exist",
                    status_code=status.HTTP_404_NOT_FOUND
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_reset_email(self, email, otp):
        subject = "Password Reset Code"
        message = f"Your password reset code is: {otp}\n\nThis code will expire in 10 minutes.\nIf you did not request a password reset, please ignore this email."
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            print(f"Email sending failed: {str(e)}")


class VerifyResetOTPAPIView(APIView):
    """Verify OTP for password reset"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = VerifyResetOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            
            try:
                otp_obj = OTP.objects.filter(email=email, otp=otp_code).latest('created_at')
                
                if not otp_obj.is_valid():
                    return CustomResponse.error(
                        message="Invalid or expired OTP",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                
                return CustomResponse.success(
                    message="OTP verified successfully. You can now reset your password.",
                    status_code=status.HTTP_200_OK
                )
                
            except OTP.DoesNotExist:
                return CustomResponse.error(
                    message="Invalid OTP",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ResetPasswordAPIView(APIView):
    """Reset password after OTP verification"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            try:
                otp_obj = OTP.objects.filter(email=email, otp=otp_code).latest('created_at')
                
                if not otp_obj.is_valid():
                    return CustomResponse.error(
                        message="Invalid or expired OTP",
                        status_code=status.HTTP_400_BAD_REQUEST
                    )
                
                otp_obj.is_used = True
                otp_obj.save()
                
                customer = Customer.objects.get(email=email)
                customer.set_password(new_password)
                customer.save()
                
                return CustomResponse.success(
                    message="Password reset successful",
                    status_code=status.HTTP_200_OK
                )
                
            except OTP.DoesNotExist:
                return CustomResponse.error(
                    message="Invalid OTP",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            except Customer.DoesNotExist:
                return CustomResponse.error(
                    message="User not found",
                    status_code=status.HTTP_404_NOT_FOUND
                )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class ChangePasswordAPIView(APIView):
    """Change password while logged in"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            request.user.set_password(new_password)
            request.user.save()
            
            return CustomResponse.success(
                message="Password changed successfully",
                status_code=status.HTTP_200_OK
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


# Profile Management Views
class ProfileAPIView(APIView):
    """Get user profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = CustomerProfileSerializer(request.user, context={'request': request})
        return CustomResponse.success(
            data=serializer.data,
            message="Profile retrieved successfully",
            status_code=status.HTTP_200_OK
        )


class ProfileUpdateAPIView(APIView):
    """Update user profile"""
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        serializer = CustomerProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            
            # Return full profile data after update
            profile_serializer = CustomerProfileSerializer(request.user, context={'request': request})
            
            return CustomResponse.success(
                data=profile_serializer.data,
                message="Profile updated successfully",
                status_code=status.HTTP_200_OK
            )
        
        return CustomResponse.error(
            message="Validation failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )