from rest_framework import serializers
from .models import Category, SubCategory, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    subcategories_count = serializers.IntegerField(
        source='subcategories.count',
        read_only=True
    )
    products_count = serializers.IntegerField(
        source='products.count',
        read_only=True
    )
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'image', 'subcategories_count',
            'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubCategorySerializer(serializers.ModelSerializer):
    """Serializer for SubCategory model"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    products_count = serializers.IntegerField(
        source='products.count',
        read_only=True
    )
    
    class Meta:
        model = SubCategory
        fields = [
            'id', 'category', 'category_name', 'name',
            'image', 'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubCategoryListSerializer(serializers.ModelSerializer):
    """Simplified serializer for subcategory listing"""
    
    products_count = serializers.IntegerField(
        source='products.count',
        read_only=True
    )
    
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'image', 'products_count']


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for Product list view"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'code', 'brand', 'short_description',
            'category', 'category_name', 'subcategory', 'subcategory_name',
            'availability', 'primary_image', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_primary_image(self, obj):
        """Get the first image of the product"""
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return {
                    'id': first_image.id,
                    'image': request.build_absolute_uri(first_image.image.url),
                    'alt_text': first_image.alt_text
                }
            return {
                'id': first_image.id,
                'image': first_image.image.url,
                'alt_text': first_image.alt_text
            }
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for Product detail view"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    relevant_products = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'code', 'brand', 'short_description',
            'full_description', 'category', 'category_name',
            'subcategory', 'subcategory_name', 'availability',
            'images', 'relevant_products', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_relevant_products(self, obj):
        """Get related products from same category/subcategory"""
        related_products = obj.get_relevant_products(limit=5)
        return ProductListSerializer(
            related_products,
            many=True,
            context=self.context
        ).data


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Serializer for Category detail with subcategories"""
    
    subcategories = SubCategoryListSerializer(many=True, read_only=True)
    products_count = serializers.IntegerField(
        source='products.count',
        read_only=True
    )
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'image', 'subcategories',
            'products_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']