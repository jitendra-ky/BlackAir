from django import template
from django.utils.safestring import mark_safe
import re

register = template.Library()


@register.filter
def linebreaks_to_list(value):
    """Convert line breaks to HTML list items"""
    if not value:
        return ""
    
    lines = [line.strip() for line in value.split('\n') if line.strip()]
    if not lines:
        return ""
    
    list_items = ''.join([f'<li>{line}</li>' for line in lines])
    return mark_safe(f'<ul>{list_items}</ul>')


@register.filter
def format_date_range(start_date, end_date=None):
    """Format date range for resume display"""
    if not start_date:
        return ""
    
    # Handle string dates
    if isinstance(start_date, str):
        start_str = start_date
    else:
        start_str = start_date.strftime('%Y') if hasattr(start_date, 'strftime') else str(start_date)
    
    if end_date:
        if isinstance(end_date, str):
            end_str = end_date
        else:
            end_str = end_date.strftime('%Y') if hasattr(end_date, 'strftime') else str(end_date)
        return f"{start_str} - {end_str}"
    else:
        return f"{start_str} - Present"


@register.filter
def phone_format(value):
    """Format phone number"""
    if not value:
        return ""
    
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', str(value))
    
    # Format as (XXX) XXX-XXXX if 10 digits
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    
    return value


@register.filter
def linebreaks_filter(value):
    """
    Split text by line breaks and return as a list for use in templates.
    This is useful for converting description text into bullet points.
    """
    if not value:
        return []
    
    # Split by newlines and filter out empty lines
    lines = [line.strip() for line in value.split('\n') if line.strip()]
    return lines
