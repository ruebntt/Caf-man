from django.urls import path
from .views import (OrderListView, OrderCreateView, OrderUpdateView, OrderStatusUpdateView,
                    OrderDeleteView, OrderRevenueView)

urlpatterns = [
    path('', OrderListView.as_view(), name='order_list'),
    path('create/', OrderCreateView.as_view(), name='order_create'),
    path('<int:pk>/update/', OrderUpdateView.as_view(), name='order_update'),
    path('<int:pk>/update-status/', OrderStatusUpdateView.as_view(), name='order_update_status'),
    path('<int:pk>/delete/', OrderDeleteView.as_view(), name='order_delete'),
    path('revenue/', OrderRevenueView.as_view(), name='order_revenue'),
]
