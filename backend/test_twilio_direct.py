#!/usr/bin/env python3
"""
Direct Twilio SMS test - bypasses all service layers
"""

import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("🔍 Direct Twilio SMS Test")
print("=" * 60)

# Get credentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
messaging_service_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID")
phone_number = os.getenv("ALERT_PHONE_NUMBERS")

print(f"\n✓ Account SID: {account_sid[:10]}...{account_sid[-4:]}")
print(f"✓ Auth Token: {'*' * 20}")
print(f"✓ Messaging Service SID: {messaging_service_sid[:10]}...{messaging_service_sid[-4:]}")
print(f"✓ Phone Number: {phone_number}")

# Try to import Twilio
print("\n" + "=" * 60)
print("📦 Checking Twilio Package")
print("=" * 60)

try:
    from twilio.rest import Client
    print("✅ Twilio package imported successfully")
except ImportError as e:
    print(f"❌ Twilio package not found: {e}")
    print("\nInstall with: pip install twilio")
    exit(1)

# Create client
print("\n" + "=" * 60)
print("🔌 Creating Twilio Client")
print("=" * 60)

try:
    client = Client(account_sid, auth_token)
    print("✅ Twilio client created successfully")
except Exception as e:
    print(f"❌ Failed to create client: {e}")
    exit(1)

# Send test SMS
print("\n" + "=" * 60)
print("📱 Sending Test SMS")
print("=" * 60)

test_message = """🌾 BalirajaSahayak Test SMS

This is a test message to verify your Twilio SMS integration is working correctly.

If you receive this, your SMS alerts are configured properly!

- BalirajaSahayak Team"""

print(f"\nTo: {phone_number}")
print(f"Message: {test_message[:50]}...")

try:
    message = client.messages.create(
        body=test_message,
        messaging_service_sid=messaging_service_sid,
        to=phone_number
    )
    
    print(f"\n✅ SMS SENT SUCCESSFULLY!")
    print(f"📝 Message SID: {message.sid}")
    print(f"📊 Status: {message.status}")
    print(f"📍 To: {message.to}")
    print(f"📅 Date: {message.date_created}")
    
    print("\n" + "=" * 60)
    print("🎉 SUCCESS! Check your phone for the SMS!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ FAILED TO SEND SMS")
    print(f"Error: {e}")
    print("\n" + "=" * 60)
    print("🔍 Troubleshooting:")
    print("=" * 60)
    print("1. Check if your Twilio account is active")
    print("2. Verify phone number is verified in Twilio Console")
    print("3. Check Twilio account balance")
    print("4. Verify Auth Token is correct")
    print("5. Check Messaging Service SID is correct")
    print("\nTwilio Console: https://console.twilio.com/")
    exit(1)

print("\n✅ Test completed successfully!")
