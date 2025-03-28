# Generated by Django 5.0.7 on 2025-03-13 05:37

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='chatrooms',
            name='user1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chatroom_as_user1', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='chatrooms',
            name='user2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chatroom_as_user2', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='messages',
            name='chat_room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message', to='chat.chatrooms'),
        ),
        migrations.AddField(
            model_name='messages',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='chatrooms',
            constraint=models.UniqueConstraint(condition=models.Q(('user1__lt', models.F('user2'))), fields=('user1', 'user2'), name='unique_chat_room'),
        ),
    ]
