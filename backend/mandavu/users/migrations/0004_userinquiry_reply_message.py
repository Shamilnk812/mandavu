# Generated by Django 5.0.7 on 2025-04-11 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_customuser_blocking_reason'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinquiry',
            name='reply_message',
            field=models.TextField(blank=True, null=True),
        ),
    ]
