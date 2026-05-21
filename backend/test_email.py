"""
Test script for email service.
Run this to verify your Gmail SMTP configuration.
"""

import os
from dotenv import load_dotenv
from services.email_service import send_email, send_welcome_email

# Load environment variables
load_dotenv()

def test_basic_email():
    """Test basic email sending."""
    print("🧪 Testing basic email...")
    
    email = os.getenv("GMAIL_EMAIL")
    if not email:
        print("❌ GMAIL_EMAIL not set in .env")
        return False
    
    result = send_email(
        to_email=email,  # Send to yourself for testing
        subject="🌾 BalirajaSahayak Email Test",
        message="This is a test email from BalirajaSahayak Smart Agriculture Platform.\n\nIf you received this, your email configuration is working! 🎉",
        html_content="""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2e7d32;">🌾 BalirajaSahayak Email Test</h2>
            <p>This is a test email from <strong>BalirajaSahayak Smart Agriculture Platform</strong>.</p>
            <p>If you received this, your email configuration is working! 🎉</p>
            <hr>
            <p style="color: #666; font-size: 12px;">BalirajaSahayak - Smart Agriculture Platform</p>
        </body>
        </html>
        """
    )
    
    if result.get("success"):
        print(f"✅ Email sent successfully to {result['sent_to']}")
        print(f"   Subject: {result['subject']}")
        return True
    else:
        print(f"❌ Failed to send email: {result.get('error')}")
        return False


def test_welcome_email():
    """Test welcome email with weather data."""
    print("\n🧪 Testing welcome email with weather data...")
    
    email = os.getenv("GMAIL_EMAIL")
    if not email:
        print("❌ GMAIL_EMAIL not set in .env")
        return False
    
    # Sample weather data
    weather_data = {
        "temperature": 28,
        "rainfall": 2.5,
        "humidity": 65,
        "wind_speed": 12,
        "condition": "Partly Cloudy"
    }
    
    severity_info = {
        "is_severe": False,
        "severity": "Normal",
        "anomaly": "None"
    }
    
    result = send_welcome_email(
        email=email,
        location="Pune",
        weather_data=weather_data,
        severity_info=severity_info
    )
    
    if result.get("success"):
        print(f"✅ Welcome email sent successfully to {result['sent_to']}")
        return True
    else:
        print(f"❌ Failed to send welcome email: {result.get('error')}")
        return False


def test_severe_weather_email():
    """Test email with severe weather alert."""
    print("\n🧪 Testing severe weather alert email...")
    
    email = os.getenv("GMAIL_EMAIL")
    if not email:
        print("❌ GMAIL_EMAIL not set in .env")
        return False
    
    # Sample severe weather data
    weather_data = {
        "temperature": 44,
        "rainfall": 15,
        "humidity": 92,
        "wind_speed": 55,
        "condition": "Thunderstorm"
    }
    
    severity_info = {
        "is_severe": True,
        "severity": "High",
        "anomaly": "Extreme Heat + Heavy Rainfall + Strong Winds"
    }
    
    result = send_welcome_email(
        email=email,
        location="Mumbai",
        weather_data=weather_data,
        severity_info=severity_info
    )
    
    if result.get("success"):
        print(f"✅ Severe weather alert email sent successfully to {result['sent_to']}")
        return True
    else:
        print(f"❌ Failed to send alert email: {result.get('error')}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("📧 BalirajaSahayak Email Service Test")
    print("=" * 60)
    
    # Check configuration
    email = os.getenv("GMAIL_EMAIL")
    password = os.getenv("GMAIL_APP_PASSWORD")
    
    print(f"\n📋 Configuration:")
    print(f"   GMAIL_EMAIL: {email if email else '❌ Not set'}")
    print(f"   GMAIL_APP_PASSWORD: {'✅ Set' if password else '❌ Not set'}")
    
    if not email or not password:
        print("\n" + "=" * 60)
        print("⚠️  EMAIL NOT CONFIGURED")
        print("=" * 60)
        print("\nTo enable email alerts, follow these steps:")
        print("\n1. Enable 2-Step Verification in your Google Account:")
        print("   https://myaccount.google.com/security")
        print("\n2. Generate an App Password:")
        print("   https://myaccount.google.com/apppasswords")
        print("   - Select 'Mail' and 'Windows Computer'")
        print("   - Copy the 16-character password")
        print("\n3. Update your .env file:")
        print("   GMAIL_EMAIL=your_email@gmail.com")
        print("   GMAIL_APP_PASSWORD=your_16_char_app_password")
        print("\n4. Run this test again!")
        print("=" * 60)
        exit(1)
    
    print("\n" + "=" * 60)
    print("🚀 Running Tests...")
    print("=" * 60)
    
    # Run tests
    test1 = test_basic_email()
    test2 = test_welcome_email()
    test3 = test_severe_weather_email()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    print(f"Basic Email:          {'✅ PASS' if test1 else '❌ FAIL'}")
    print(f"Welcome Email:        {'✅ PASS' if test2 else '❌ FAIL'}")
    print(f"Severe Weather Alert: {'✅ PASS' if test3 else '❌ FAIL'}")
    print("=" * 60)
    
    if all([test1, test2, test3]):
        print("\n🎉 All tests passed! Email service is working perfectly!")
        print("\n📧 Check your inbox at:", email)
        print("   You should have received 3 test emails.")
    else:
        print("\n❌ Some tests failed. Check the error messages above.")
    
    print("\n" + "=" * 60)
