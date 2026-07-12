from django.db import models
from vehicles.models import Vehicle 

# Create your models here.
class Expense(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    expense_type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    # notes = models.TextField(blank=True)
