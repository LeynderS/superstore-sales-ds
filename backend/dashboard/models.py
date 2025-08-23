# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Regions(models.Model):
    name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'regions'
        
        
class States(models.Model):
    name = models.CharField(unique=True, max_length=50)
    region = models.ForeignKey(Regions, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'states'
             
        
class Locations(models.Model):
    country = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    state = models.ForeignKey('States', models.DO_NOTHING)
    postal_code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'locations'
        unique_together = (('city', 'state', 'postal_code'),)
        
        
class Segments(models.Model):
    name = models.CharField(unique=True, max_length=25)

    class Meta:
        managed = False
        db_table = 'segments'
        

class Customers(models.Model):
    id = models.CharField(primary_key=True, max_length=10)
    name = models.CharField(max_length=100)
    segment = models.ForeignKey('Segments', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'customers'
        
  
class Categories(models.Model):
    name = models.CharField(unique=True, max_length=25)

    class Meta:
        managed = False
        db_table = 'categories'


class SubCategories(models.Model):
    name = models.CharField(unique=True, max_length=25)
    category = models.ForeignKey(Categories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'sub_categories'


class Products(models.Model):
    id = models.CharField(primary_key=True, max_length=15)
    name = models.CharField(max_length=255)
    sub_category = models.ForeignKey('SubCategories', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'products'


class ShipModes(models.Model):
    name = models.CharField(unique=True, max_length=25)

    class Meta:
        managed = False
        db_table = 'ship_modes'
        
        
class OrderDetails(models.Model):
    row_id = models.IntegerField(primary_key=True)
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    sales = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'order_details'


class Orders(models.Model):
    id = models.CharField(primary_key=True, max_length=20)
    order_date = models.DateField()
    ship_date = models.DateField()
    ship_mode = models.ForeignKey('ShipModes', models.DO_NOTHING)
    customer = models.ForeignKey(Customers, models.DO_NOTHING)
    location = models.ForeignKey(Locations, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'orders'
