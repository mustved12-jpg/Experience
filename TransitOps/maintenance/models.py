from django.db import models
from vehicles.models import *

# Create your models here.
class MaintenanceLog(models.Model):
    on_off=[
        ("ON",'ON'),
        ("OFF",'OFF')
    ]
    vehicle = models.ForeignKey(Vehicle, on_delete=models.PROTECT)
    # title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    Status = models.CharField(max_length=10,choices=on_off)
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)