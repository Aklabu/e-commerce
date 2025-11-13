from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import (
    Customer, BillingAddress, DeliveryAddress,
    TradeInformation, TradeDocument, OTP
)
import os


class BillingAddressSerializer(serializers.ModelSerializer):
    """Serializer for billing address"""
    
    class Meta:
        model = BillingAddress
        fields = [
            'id', 'company_name', 'vat_number', 'company_registration',
            'po_number', 'address_line_1', 'address_line_2', 'city',
            'postal_code', 'province', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DeliveryAddressSerializer(serializers.ModelSerializer):
    """Serializer for delivery address"""
    
    class Meta:
        model = DeliveryAddress
        fields = [
            'id', 'company_name', 'vat_number', 'company_registration',
            'po_number', 'address_line_1', 'address_line_2', 'city',
            'postal_code', 'province', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TradeDocumentSerializer(serializers.ModelSerializer):
    """Serializer for trade documents"""
    document_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TradeDocument
        fields = ['id', 'document', 'document_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_document_url(self, obj):
        """Return full URL for document"""
        if obj.document:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.document.url)
            return obj.document.url
        return None
    
    def validate_document(self, value):
        """Validate document file type and size"""
        # Check file extension
        ext = os.path.splitext(value.name)[1].lower()
        valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
        
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                "Only PDF, JPG, and PNG files are allowed."
            )
        
        # Check file size (10MB limit)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(
                "File size must not exceed 10MB."
            )
        
        return value


class TradeInformationSerializer(serializers.ModelSerializer):
    """Serializer for trade information with documents"""
    documents = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
        help_text="Upload multiple documents (PDF, JPG, PNG, max 10MB each)"
    )
    uploaded_documents = TradeDocumentSerializer(source='documents', many=True, read_only=True)
    
    class Meta:
        model = TradeInformation
        fields = [
            'id', 'business_type', 'monthly_statement', 'procurement_no',
            'documents', 'uploaded_documents', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_approved', 'created_at', 'updated_at']
    
    def validate_documents(self, files):
        """Validate each document"""
        if not files:
            return files
        
        for file in files:
            # Check file extension
            ext = os.path.splitext(file.name)[1].lower()
            valid_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
            
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    f"File {file.name}: Only PDF, JPG, and PNG files are allowed."
                )
            
            # Check file size (10MB limit)
            if file.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    f"File {file.name}: File size must not exceed 10MB."
                )
        
        return files
    
    def create(self, validated_data):
        """Create trade information with documents"""
        documents_data = validated_data.pop('documents', [])
        trade_info = TradeInformation.objects.create(**validated_data)
        
        # Create trade documents
        for document in documents_data:
            TradeDocument.objects.create(
                trade_info=trade_info,
                document=document
            )
        
        return trade_info


class CustomerRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for customer registration - Step 1"""
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Customer
        fields = [
            'id', 'customer_type', 'first_name', 'last_name', 'email',
            'phone_number', 'password', 'confirm_password'
        ]
        read_only_fields = ['id']
    
    def validate(self, attrs):
        """Validate registration data"""
        # Check if passwords match
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        
        # Validate password strength
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        
        return attrs
    
    def create(self, validated_data):
        """Create customer"""
        validated_data.pop('confirm_password')
        customer = Customer.objects.create_user(**validated_data)
        return customer


class CustomerProfileSerializer(serializers.ModelSerializer):
    """Serializer for customer profile"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    billing_addresses = serializers.SerializerMethodField()
    delivery_addresses = serializers.SerializerMethodField()
    trade_information = serializers.SerializerMethodField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'customer_type', 'first_name', 'last_name', 'full_name',
            'email', 'phone_number', 'is_verified', 'billing_addresses',
            'delivery_addresses', 'trade_information', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'email', 'customer_type', 'is_verified',
            'created_at', 'updated_at'
        ]
    
    def get_billing_addresses(self, obj):
        """Get all billing addresses for the user"""
        billing_addresses = BillingAddress.objects.filter(user=obj)
        return BillingAddressSerializer(billing_addresses, many=True).data
    
    def get_delivery_addresses(self, obj):
        """Get all delivery addresses for the user"""
        delivery_addresses = DeliveryAddress.objects.filter(user=obj)
        return DeliveryAddressSerializer(delivery_addresses, many=True).data
    
    def get_trade_information(self, obj):
        """Get trade information if exists"""
        try:
            trade_info = TradeInformation.objects.get(user=obj)
            return TradeInformationSerializer(trade_info, context=self.context).data
        except TradeInformation.DoesNotExist:
            return None


class CustomerProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating customer profile"""
    billing_addresses = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        write_only=True,
        help_text="List of billing addresses to update/create"
    )
    delivery_addresses = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        write_only=True,
        help_text="List of delivery addresses to update/create"
    )
    trade_information = serializers.DictField(
        required=False,
        write_only=True,
        help_text="Trade information to update/create (Trade customers only)"
    )
    
    class Meta:
        model = Customer
        fields = [
            'first_name', 'last_name', 'phone_number',
            'billing_addresses', 'delivery_addresses', 'trade_information'
        ]
    
    def validate_billing_addresses(self, value):
        """Validate billing addresses data"""
        if not isinstance(value, list):
            raise serializers.ValidationError("billing_addresses must be a list")
        return value
    
    def validate_delivery_addresses(self, value):
        """Validate delivery addresses data"""
        if not isinstance(value, list):
            raise serializers.ValidationError("delivery_addresses must be a list")
        return value
    
    def validate_trade_information(self, value):
        """Validate trade information"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("trade_information must be a dictionary")
        return value
    
    def update(self, instance, validated_data):
        """Update customer profile with nested addresses and trade info"""
        # Extract nested data
        billing_addresses_data = validated_data.pop('billing_addresses', None)
        delivery_addresses_data = validated_data.pop('delivery_addresses', None)
        trade_information_data = validated_data.pop('trade_information', None)
        
        # Update customer basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update billing addresses
        if billing_addresses_data is not None:
            for address_data in billing_addresses_data:
                address_id = address_data.get('id')
                if address_id:
                    # Update existing address
                    try:
                        billing_address = BillingAddress.objects.get(id=address_id, user=instance)
                        billing_serializer = BillingAddressSerializer(
                            billing_address,
                            data=address_data,
                            partial=True
                        )
                        if billing_serializer.is_valid(raise_exception=True):
                            billing_serializer.save()
                    except BillingAddress.DoesNotExist:
                        pass
                else:
                    # Create new address
                    billing_serializer = BillingAddressSerializer(data=address_data)
                    if billing_serializer.is_valid(raise_exception=True):
                        billing_serializer.save(user=instance)
        
        # Update delivery addresses
        if delivery_addresses_data is not None:
            for address_data in delivery_addresses_data:
                address_id = address_data.get('id')
                if address_id:
                    # Update existing address
                    try:
                        delivery_address = DeliveryAddress.objects.get(id=address_id, user=instance)
                        delivery_serializer = DeliveryAddressSerializer(
                            delivery_address,
                            data=address_data,
                            partial=True
                        )
                        if delivery_serializer.is_valid(raise_exception=True):
                            delivery_serializer.save()
                    except DeliveryAddress.DoesNotExist:
                        pass
                else:
                    # Create new address
                    delivery_serializer = DeliveryAddressSerializer(data=address_data)
                    if delivery_serializer.is_valid(raise_exception=True):
                        delivery_serializer.save(user=instance)
        
        # Update trade information (Trade customers only)
        if trade_information_data is not None:
            if instance.customer_type != 'Trade':
                raise serializers.ValidationError({
                    "trade_information": "Only Trade customers can have trade information"
                })
            
            # Handle documents separately
            documents_data = trade_information_data.pop('documents', None)
            
            if hasattr(instance, 'trade_information'):
                # Update existing trade information
                trade_info = instance.trade_information
                trade_serializer = TradeInformationSerializer(
                    trade_info,
                    data=trade_information_data,
                    partial=True,
                    context=self.context
                )
                if trade_serializer.is_valid(raise_exception=True):
                    trade_serializer.save()
            else:
                # Create new trade information
                trade_serializer = TradeInformationSerializer(
                    data=trade_information_data,
                    context=self.context
                )
                if trade_serializer.is_valid(raise_exception=True):
                    trade_serializer.save(user=instance)
            
            # Handle document uploads if provided
            if documents_data:
                trade_info = instance.trade_information
                for document in documents_data:
                    TradeDocument.objects.create(
                        trade_info=trade_info,
                        document=document
                    )
        
        return instance


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    remember_me = serializers.BooleanField(default=False)


class VerifyEmailSerializer(serializers.Serializer):
    """Serializer for email verification"""
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(max_length=8, required=True)


class ResendOTPSerializer(serializers.Serializer):
    """Serializer for resending OTP"""
    email = serializers.EmailField(required=True)


class ForgotPasswordSerializer(serializers.Serializer):
    """Serializer for forgot password"""
    email = serializers.EmailField(required=True)


class VerifyResetOTPSerializer(serializers.Serializer):
    """Serializer for verifying password reset OTP"""
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(max_length=8, required=True)


class ResetPasswordSerializer(serializers.Serializer):
    """Serializer for resetting password"""
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(max_length=8, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        """Validate password reset data"""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password while logged in"""
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        """Validate password change data"""
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        
        return attrs
    
    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class RefreshTokenSerializer(serializers.Serializer):
    """Serializer for refreshing JWT token"""
    refresh = serializers.CharField(required=True)