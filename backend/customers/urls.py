
from django.urls import path
from .views import CustomerView

urlpatterns = [
    path("customer/", CustomerView.as_view(), name="customer"),  
    path("customer/<int:customer_id>/",CustomerView.as_view(),name="customer-detail"),

]
