from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django_ckeditor_5.fields import CKEditor5Field


class Category(models.Model):
    """Model for product categories"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name = '1. Category'
        verbose_name_plural = '1. Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class SubCategory(models.Model):
    """Model for product subcategories"""
    
    id = models.AutoField(primary_key=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='subcategories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subcategories'
        verbose_name = '1. Sub Category'
        verbose_name_plural = '1. Sub-Categories'
        ordering = ['name']
        unique_together = ['category', 'name']
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Product(models.Model):
    """Model for products"""
    
    AVAILABILITY_CHOICES = [
        ('in_stock', 'In Stock'),
        ('out_of_stock', 'Out of Stock'),
        ('discontinued', 'Discontinued'),
    ]
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=300)
    code = models.CharField(max_length=100, unique=True, db_index=True)
    brand = models.CharField(max_length=100, db_index=True)
    short_description = CKEditor5Field(
        'Short Description',
        config_name='default',
        blank=True
    )
    full_description = CKEditor5Field(
        'Full Description',
        config_name='default',
        blank=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products'
    )
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.CASCADE,
        related_name='products'
    )
    availability = models.CharField(
        max_length=20,
        choices=AVAILABILITY_CHOICES,
        default='in_stock'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        verbose_name = '3. Product'
        verbose_name_plural = '3. Product List'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['brand', 'category']),
            models.Index(fields=['availability']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def clean(self):
        """Validate that subcategory belongs to the selected category"""
        if self.subcategory_id and self.category_id:
            # Use IDs to avoid issues with unsaved instances
            if self.subcategory.category_id != self.category_id:
                raise ValidationError({
                    'subcategory': 'Subcategory must belong to the selected category.'
                })
    
    def get_relevant_products(self, limit=5):
        """
        Get related products from the same category/subcategory.
        Excludes the current product.
        
        Args:
            limit: Maximum number of products to return (default: 5)
        
        Returns:
            QuerySet of related products
        """
        return Product.objects.filter(
            category=self.category,
            subcategory=self.subcategory,
            availability='in_stock'
        ).exclude(
            id=self.id
        ).order_by('-created_at')[:limit]


class ProductImage(models.Model):
    """Model for product images (up to 4 per product)"""
    
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='products/%Y/%m/%d/')
    alt_text = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product_images'
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Image for {self.product.name}"
    
    def clean(self):
        """Validate that product doesn't have more than 4 images"""
        if self.product_id:
            existing_images = ProductImage.objects.filter(product_id=self.product_id)
            if self.pk:
                existing_images = existing_images.exclude(pk=self.pk)
            
            if existing_images.count() >= 4:
                raise ValidationError('A product can have a maximum of 4 images.')
    
    def save(self, *args, **kwargs):
        """Override save to set default alt_text if not provided"""
        if not self.alt_text and self.product:
            self.alt_text = f"{self.product.name} image"
        super().save(*args, **kwargs)