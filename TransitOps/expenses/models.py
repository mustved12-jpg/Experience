from django.db import models
import uuid


class Expense(models.Model):
    EXPENSE_TYPES = [
        ('Tolls', 'Tolls'),
        ('Parking', 'Parking'),
        ('Food', 'Food'),
        ('Lodging', 'Lodging'),
        ('Repairs', 'Repairs'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_id = models.CharField(max_length=100)
    expense_type = models.CharField(max_length=50, choices=EXPENSE_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.expense_type} for {self.vehicle_id}"
