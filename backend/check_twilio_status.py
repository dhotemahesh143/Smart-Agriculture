#!/usr/bin/env python3
"""
Check Twilio account status and message delivery
"""

import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("🔍 Twilio Account & Message Status Check")
print("=" * 60)

try:
    from twilio.rest import Client
    
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    phone_number = os.getenv("ALERT_PHONE_NUMBERS")
    
    client = Client(account_sid, auth_token)
    
    # Check account status
    print("\n📊 Account Information:")
    print("-" * 60)
    try:
        account = client.api.accounts(account_sid).fetch()
        print(f"Account SID: {account.sid}")
        print(f"Account Status: {account.status}")
        print(f"Account Type: {account.type}")
        print(f"Friendly Name: {account.friendly_name}")
    except Exception as e:
        print(f"❌ Could not fetch account info: {e}")
    
    # Check recent messages
    print("\n📱 Recent SMS Messages (Last 5):")
    print("-" * 60)
    try:
        messages = client.messages.list(limit=5)
        
        if not messages:
            print("No messages found")
        else:
            for msg in messages:
                print(f"\n📨 Message SID: {msg.sid}")
                print(f"   To: {msg.to}")
                print(f"   Status: {msg.status}")
                print(f"   Date: {msg.date_created}")
                print(f"   Error Code: {msg.error_code if msg.error_code else 'None'}")
                print(f"   Error Message: {msg.error_message if msg.error_message else 'None'}")
                
                # Explain status
                if msg.status == "delivered":
                    print(f"   ✅ Message was successfully delivered!")
                elif msg.status == "sent":
                    print(f"   ⏳ Message sent, waiting for delivery confirmation")
                elif msg.status == "accepted" or msg.status == "queued":
                    print(f"   ⏳ Message accepted by Twilio, being processed")
                elif msg.status == "failed":
                    print(f"   ❌ Message failed to send")
                elif msg.status == "undelivered":
                    print(f"   ❌ Message could not be delivered")
    except Exception as e:
        print(f"❌ Could not fetch messages: {e}")
    
    # Check if phone number is verified (for trial accounts)
    print("\n📞 Phone Number Verification:")
    print("-" * 60)
    try:
        # For trial accounts, check verified numbers
        verified_numbers = client.outgoing_caller_ids.list()
        
        if verified_numbers:
            print("Verified phone numbers:")
            for num in verified_numbers:
                print(f"   ✓ {num.phone_number}")
                if num.phone_number == phone_number:
                    print(f"     ✅ Your number {phone_number} is verified!")
        else:
            print("⚠️  No verified numbers found")
            print("\nFor Twilio TRIAL accounts:")
            print("1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/verified")
            print("2. Click 'Add a new Caller ID'")
            print(f"3. Verify {phone_number}")
            print("4. Enter the verification code sent to your phone")
    except Exception as e:
        print(f"Note: {e}")
    
    # Check account balance
    print("\n💰 Account Balance:")
    print("-" * 60)
    try:
        balance = client.api.accounts(account_sid).balance.fetch()
        print(f"Balance: {balance.balance} {balance.currency}")
        
        if float(balance.balance) <= 0:
            print("⚠️  WARNING: Account balance is zero or negative!")
            print("   Add credits at: https://console.twilio.com/us1/billing/manage-billing/billing-overview")
    except Exception as e:
        print(f"Could not fetch balance: {e}")
    
    # Important notes
    print("\n" + "=" * 60)
    print("📋 Important Notes:")
    print("=" * 60)
    print("\n1. TRIAL ACCOUNT RESTRICTIONS:")
    print("   - Can only send SMS to VERIFIED phone numbers")
    print("   - All SMS include 'Sent from your Twilio trial account' prefix")
    print("   - Limited to verified numbers only")
    
    print("\n2. TO VERIFY YOUR PHONE NUMBER:")
    print("   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified")
    print("   - Click 'Add a new Caller ID'")
    print(f"   - Enter: {phone_number}")
    print("   - Enter verification code sent to your phone")
    
    print("\n3. TO UPGRADE TO PAID ACCOUNT:")
    print("   - Go to: https://console.twilio.com/us1/billing/manage-billing/billing-overview")
    print("   - Add payment method")
    print("   - Add credits (minimum $20)")
    print("   - Send SMS to any number without verification")
    
    print("\n4. CHECK MESSAGE LOGS:")
    print("   - Go to: https://console.twilio.com/us1/monitor/logs/sms")
    print("   - View detailed delivery status")
    print("   - Check for error messages")
    
    print("\n" + "=" * 60)
    
except ImportError:
    print("❌ Twilio package not installed")
    print("Install with: pip install twilio")
except Exception as e:
    print(f"❌ Error: {e}")
