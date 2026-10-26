from django.db import models
from django.conf import settings
# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Customer(models.Model):
    customer_name = models.CharField(max_length=100)

    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="customers"
)
    phone_number = models.CharField(max_length=15, db_index=True)
    account_number = models.CharField(max_length=30)
    bank_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_date = models.DateField()
    transaction = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.customer_name
    