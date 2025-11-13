from django.urls import path
from .views import (
    CategoryListAPIView, CategorySubCategoriesAPIView,
    SubCategoryProductsAPIView, ProductListAPIView,
    ProductDetailAPIView, ProductSearchAPIView,
    BrandListAPIView
)

app_name = 'products'

urlpatterns = [
    # Category Endpoints
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('categories/<int:category_id>/subcategories/', CategorySubCategoriesAPIView.as_view(), name='category-subcategories'),
    
    # Subcategory Endpoints (Products under category/subcategory)
    path('categories/<int:category_id>/subcategories/<int:subcategory_id>/products/', SubCategoryProductsAPIView.as_view(), name='subcategory-products'),
    
    # Product Endpoints
    path('', ProductListAPIView.as_view(), name='product-list'),
    path('<int:product_id>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('search/', ProductSearchAPIView.as_view(), name='product-search'),
    
    # Utility Endpoints
    path('brands/', BrandListAPIView.as_view(), name='brand-list'),
]