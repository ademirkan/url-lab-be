from django.db import models

class URL(models.Model):
    id = models.CharField(max_length=50, unique=True, primary_key=True)
    target = models.CharField(max_length=200)
    count = models.IntegerField(default=0)