import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string


class CustomerType(models.TextChoices):
    """Enum for customer types"""
    RETAIL = 'Retail', 'Retail'
    TRADE = 'Trade', 'Trade'


class Province(models.TextChoices):
    """Enum for South African provinces"""
    EASTERN_CAPE = 'Eastern Cape', 'Eastern Cape'
    FREE_STATE = 'Free State', 'Free State'
    GAUTENG = 'Gauteng', 'Gauteng'
    KWAZULU_NATAL = 'KwaZulu-Natal', 'KwaZulu-Natal'
    LIMPOPO = 'Limpopo', 'Limpopo'
    MPUMALANGA = 'Mpumalanga', 'Mpumalanga'
    NORTHERN_CAPE = 'Northern Cape', 'Northern Cape'
    NORTH_WEST = 'North West', 'North West'
    WESTERN_CAPE = 'Western Cape', 'Western Cape'


class BusinessType(models.TextChoices):
    """Enum for trade business types"""
    ELECTRICIAN = 'Electrician', 'Electrician'
    CONTRACTOR = 'Contractor', 'Contractor'
    RESELLER = 'Reseller', 'Reseller'
    OTHER = 'Other', 'Other'


class CustomerManager(BaseUserManager):
    """Custom manager for Customer model"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user"""
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class Customer(AbstractBaseUser, PermissionsMixin):
    """Custom user model for customers"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_type = models.CharField(
        max_length=10,
        choices=CustomerType.choices,
        default=CustomerType.RETAIL
    )
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True, db_index=True)
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True
    )
    
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = CustomerManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Empty since first_name and last_name are now optional
    
    class Meta:
        db_table = 'customers'
        verbose_name = '1. Customer'
        verbose_name_plural = '1. Customer List'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} ({self.customer_type})"
    
    def get_full_name(self):
        """Return the full name of the customer"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.email


class BillingAddress(models.Model):
    """Model for customer billing addresses"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='billing_addresses'
    )
    company_name = models.CharField(max_length=255, blank=True, null=True)
    vat_number = models.CharField(max_length=100, blank=True, null=True)
    company_registration = models.CharField(max_length=100, blank=True, null=True)
    po_number = models.CharField(max_length=100, blank=True, null=True)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    province = models.CharField(
        max_length=50,
        choices=Province.choices
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'billing_addresses'
        verbose_name = '2. Billing Address'
        verbose_name_plural = '2. Billing Addresses'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Billing - {self.user.email} - {self.city}"


class DeliveryAddress(models.Model):
    """Model for customer delivery addresses"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='delivery_addresses'
    )
    company_name = models.CharField(max_length=255, blank=True, null=True)
    vat_number = models.CharField(max_length=100, blank=True, null=True)
    company_registration = models.CharField(max_length=100, blank=True, null=True)
    po_number = models.CharField(max_length=100, blank=True, null=True)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    province = models.CharField(
        max_length=50,
        choices=Province.choices
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'delivery_addresses'
        verbose_name = '3. Delivery Address'
        verbose_name_plural = '3. Delivery Addresses'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Delivery - {self.user.email} - {self.city}"


class TradeInformation(models.Model):
    """Model for trade customer information"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        Customer,
        on_delete=models.CASCADE,
        related_name='trade_information'
    )
    business_type = models.CharField(
        max_length=20,
        choices=BusinessType.choices
    )
    monthly_statement = models.CharField(max_length=255, blank=True, null=True)
    procurement_no = models.CharField(max_length=100, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'trade_information'
        verbose_name = '4. Trade Information'
        verbose_name_plural = '4. Trade Information'
    
    def __str__(self):
        return f"{self.user.email} - {self.business_type}"


class TradeDocument(models.Model):
    """Model for trade customer documents"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trade_info = models.ForeignKey(
        TradeInformation,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    document = models.FileField(upload_to='trade_documents/%Y/%m/%d/')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'trade_documents'
        verbose_name = '5. Trade Document'
        verbose_name_plural = '5. Trade Documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Document for {self.trade_info.user.email}"


class OTP(models.Model):
    """Model for One-Time Passwords for email verification and password reset"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(db_index=True)
    otp = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'otps'
        verbose_name = '6. OTP'
        verbose_name_plural = '6. OTPs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.email}"
    
    def save(self, *args, **kwargs):
        """Override save to set expiration time"""
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def is_valid(self):
        """Check if OTP is valid (not expired and not used)"""
        return not self.is_used and timezone.now() < self.expires_at
    
    @staticmethod
    def generate_otp():
        """Generate a random 8-digit OTP"""
        return ''.join(random.choices(string.digits, k=8))