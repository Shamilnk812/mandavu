# Generated by Django 5.0.7 on 2025-04-09 05:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('owners', '0003_tempownerandvenuedetails_created_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='venue',
            name='blocking_reason',
            field=models.TextField(blank=True, null=True),
        ),
    ]
