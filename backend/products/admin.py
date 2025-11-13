from django.contrib import admin
from django.utils.html import format_html
from django.core.exceptions import ValidationError
from django.contrib import messages
from .models import Category, SubCategory, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model"""
    
    list_display = ['name', 'image_preview', 'subcategories_count', 'created_at']
    search_fields = ['name']  # Required for autocomplete
    ordering = ['name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'image_preview']
    list_per_page = 20  # Show 20 categories per page
    
    fieldsets = (
        ('Category Information', {
            'fields': ('name', 'image', 'image_preview')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Display image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 150px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image Preview"
    
    def subcategories_count(self, obj):
        """Display count of subcategories"""
        return obj.subcategories.count()
    subcategories_count.short_description = "Subcategories"


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    """Admin configuration for SubCategory model"""
    
    list_display = ['name', 'category', 'image_preview', 'products_count', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'category__name']  # Required for autocomplete
    ordering = ['category__name', 'name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'image_preview']
    autocomplete_fields = ['category']
    list_per_page = 20  # Show 20 subcategories per page
    
    fieldsets = (
        ('Subcategory Information', {
            'fields': ('category', 'name', 'image', 'image_preview')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Display image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 150px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image Preview"
    
    def products_count(self, obj):
        """Display count of products"""
        return obj.products.count()
    products_count.short_description = "Products"


class ProductImageInline(admin.TabularInline):
    """Inline admin for ProductImage"""
    
    model = ProductImage
    extra = 1
    max_num = 4
    readonly_fields = ['id', 'image_preview', 'created_at', 'updated_at']
    fields = ['image', 'alt_text', 'image_preview']
    
    def image_preview(self, obj):
        """Display image preview"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 80px; max-width: 120px;" />',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Preview"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model"""
    
    list_display = [
        'name', 'code', 'brand', 'category', 'subcategory',
        'availability', 'images_count', 'created_at'
    ]
    list_filter = ['availability', 'category', 'brand', 'created_at']
    search_fields = ['name', 'code', 'brand', 'short_description']  # Required for autocomplete
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['category', 'subcategory']
    inlines = [ProductImageInline]
    list_per_page = 20  # Show 20 products per page
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'brand', 'availability')
        }),
        ('Category', {
            'fields': ('category', 'subcategory'),
            'description': 'Select category first, then choose a subcategory that belongs to that category.'
        }),
        ('Description', {
            'fields': ('short_description', 'full_description')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def images_count(self, obj):
        """Display count of product images"""
        count = obj.images.count()
        if count >= 4:
            return format_html(
                '<span style="color: green; font-weight: bold;">{}/4</span>',
                count
            )
        elif count > 0:
            return format_html(
                '<span style="color: orange;">{}/4</span>',
                count
            )
        return format_html('<span style="color: red;">0/4</span>')
    images_count.short_description = "Images"
    
    def save_model(self, request, obj, form, change):
        """Override save to validate subcategory belongs to category"""
        # Validate before saving
        if obj.subcategory_id and obj.category_id:
            try:
                subcategory = SubCategory.objects.get(id=obj.subcategory_id)
                if subcategory.category_id != obj.category_id:
                    messages.error(
                        request, 
                        f'Error: "{subcategory.name}" does not belong to category "{obj.category.name}". '
                        'Please select a subcategory that matches the selected category.'
                    )
                    return
            except SubCategory.DoesNotExist:
                messages.error(request, 'Selected subcategory does not exist.')
                return
        
        super().save_model(request, obj, form, change)
        messages.success(request, f'Product "{obj.name}" was saved successfully.')