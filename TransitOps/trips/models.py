from django.db import models
import uuid


class Trip(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Dispatched', 'Dispatched'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    vehicle_id = models.CharField(max_length=100)
    driver_id = models.CharField(max_length=100)
    cargo_weight = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    planned_distance = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.source} -> {self.destination}"
