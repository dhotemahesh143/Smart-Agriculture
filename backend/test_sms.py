#!/usr/bin/env python3
"""
Test script for Twilio SMS integration.
Run this to verify your Twilio credentials are working correctly.

Usage:
    python test_sms.py
"""

import os
from dotenv import load_dotenv
from services.sms_service import send_weather_alert_sms, is_sms_configured

# Load environment variables
load_dotenv()

def test_sms_configuration():
    """Test if SMS is properly configured."""
    print("=" * 60)
    print("🔍 Testing Twilio SMS Configuration")
    print("=" * 60)
    
    # Check environment variables
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
    messaging_service_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID", "")
    alert_numbers = os.getenv("ALERT_PHONE_NUMBERS", "")
    
    print(f"\n✓ Account SID: {account_sid[:10]}..." if account_sid else "✗ Account SID: NOT SET")
    print(f"✓ Auth Token: {'*' * 20}" if auth_token else "✗ Auth Token: NOT SET")
    print(f"✓ Messaging Service SID: {messaging_service_sid[:10]}..." if messaging_service_sid else "✗ Messaging Service SID: NOT SET")
    print(f"✓ Alert Phone Numbers: {alert_numbers}" if alert_numbers else "✗ Alert Phone Numbers: NOT SET")
    
    if is_sms_configured():
        print("\n✅ SMS is properly configured!")
        return True
    else:
        print("\n❌ SMS configuration incomplete. Please check your .env file.")
        return False


def send_test_sms():
    """Send a test SMS message."""
    print("\n" + "=" * 60)
    print("📱 Sending Test SMS")
    print("=" * 60)
    
    test_message = "🌾 BalirajaSahayak Test Alert: Your Twilio SMS integration is working perfectly! Barish is Coming Nacho 🌧️"
    
    print(f"\nMessage: {test_message}")
    print("\nSending...")
    
    result = send_weather_alert_sms(test_message, location="Test Location")
    
    print(f"\n📊 Results:")
    print(f"   ✅ Sent: {result['sent']}")
    print(f"   ❌ Failed: {result['failed']}")
    
    if result['sids']:
        print(f"\n📝 Message SIDs:")
        for sid in result['sids']:
            print(f"   - {sid}")
    
    if result['sent'] > 0:
        print("\n✅ Test SMS sent successfully!")
        print("   Check your phone for the message.")
    else:
        print("\n❌ Failed to send test SMS.")
        print("   Check your Twilio credentials and phone number.")


def main():
    """Main test function."""
    print("\n🌾 BalirajaSahayak - Twilio SMS Integration Test\n")
    
    # Test configuration
    if not test_sms_configuration():
        print("\n⚠️  Please update your .env file with correct Twilio credentials.")
        print("\nRequired variables:")
        print("  - TWILIO_ACCOUNT_SID")
        print("  - TWILIO_AUTH_TOKEN")
        print("  - TWILIO_MESSAGING_SERVICE_SID")
        print("  - ALERT_PHONE_NUMBERS")
        return
    
    # Ask user confirmation before sending
    print("\n" + "=" * 60)
    response = input("\n📤 Do you want to send a test SMS? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        send_test_sms()
    else:
        print("\n✋ Test SMS cancelled.")
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
