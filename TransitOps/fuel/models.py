from django.db import models
from trips.models import * 
from vehicles.models import *
# Create your models here.
class FuelLog(models.Model):
    Trip = models.ForeignKey(Trip,on_delete=models.CASCADE)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    liters = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)