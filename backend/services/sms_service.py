import os
import logging

logger = logging.getLogger(__name__)

# ── Twilio SMS Service ────────────────────────────────────────────────────────
# Sends SMS alerts for severe weather events.
# Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env
# ALERT_PHONE_NUMBERS is a comma-separated list of numbers to notify.

def _get_twilio_client():
    """Lazily initialize Twilio client. Returns None if credentials missing."""
    account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")

    if not account_sid or not auth_token:
        return None

    try:
        from twilio.rest import Client
        return Client(account_sid, auth_token)
    except ImportError:
        logger.warning("twilio package not installed. Run: pip install twilio")
        return None
    except Exception as e:
        logger.warning(f"Twilio client init failed: {e}")
        return None


def send_weather_alert_sms(message: str, location: str = "") -> dict:
    """
    Send an SMS weather alert to all configured phone numbers.

    Args:
        message: The SMS body text
        location: Optional location name to include in logs

    Returns:
        {"sent": int, "failed": int, "sids": list[str]}
    """
    messaging_service_sid = os.getenv("TWILIO_MESSAGING_SERVICE_SID", "")
    from_number = os.getenv("TWILIO_FROM_NUMBER", "")
    numbers_raw = os.getenv("ALERT_PHONE_NUMBERS", "")

    if not numbers_raw:
        logger.info("No ALERT_PHONE_NUMBERS configured — SMS not sent.")
        return {"sent": 0, "failed": 0, "sids": []}

    phone_numbers = [n.strip() for n in numbers_raw.split(",") if n.strip()]
    client = _get_twilio_client()

    if not client:
        logger.warning("Twilio not configured — SMS not sent.")
        return {"sent": 0, "failed": 0, "sids": []}

    sent = 0
    failed = 0
    sids = []

    for number in phone_numbers:
        try:
            # Use MessagingServiceSid if available, otherwise use from_number
            if messaging_service_sid:
                msg = client.messages.create(
                    body=message,
                    messaging_service_sid=messaging_service_sid,
                    to=number
                )
            else:
                msg = client.messages.create(
                    body=message,
                    from_=from_number,
                    to=number
                )
            sids.append(msg.sid)
            sent += 1
            logger.info(f"SMS sent to {number} (SID: {msg.sid}) for location: {location}")
        except Exception as e:
            failed += 1
            logger.error(f"Failed to send SMS to {number}: {e}")

    return {"sent": sent, "failed": failed, "sids": sids}


def is_sms_configured() -> bool:
    """Check if Twilio SMS is properly configured."""
    has_messaging_service = bool(os.getenv("TWILIO_MESSAGING_SERVICE_SID"))
    has_from_number = bool(os.getenv("TWILIO_FROM_NUMBER"))
    
    return bool(
        os.getenv("TWILIO_ACCOUNT_SID") and
        os.getenv("TWILIO_AUTH_TOKEN") and
        (has_messaging_service or has_from_number) and
        os.getenv("ALERT_PHONE_NUMBERS")
    )
