from django.db import models
import uuid

class Vehicle(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('On_Trip', 'On Trip'),
        ('In_Shop', 'In Shop'),
        ('Retired', 'Retired')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration_number = models.CharField(max_length=20, unique=True)
    vehicle_name = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50)
    max_load_capacity = models.DecimalField(max_digits=10, decimal_places=2)
    odometer = models.PositiveIntegerField(default=0)
    acquisition_cost = models.DecimalField(max_digits=13, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vehicle_name} ({self.registration_number})"
