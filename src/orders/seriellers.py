from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    # Process the items field as a list of dictionaries
    items = serializers.ListField(child=serializers.DictField())

    class Meta:
        model = Order
        fields = ['id', 'table_number', 'items', 'total_price', 'status', 'created_at']
        read_only_fields = ['total_price', 'created_at']

    def validate_items(self, value):
        """
        Checking for mandatory fields for each dish.
        """
        for item in value:
            if 'name' not in item or 'price' not in item or 'quantity' not in item:
                raise serializers.ValidationError(
                    'Each order in items must contain the name, price and quantity fields'
                )
        return value

    def create(self, validated_data):
        items = validated_data.get('items', [])
        # Convert the price from rubles to kopecks for each dish
        for item in items:
            if 'price' in item:
                item['price'] = int(float(item['price']) * 100)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        items = validated_data.get('items', [])
        for item in items:
            if 'price' in item:
                item['price'] = int(float(item['price']) * 100)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """
        Redefine the view so that total_price and the price in each dish
        were given in rubles (divided by 100).
        """
        rep = super().to_representation(instance)
        if rep.get('total_price') is not None:
            rep['total_price'] = rep['total_price'] / 100
        if rep.get('items'):
            for item in rep['items']:
                if 'price' in item and item['price'] is not None:
                    item['price'] = item['price'] / 100
        return rep
