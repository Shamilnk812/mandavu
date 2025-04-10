# Generated by Django 5.0.7 on 2025-03-13 05:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('owners', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=225, unique=True)),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_user', models.BooleanField(default=False)),
                ('is_owner', models.BooleanField(default=False)),
                ('date_joined', models.DateTimeField(auto_now_add=True)),
                ('is_online', models.BooleanField(default=False)),
                ('last_seen', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BookingDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('facilities', models.CharField(max_length=225)),
            ],
        ),
        migrations.CreateModel(
            name='OneTimePassword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=225, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField()),
                ('review', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='TempBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserInquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=225)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('customuser_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('users.customuser',),
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('phone', models.CharField(max_length=12)),
                ('additional_phone', models.CharField(max_length=12)),
                ('city', models.CharField(max_length=150)),
                ('state', models.CharField(max_length=150)),
                ('address', models.TextField()),
                ('times', models.JSONField(default=list)),
                ('dates', models.JSONField(default=list)),
                ('event_name', models.CharField(default='Default Event Name', max_length=225)),
                ('event_details', models.TextField(blank=True, null=True)),
                ('package_name', models.CharField(blank=True, max_length=225, null=True)),
                ('condition', models.CharField(max_length=150)),
                ('extra_ac_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('booking_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('remaining_amount', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('status', models.CharField(choices=[('Booking Confirmed', 'Booking Confirmed'), ('Booking Completed', 'Booking Completed'), ('Booking Canceled', 'Booking Canceled')], default='Booking Confirmed', max_length=150)),
                ('cancel_reason', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('payment_intent_id', models.CharField(blank=True, max_length=255, null=True)),
                ('package_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='owners.bookingpackages')),
            ],
        ),
    ]
