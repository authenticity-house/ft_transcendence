# Generated by Django 5.0.2 on 2024-04-02 02:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Match",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("data", models.JSONField()),
                ("player1_rating", models.IntegerField()),
                ("player2_rating", models.IntegerField()),
                (
                    "player1_attack_type",
                    models.CharField(
                        choices=[
                            ("TYPE0", "공격형"),
                            ("TYPE1", "방어형"),
                            ("TYPE2", "혼합형"),
                        ],
                        max_length=5,
                    ),
                ),
                (
                    "player2_attack_type",
                    models.CharField(
                        choices=[
                            ("TYPE0", "공격형"),
                            ("TYPE1", "방어형"),
                            ("TYPE2", "혼합형"),
                        ],
                        max_length=5,
                    ),
                ),
                ("create_date", models.DateTimeField(auto_now_add=True)),
                (
                    "player1_id",
                    models.ForeignKey(
                        default=1,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="player1_stats",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "player2_id",
                    models.ForeignKey(
                        default=1,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="player2_stats",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "managed": True,
            },
        ),
    ]