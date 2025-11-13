from django.contrib import admin
from django.utils.html import format_html
from django.http import HttpResponse
import csv
from datetime import datetime
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Admin configuration for ContactMessage model"""
    
    list_display = [
        'id', 'name', 'email', 'phone', 'company_name',
        'status_badge', 'created_at'
    ]
    list_display_links = ['id', 'name', 'email']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'phone', 'company_name', 'message']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    actions = [
        'mark_as_resolved',
        'mark_as_new',
        'export_to_csv'
    ]
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'company_name')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Display status with colored badge"""
        if obj.status == 'new':
            color = '#28a745'  # Green
            icon = '●'
        else:
            color = '#6c757d'  # Gray
            icon = '✓'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} {}</span>',
            color,
            icon,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def mark_as_resolved(self, request, queryset):
        """Bulk action to mark messages as resolved"""
        updated = queryset.update(status='resolved')
        self.message_user(
            request,
            f'{updated} message(s) marked as resolved.'
        )
    mark_as_resolved.short_description = "Mark selected as Resolved"
    
    def mark_as_new(self, request, queryset):
        """Bulk action to mark messages as new"""
        updated = queryset.update(status='new')
        self.message_user(
            request,
            f'{updated} message(s) marked as new.'
        )
    mark_as_new.short_description = "Mark selected as New"
    
    def export_to_csv(self, request, queryset):
        """Export selected messages to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="contact_messages_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Name', 'Email', 'Phone', 'Company Name',
            'Message', 'Status', 'Created At'
        ])
        
        for message in queryset:
            writer.writerow([
                message.id,
                message.name,
                message.email,
                message.phone or '',
                message.company_name or '',
                message.message,
                message.get_status_display(),
                message.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response
    export_to_csv.short_description = "Export selected to CSV"
    
    def has_add_permission(self, request):
        """Disable manual addition of contact messages through admin"""
        return False
    
    def get_queryset(self, request):
        """Customize queryset for performance"""
        qs = super().get_queryset(request)
        return qs.select_related()
    
    def changelist_view(self, request, extra_context=None):
        """Add extra context to change list view"""
        extra_context = extra_context or {}
        
        # Get statistics
        total_messages = ContactMessage.objects.count()
        new_messages = ContactMessage.objects.filter(status='new').count()
        resolved_messages = ContactMessage.objects.filter(status='resolved').count()
        
        extra_context['total_messages'] = total_messages
        extra_context['new_messages'] = new_messages
        extra_context['resolved_messages'] = resolved_messages
        
        return super().changelist_view(request, extra_context=extra_context)