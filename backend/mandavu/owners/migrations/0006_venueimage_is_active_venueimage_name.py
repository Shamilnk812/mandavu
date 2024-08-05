# Generated by Django 5.0.7 on 2024-08-03 08:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('owners', '0005_event_is_active_facility_is_active_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='venueimage',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='venueimage',
            name='name',
            field=models.CharField(default='exit', max_length=150),
            preserve_default=False,
        ),
    ]
