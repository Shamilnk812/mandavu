# Generated by Django 5.0.7 on 2024-08-11 18:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('owners', '0002_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='venue',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='owners.venue'),
        ),
        migrations.AddField(
            model_name='bookingdetails',
            name='booking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.booking'),
        ),
        migrations.AddField(
            model_name='onetimepassword',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.user'),
        ),
        migrations.AddField(
            model_name='booking',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.user'),
        ),
    ]
