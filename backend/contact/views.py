from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings

from .models import ContactMessage
from .serializers import ContactMessageSerializer
from utils.response import CustomResponse


class ContactMessageCreateAPIView(APIView):
    """API view for submitting contact form"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle contact form submission"""
        serializer = ContactMessageSerializer(data=request.data)
        
        if serializer.is_valid():
            contact_message = serializer.save()
            
            # Send notification email to admin (optional)
            self.send_notification_email(contact_message)
            
            # Send confirmation email to user (optional)
            self.send_confirmation_email(contact_message)
            
            return CustomResponse.success(
                data={
                    'id': contact_message.id,
                    'name': contact_message.name,
                    'email': contact_message.email,
                    'created_at': contact_message.created_at.strftime("%Y-%m-%dT%H:%M:%SZ")
                },
                message="Thank you for contacting us! We'll get back to you soon.",
                status_code=status.HTTP_201_CREATED
            )
        
        return CustomResponse.error(
            message="Failed to submit contact form",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )
    
    def send_notification_email(self, contact_message):
        """Send notification email to admin about new contact message"""
        subject = f"New Contact Form Submission from {contact_message.name}"
        message = f"""
New contact form submission:

Name: {contact_message.name}
Email: {contact_message.email}
Phone: {contact_message.phone or 'Not provided'}
Company: {contact_message.company_name or 'Not provided'}

Message:
{contact_message.message}

Submitted at: {contact_message.created_at.strftime("%Y-%m-%d %H:%M:%S")}
"""
        
        try:
            # Send to admin email (configure in settings)
            admin_email = getattr(settings, 'ADMIN_EMAIL', settings.DEFAULT_FROM_EMAIL)
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [admin_email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send admin notification email: {str(e)}")
    
    def send_confirmation_email(self, contact_message):
        """Send confirmation email to user"""
        subject = "Thank you for contacting Seidik Ecommerce"
        message = f"""
Dear {contact_message.name},

Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.

Your message:
{contact_message.message}

Best regards,
Seidik Ecommerce Team
"""
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [contact_message.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send confirmation email: {str(e)}")