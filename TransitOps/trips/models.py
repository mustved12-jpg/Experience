from django.db import models

# Create your models here.
from vehicles.models import Vehicle
from drivers.models import Driver
class Trip(models.Model):
    all_stetus=[
        ('DRAFT','DRAFT'),
        ('DISPATCHED','DISPATCHED'),
        ('COMPLETED','COMPLETED'),
        ('CANCELLED','CANCELLED')
    ]
    
    # source = models.CharField(max_length=150)
    # destination = models.CharField(max_length=150)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2)
    # planned_distance = models.DecimalField(max_digits=10, decimal_places=2)
    # final_odometer = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    # fuel_consumed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # status = models.CharField(max_length=20,choices=all_stetus)
    created_at = models.DateTimeField(auto_now_add=True)
