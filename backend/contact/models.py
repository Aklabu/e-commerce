from django.db import models
from django.core.validators import RegexValidator


class MessageStatus(models.TextChoices):
    """Enum for contact message status"""
    NEW = 'new', 'New'
    RESOLVED = 'resolved', 'Resolved'


class ContactMessage(models.Model):
    """Model for storing contact form submissions"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        null=True
    )
    
    company_name = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=MessageStatus.choices,
        default=MessageStatus.NEW
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contact_messages'
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.email} ({self.status})"
    
    def mark_as_resolved(self):
        """Mark message as resolved"""
        self.status = MessageStatus.RESOLVED
        self.save()
    
    def mark_as_new(self):
        """Mark message as new"""
        self.status = MessageStatus.NEW
        self.save()