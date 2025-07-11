# Generated by Django 5.2.3 on 2025-06-25 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0002_achievement_certification_education_experience_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='resume',
            name='email',
            field=models.EmailField(blank=True, help_text='Email address', max_length=254),
        ),
        migrations.AddField(
            model_name='resume',
            name='github_url',
            field=models.URLField(blank=True, help_text='GitHub profile URL'),
        ),
        migrations.AddField(
            model_name='resume',
            name='linkedin_url',
            field=models.URLField(blank=True, help_text='LinkedIn profile URL'),
        ),
        migrations.AddField(
            model_name='resume',
            name='location',
            field=models.CharField(blank=True, help_text='City, State or City, Country', max_length=200),
        ),
        migrations.AddField(
            model_name='resume',
            name='name',
            field=models.CharField(blank=True, help_text='Full name for the resume header', max_length=200),
        ),
        migrations.AddField(
            model_name='resume',
            name='phone',
            field=models.CharField(blank=True, help_text='Phone number', max_length=20),
        ),
        migrations.AddField(
            model_name='resume',
            name='professional_title',
            field=models.CharField(blank=True, help_text='Professional title/job position', max_length=200),
        ),
        migrations.AddField(
            model_name='resume',
            name='twitter_url',
            field=models.URLField(blank=True, help_text='Twitter profile URL'),
        ),
        migrations.AddField(
            model_name='resume',
            name='website_url',
            field=models.URLField(blank=True, help_text='Portfolio/personal website URL'),
        ),
    ]
