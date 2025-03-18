from django.db import models
from django.core.validators import MinValueValidator
from django.db.models import Sum


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В ожидании'),
        ('ready', 'Готово'),
        ('paid', 'Оплачено'),
    ]

    table_number = models.PositiveIntegerField(
        verbose_name='Номер стола',
        validators=[MinValueValidator(1)],
    )
    items = models.JSONField(
        verbose_name='Список блюд',
        default=list,
        help_text='Формат: [{"name": "Блюдо", "price": 100, "quantity": 1}]',
    )
    total_price = models.IntegerField(default=0, editable=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name='Статус заказа')
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total_price(self):
        """Recalculates the cost of an order based on the list of dishes."""
        self.total_price = sum(item.get('price', 0) * item.get('quantity', 1) for item in self.items)

    def save(self, *args, **kwargs):
        self.calculate_total_price()
        super().save(*args, **kwargs)

    @classmethod
    def get_total_revenue(cls):
        """Revenue calculation for all paid orders."""
        return cls.objects.filter(status='paid').aggregate(Sum('total_price'))['total_price__sum'] or 0

    def __str__(self):
        return f'Заказ #{self.id} (Стол {self.table_number}) - {self.get_status_display()}'
