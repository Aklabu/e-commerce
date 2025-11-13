from django.urls import path
from .views import (
    RegisterAPIView, BillingAddressRegisterAPIView, DeliveryAddressRegisterAPIView,
    TradeInformationRegisterAPIView, VerifyEmailAPIView, ResendOTPAPIView,
    LoginAPIView, LogoutAPIView, RefreshTokenAPIView,
    ForgotPasswordAPIView, VerifyResetOTPAPIView,
    ResetPasswordAPIView, ChangePasswordAPIView,
    ProfileAPIView, ProfileUpdateAPIView
)

app_name = 'accounts'

urlpatterns = [
    # Registration Flow (Step-by-Step)
    path('register/', RegisterAPIView.as_view(), name='register'),  # Step 1
    path('register/billing-address/', BillingAddressRegisterAPIView.as_view(), name='register-billing'),  # Step 2
    path('register/delivery-address/', DeliveryAddressRegisterAPIView.as_view(), name='register-delivery'),  # Step 3
    path('register/trade-info/', TradeInformationRegisterAPIView.as_view(), name='register-trade'),  # Step 4 (Trade only)
    path('verify-email/', VerifyEmailAPIView.as_view(), name='verify-email'),  # Final Step
    path('resend-otp/', ResendOTPAPIView.as_view(), name='resend-otp'),
    
    # Authentication
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('token/refresh/', RefreshTokenAPIView.as_view(), name='token-refresh'),
    
    # Password Management
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='forgot-password'),
    path('verify-reset-otp/', VerifyResetOTPAPIView.as_view(), name='verify-reset-otp'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('change-password/', ChangePasswordAPIView.as_view(), name='change-password'),
    
    # Profile Management
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateAPIView.as_view(), name='profile-update'),
]