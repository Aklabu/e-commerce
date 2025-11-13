from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    Customer, BillingAddress, DeliveryAddress,
    TradeInformation, TradeDocument, OTP
)
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

admin.site.unregister(OutstandingToken)
admin.site.unregister(BlacklistedToken)

@admin.register(Customer)
class CustomerAdmin(BaseUserAdmin):
    """Admin configuration for Customer model"""
    
    list_display = [
        'email', 'first_name', 'last_name', 'customer_type',
        'is_verified', 'is_active', 'created_at'
    ]
    list_filter = ['customer_type', 'is_verified', 'is_active', 'created_at']
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('email', 'first_name', 'last_name', 'phone_number', 'customer_type')
        }),
        ('Account Status', {
            'fields': ('is_verified', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Permissions', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Create New Customer', {
            'classes': ('wide',),
            'fields': (
                'email', 'password1', 'password2',
                'is_verified', 'is_active'
            ),
            'description': 'Create a new customer account with email and password. Other details can be added after creation.'
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    
    def get_readonly_fields(self, request, obj=None):
        """Make email readonly for existing objects"""
        if obj:
            return self.readonly_fields + ['email']
        return self.readonly_fields


@admin.register(BillingAddress)
class BillingAddressAdmin(admin.ModelAdmin):
    """Admin configuration for BillingAddress model"""
    
    list_display = [
        'user', 'city', 'province', 'postal_code', 'created_at'
    ]
    list_filter = ['province', 'created_at']
    search_fields = [
        'user__email', 'company_name', 'city',
        'postal_code', 'address_line_1'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Company Details', {
            'fields': ('company_name', 'vat_number', 'company_registration', 'po_number'),
            'classes': ('collapse',)
        }),
        ('Address Information', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'postal_code', 'province')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user']


@admin.register(DeliveryAddress)
class DeliveryAddressAdmin(admin.ModelAdmin):
    """Admin configuration for DeliveryAddress model"""
    
    list_display = [
        'user', 'city', 'province', 'postal_code', 'created_at'
    ]
    list_filter = ['province', 'created_at']
    search_fields = [
        'user__email', 'company_name', 'city',
        'postal_code', 'address_line_1'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Company Details', {
            'fields': ('company_name', 'vat_number', 'company_registration', 'po_number'),
            'classes': ('collapse',)
        }),
        ('Address Information', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'postal_code', 'province')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user']


class TradeDocumentInline(admin.TabularInline):
    """Inline admin for TradeDocument"""
    model = TradeDocument
    extra = 1
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TradeInformation)
class TradeInformationAdmin(admin.ModelAdmin):
    """Admin configuration for TradeInformation model"""
    
    list_display = [
        'user', 'business_type', 'is_approved', 'created_at'
    ]
    list_filter = ['business_type', 'is_approved', 'created_at']
    search_fields = ['user__email', 'procurement_no', 'monthly_statement']
    ordering = ['-created_at']
    actions = ['approve_trade_applications', 'reject_trade_applications']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Business Information', {
            'fields': ('business_type', 'monthly_statement', 'procurement_no')
        }),
        ('Approval Status', {
            'fields': ('is_approved',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['user']
    inlines = [TradeDocumentInline]
    
    def approve_trade_applications(self, request, queryset):
        """Bulk action to approve trade applications"""
        updated = queryset.update(is_approved=True)
        self.message_user(
            request,
            f'{updated} trade application(s) approved successfully.'
        )
    approve_trade_applications.short_description = "Approve selected trade applications"
    
    def reject_trade_applications(self, request, queryset):
        """Bulk action to reject trade applications"""
        updated = queryset.update(is_approved=False)
        self.message_user(
            request,
            f'{updated} trade application(s) rejected successfully.'
        )
    reject_trade_applications.short_description = "Reject selected trade applications"


@admin.register(TradeDocument)
class TradeDocumentAdmin(admin.ModelAdmin):
    """Admin configuration for TradeDocument model"""
    
    list_display = [
        'trade_info', 'document_link', 'created_at'
    ]
    list_filter = ['created_at']
    search_fields = ['trade_info__user__email']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Trade Information', {
            'fields': ('trade_info',)
        }),
        ('Document', {
            'fields': ('document',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def document_link(self, obj):
        """Display clickable document link"""
        if obj.document:
            return format_html(
                '<a href="{}" target="_blank">View Document</a>',
                obj.document.url
            )
        return "No document"
    document_link.short_description = "Document"


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    """Admin configuration for OTP model"""
    
    list_display = [
        'email', 'otp', 'is_used', 'expires_at', 'created_at'
    ]
    list_filter = ['is_used', 'created_at', 'expires_at']
    search_fields = ['email', 'otp']
    ordering = ['-created_at']
    
    fieldsets = (
        ('OTP Information', {
            'fields': ('email', 'otp', 'is_used')
        }),
        ('Validity', {
            'fields': ('created_at', 'expires_at')
        }),
    )
    
    readonly_fields = ['created_at']
    
    def has_add_permission(self, request):
        """Disable manual OTP creation through admin"""
        return False