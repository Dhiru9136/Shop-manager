from django.db import models
from django.contrib.auth.models import User


class M_User(models.Model):
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="M_User"
    )

    email_id = models.CharField(max_length=100, blank=True, null=True)
    primary_mobile_number = models.CharField(max_length=100, blank=True, null=True)
    secondary_mobile_number = models.CharField(max_length=100, blank=True, null=True)
    role_id = models.IntegerField(null=True, blank=True)
    user_address = models.CharField(max_length=255, blank=True, null=True)
    user_address_2 = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_date = models.DateField(null=True, blank=True)
    created_by = models.IntegerField(null=True, blank=True)
    login_count = models.IntegerField(null=True, blank=True)
    is_locked = models.BooleanField(default=False)
    gender = models.CharField(max_length=50, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    qualification = models.CharField(max_length=100, null=True, blank=True)
    landmark = models.CharField(max_length=100, null=True, blank=True)
    city_id = models.IntegerField(null=True, blank=True)
    state_id = models.IntegerField(null=True, blank=True)
    pincode = models.CharField(max_length=50, null=True, blank=True)
    emergency_number = models.CharField(max_length=100, null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    modified_by = models.IntegerField(null=True, blank=True)
    modified_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "m_user"

    def __str__(self):
        return self.user.id