# Generated by Django 5.0.2 on 2024-04-03 22:08

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("stats", "0002_alter_match_options_rename_player1_id_match_player1_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="match",
            name="winner",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.SET_DEFAULT,
                related_name="winner",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]