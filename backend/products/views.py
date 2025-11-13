from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from utils.response import CustomResponse
from .models import Category, SubCategory, Product
from .serializers import (
    CategorySerializer, CategoryDetailSerializer,
    SubCategorySerializer, SubCategoryListSerializer,
    ProductListSerializer, ProductDetailSerializer
)


class ProductPagination(PageNumberPagination):
    """Custom pagination for products with page_size=9"""
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 100


class CategoryListAPIView(APIView):
    """List all categories with optional pagination and sorting"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        categories = Category.objects.all()
        
        # Apply sorting
        sort = request.query_params.get('sort')
        if sort == 'az':
            categories = categories.order_by('name')
        elif sort == 'za':
            categories = categories.order_by('-name')
        elif sort == 'oldest':
            categories = categories.order_by('created_at')
        elif sort == 'newest':
            categories = categories.order_by('-created_at')
        # Default sorting is already 'name' from model Meta ordering
        
        # Check if pagination is requested
        page = request.query_params.get('page')
        page_size = request.query_params.get('page_size')
        
        # If either page or page_size is provided, apply pagination
        if page or page_size:
            paginator = ProductPagination()
            paginated_categories = paginator.paginate_queryset(categories, request)
            serializer = CategorySerializer(paginated_categories, many=True, context={'request': request})
            
            return paginator.get_paginated_response({
                'success': True,
                'message': 'Categories retrieved successfully',
                'data': serializer.data
            })
        
        # No pagination - return all categories
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        
        return CustomResponse.success(
            data=serializer.data,
            message='Categories retrieved successfully',
            status_code=status.HTTP_200_OK
        )


class CategorySubCategoriesAPIView(APIView):
    """List all subcategories under a specific category with optional pagination and sorting"""
    permission_classes = [AllowAny]
    
    def get(self, request, category_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return CustomResponse.error(
                message="Category not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Get all subcategories for this category
        subcategories = SubCategory.objects.filter(category=category)
        
        # Apply sorting
        sort = request.query_params.get('sort')
        if sort == 'az':
            subcategories = subcategories.order_by('name')
        elif sort == 'za':
            subcategories = subcategories.order_by('-name')
        elif sort == 'oldest':
            subcategories = subcategories.order_by('created_at')
        elif sort == 'newest':
            subcategories = subcategories.order_by('-created_at')
        # Default sorting is already 'name' from model Meta ordering
        
        # Get category info
        category_data = {
            'id': category.id,
            'name': category.name,
            'image': request.build_absolute_uri(category.image.url) if category.image else None,
            'products_count': category.products.count(),
            'created_at': category.created_at,
            'updated_at': category.updated_at
        }
        
        # Check if pagination is requested
        page = request.query_params.get('page')
        page_size = request.query_params.get('page_size')
        
        # If either page or page_size is provided, apply pagination
        if page or page_size:
            paginator = ProductPagination()
            paginated_subcategories = paginator.paginate_queryset(subcategories, request)
            
            # Serialize paginated subcategories
            subcategory_serializer = SubCategoryListSerializer(
                paginated_subcategories, 
                many=True, 
                context={'request': request}
            )
            
            return paginator.get_paginated_response({
                'success': True,
                'message': 'Subcategories retrieved successfully',
                'category': category_data,
                'data': subcategory_serializer.data
            })
        
        # No pagination - return all subcategories
        subcategory_serializer = SubCategoryListSerializer(
            subcategories, 
            many=True, 
            context={'request': request}
        )
        
        return CustomResponse.success(
            data={
                'category': category_data,
                'subcategories': subcategory_serializer.data
            },
            message='Subcategories retrieved successfully',
            status_code=status.HTTP_200_OK
        )


class SubCategoryProductsAPIView(APIView):
    """List products under a specific category and subcategory with filtering and sorting"""
    permission_classes = [AllowAny]
    
    def get(self, request, category_id, subcategory_id):
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return CustomResponse.error(
                message="Category not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            subcategory = SubCategory.objects.get(id=subcategory_id, category=category)
        except SubCategory.DoesNotExist:
            return CustomResponse.error(
                message="Subcategory not found or does not belong to this category",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Get products for this subcategory
        products = Product.objects.filter(
            category=category,
            subcategory=subcategory
        )
        
        # Apply filters
        brand = request.query_params.get('brand')
        if brand:
            products = products.filter(brand__iexact=brand)
        
        availability = request.query_params.get('availability')
        if availability:
            products = products.filter(availability=availability)
        
        # Apply sorting
        sort = request.query_params.get('sort')
        if sort == 'az':
            products = products.order_by('name')
        elif sort == 'za':
            products = products.order_by('-name')
        else:
            products = products.order_by('-created_at')
        
        # Paginate
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(paginated_products, many=True, context={'request': request})
        
        return paginator.get_paginated_response({
            'success': True,
            'message': 'Products retrieved successfully',
            'data': serializer.data
        })


class ProductListAPIView(APIView):
    """Global product list with filtering, sorting, and pagination"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        products = Product.objects.all()
        
        # Apply filters
        brand = request.query_params.get('brand')
        if brand:
            products = products.filter(brand__iexact=brand)
        
        category = request.query_params.get('category')
        if category:
            products = products.filter(category__id=category)
        
        subcategory = request.query_params.get('subcategory')
        if subcategory:
            products = products.filter(subcategory__id=subcategory)
        
        availability = request.query_params.get('availability')
        if availability:
            products = products.filter(availability=availability)
        
        # Apply sorting
        sort = request.query_params.get('sort')
        if sort == 'az':
            products = products.order_by('name')
        elif sort == 'za':
            products = products.order_by('-name')
        else:
            products = products.order_by('-created_at')
        
        # Paginate
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(paginated_products, many=True, context={'request': request})
        
        return paginator.get_paginated_response({
            'success': True,
            'message': 'Products retrieved successfully',
            'data': serializer.data
        })


class ProductDetailAPIView(APIView):
    """Product detail view"""
    permission_classes = [AllowAny]
    
    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return CustomResponse.error(
                message="Product not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        serializer = ProductDetailSerializer(product, context={'request': request})
        
        return CustomResponse.success(
            data=serializer.data,
            message="Product retrieved successfully",
            status_code=status.HTTP_200_OK
        )


class ProductSearchAPIView(APIView):
    """Search products by name, brand, or description"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return CustomResponse.error(
                message="Search query parameter 'q' is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Search in name, brand, short_description, and full_description
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(brand__icontains=query) |
            Q(short_description__icontains=query) |
            Q(full_description__icontains=query) |
            Q(code__icontains=query)
        ).distinct()
        
        # Apply sorting if provided
        sort = request.query_params.get('sort')
        if sort == 'az':
            products = products.order_by('name')
        elif sort == 'za':
            products = products.order_by('-name')
        else:
            products = products.order_by('-created_at')
        
        # Paginate
        paginator = ProductPagination()
        paginated_products = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(paginated_products, many=True, context={'request': request})
        
        return paginator.get_paginated_response({
            'success': True,
            'message': f'Found {products.count()} product(s) matching "{query}"',
            'data': serializer.data
        })


class BrandListAPIView(APIView):
    """Get list of all unique brands"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        brands = Product.objects.values_list('brand', flat=True).distinct().order_by('brand')
        
        return CustomResponse.success(
            data=list(brands),
            message="Brands retrieved successfully",
            status_code=status.HTTP_200_OK
        )