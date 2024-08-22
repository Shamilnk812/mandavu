# Generated by Django 5.0.7 on 2024-08-21 15:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
        ('owners', '0005_onetimepasswordforowner_created_at_owner_is_approved'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='venue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='owners.venue'),
        ),
    ]
