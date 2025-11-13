# 🛒 E-Commerce API

A comprehensive Django REST Framework-based ecommerce backend API with advanced authentication, product management, and customer interaction features.

## Key Features

### Authentication & User Management
- **Custom User Model** with email-based authentication
- **Multi-step Registration Flow** for both Retail and Trade customers
  - Step 1: Account creation with email and password
  - Step 2: Billing address information
  - Step 3: Delivery address information
  - Step 4: Trade information (for Trade customers only)
  - Step 5: Email verification with OTP
- **JWT Authentication** with access and refresh tokens
- **Email Verification System** using 8-digit OTP (10-minute expiry)
- **Password Management**
  - Forgot password with OTP verification
  - Reset password functionality
  - Change password for authenticated users
- **Two Customer Types**: Retail and Trade with different registration workflows
- **Trade Customer Features**
  - Business type selection (Electrician, Contractor, Reseller, Other)
  - Document upload support (up to 5 documents per application)
  - Admin approval system for trade accounts

### Profile Management
- **Comprehensive User Profiles** with full CRUD operations
- **Multiple Address Support**
  - Billing addresses with company details (VAT, registration number, PO number)
  - Delivery addresses with flexible configuration
  - Support for multiple addresses per user
- **South African Province Support** (all 9 provinces)
- **Profile Update API** with nested address and trade information updates

### Product Catalog
- **Category Management**
  - Category images
  - Auto-generated slugs
  - Product count per category
- **Product Management**
  - Detailed product information (title, short description, full description)
  - Multi-image support (up to 5 images per product)
  - Availability status (Active/Inactive)
  - Popularity tracking with auto-increment on views
- **Advanced Product Filtering**
  - Filter by category
  - Search across title, short description, and full description
  - Sort by title, popularity, or creation date (ascending/descending)
- **Pagination**: 9 products per page
- **Related Products**: Automatic suggestions from the same category
- **Primary Image Selection**: Auto-select first image as primary

### Contact Form System
- **Public Contact Form** submission
- **Status Tracking** (New/Resolved)
- **Email Notifications**
  - Admin notification on new submission
  - User confirmation email
- **Admin Features**
  - Bulk status updates
  - CSV export functionality
  - Statistics dashboard (total, new, resolved messages)

### Admin Panel Features
- **Jazzmin Theme** for modern admin interface
- **Advanced Admin Configurations**
  - Image previews for categories and products
  - Bulk actions (approve/reject trade applications, activate/deactivate products)
  - Custom filters and search fields
  - Date hierarchy navigation
  - Inline editing for product images
  - CSV export for contact messages
- **Statistics & Metrics**
  - Product counts per category
  - Image counts per product with color-coded indicators
  - Contact message statistics
- **Optimized Querysets** with select_related and prefetch_related

### Technical Features
- **RESTful API Design** with consistent response format
- **Custom Response Handler** for standardized API responses
- **Custom Exception Handler** for consistent error formatting
- **API Documentation**
  - Swagger UI (`/api/docs/`)
  - ReDoc (`/api/redoc/`)
  - OpenAPI Schema (`/api/schema/`)
- **JWT Token Management**
  - Access token: 60 minutes lifetime
  - Refresh token: 7 days lifetime
  - Token rotation and blacklisting
  - Remember me functionality (30-day refresh token)
- **CORS Support** for frontend integration
- **File Upload Support** with validation (10MB limit, PDF/JPG/PNG only)
- **Security Features**
  - Password validation
  - Phone number validation (international format)
  - Email validation
  - Production-ready security settings

## Technology Stack

- **Backend Framework**: Django 5.2.7
- **API Framework**: Django REST Framework
- **Authentication**: Simple JWT
- **Database**: SQLite (development) / PostgreSQL-ready
- **API Documentation**: drf-spectacular
- **Admin Interface**: Jazzmin
- **CORS**: django-cors-headers

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)


## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/seidik-ecommerce-api.git
   cd seidik-ecommerce-api
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (create `.env` file)
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   # Email Configuration (for production)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new customer (Step 1)
- `POST /api/accounts/register/billing-address/` - Add billing address (Step 2)
- `POST /api/accounts/register/delivery-address/` - Add delivery address (Step 3)
- `POST /api/accounts/register/trade-info/` - Add trade information (Step 4 - Trade only)
- `POST /api/accounts/verify-email/` - Verify email with OTP
- `POST /api/accounts/resend-otp/` - Resend verification OTP
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/logout/` - User logout
- `POST /api/accounts/token/refresh/` - Refresh JWT token

### Password Management
- `POST /api/accounts/forgot-password/` - Request password reset OTP
- `POST /api/accounts/verify-reset-otp/` - Verify password reset OTP
- `POST /api/accounts/reset-password/` - Reset password with OTP
- `POST /api/accounts/change-password/` - Change password (authenticated)

### Profile
- `GET /api/accounts/profile/` - Get user profile
- `PATCH /api/accounts/profile/update/` - Update user profile

### Products
- `GET /api/products/categories/` - List all categories
- `GET /api/products/categories/<slug>/` - Get category details with products
- `GET /api/products/list/` - List products (with filters, search, sorting)
  - Query params: `?category=<slug>&search=<query>&ordering=<field>`
- `GET /api/products/detail/<id>/` - Get product details

### Contact
- `POST /api/contact/` - Submit contact form

### Documentation
- `GET /api/docs/` - Swagger UI documentation
- `GET /api/redoc/` - ReDoc documentation
- `GET /api/schema/` - OpenAPI schema


## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-11-02T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "data": { "field": ["Error details"] },
  "timestamp": "2025-11-02T10:30:00Z"
}
```


## Admin Panel

Access the admin panel at `http://localhost:8000/admin/`

Features:
- Customer management with verification status
- Trade application approval workflow
- Product and category management with image previews
- Contact message tracking and resolution
- Bulk actions and CSV exports
- Advanced filtering and search

## Security Considerations

- Change `SECRET_KEY` in production
- Set `DEBUG = False` in production
- Configure proper `ALLOWED_HOSTS`
- Use HTTPS in production
- Set up proper email backend (SMTP)
- Configure database (PostgreSQL recommended for production)
- Enable security middleware settings
- Regularly update dependencies