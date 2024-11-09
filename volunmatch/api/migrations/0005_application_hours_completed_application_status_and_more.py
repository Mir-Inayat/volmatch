# Generated by Django 5.1.3 on 2024-11-08 20:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_volunteer_facebook_url_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='hours_completed',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='application',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected'), ('completed', 'Completed')], default='pending', max_length=20),
        ),
        migrations.AlterField(
            model_name='application',
            name='opportunity',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.volunteeropportunity'),
        ),
    ]