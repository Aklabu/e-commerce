from django.urls import path
from .views import ContactMessageCreateAPIView

app_name = 'contact'

urlpatterns = [
    # Public endpoint for contact form submission
    path('', ContactMessageCreateAPIView.as_view(), name='contact-create'),
]