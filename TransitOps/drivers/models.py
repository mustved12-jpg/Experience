from django.db import models
import uuid


class Driver(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('On_Trip', 'On Trip'),
        ('Off_Duty', 'Off Duty'),
        ('Suspended', 'Suspended'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50, unique=True)
    license_category = models.CharField(max_length=50)
    license_expiry_date = models.DateField()
    contact_number = models.CharField(max_length=20)
    safety_score = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
