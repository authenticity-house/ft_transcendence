# Generated by Django 5.0.2 on 2024-04-06 21:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_alter_user_profile_url"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="profile_url",
            field=models.CharField(default="/profile/default.png", max_length=250),
        ),
        migrations.CreateModel(
            name="Friendship",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date_joined", models.DateTimeField(auto_now_add=True)),
                (
                    "user1",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user1_friendship",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "user2",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user2_friendship",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="user",
            name="friends",
            field=models.ManyToManyField(
                blank=True, through="users.Friendship", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]
