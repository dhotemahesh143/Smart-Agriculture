"""
Email notification service for BalirajaSahayak Smart Agriculture Platform.
Sends weather alerts, farming reports, and notifications via Gmail SMTP.
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Optional


def send_email(
    to_email: str,
    subject: str,
    message: str,
    html_content: Optional[str] = None
) -> Dict[str, any]:
    """
    Send email using Gmail SMTP.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        message: Plain text message
        html_content: Optional HTML formatted message
    
    Returns:
        Dict with success status and details
    """
    try:
        # Get credentials from environment
        email = os.getenv("GMAIL_EMAIL")
        password = os.getenv("GMAIL_APP_PASSWORD")
        
        if not email or not password:
            return {
                "success": False,
                "error": "Email credentials not configured. Set GMAIL_EMAIL and GMAIL_APP_PASSWORD in .env"
            }
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"BalirajaSahayak <{email}>"
        msg["To"] = to_email
        
        # Attach plain text version
        text_part = MIMEText(message, "plain")
        msg.attach(text_part)
        
        # Attach HTML version if provided
        if html_content:
            html_part = MIMEText(html_content, "html")
            msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email, password)
            server.send_message(msg)
        
        return {
            "success": True,
            "sent_to": to_email,
            "subject": subject
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def send_weather_alert_email(
    weather_data: Dict,
    location: str,
    severity_info: Dict,
    recipient_emails: Optional[List[str]] = None
) -> Dict[str, any]:
    """
    Send weather alert email to registered users.
    
    Args:
        weather_data: Weather information dict
        location: Location name
        severity_info: Severity check results
        recipient_emails: List of email addresses (uses env var if not provided)
    
    Returns:
        Dict with results
    """
    # Get recipient emails
    if not recipient_emails:
        emails_str = os.getenv("ALERT_EMAILS", "")
        recipient_emails = [e.strip() for e in emails_str.split(",") if e.strip()]
    
    if not recipient_emails:
        return {
            "success": False,
            "error": "No recipient emails configured"
        }
    
    # Create subject
    if severity_info.get("is_severe"):
        subject = f"⚠️ Weather Alert: {severity_info['anomaly']} - {location}"
    else:
        subject = f"🌾 Weather Update - {location}"
    
    # Create plain text message
    message = f"""🌾 BalirajaSahayak Weather Alert

📍 Location: {location}
🌡️ Temperature: {weather_data['temperature']}°C
🌧️ Rainfall: {weather_data['rainfall']}mm/hr
💧 Humidity: {weather_data['humidity']}%
💨 Wind Speed: {weather_data['wind_speed']}km/h
☁️ Condition: {weather_data['condition']}

"""
    
    # Add severity warning
    if severity_info.get("is_severe"):
        message += f"""⚠️ ALERT: {severity_info['anomaly']}
Severity: {severity_info['severity']}

Recommended Actions:
"""
        if "Heavy Rainfall" in severity_info['anomaly']:
            message += "• Ensure proper drainage in fields\n• Protect crops from waterlogging\n• Postpone irrigation\n"
        elif "Extreme Heat" in severity_info['anomaly']:
            message += "• Increase irrigation frequency\n• Provide shade for sensitive crops\n• Monitor for heat stress\n"
        elif "Strong Winds" in severity_info['anomaly']:
            message += "• Secure loose equipment\n• Protect young plants\n• Check for crop damage\n"
        elif "Thunderstorm" in severity_info['anomaly']:
            message += "• Avoid field work\n• Secure equipment\n• Stay indoors\n"
        
        message += "\n"
    else:
        message += "✅ Weather conditions are normal.\n\n"
    
    message += """Stay safe and farm smart! 🌾

---
BalirajaSahayak - Smart Agriculture Platform
Unsubscribe: Reply with 'STOP'
"""
    
    # Create HTML version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }}
        .content {{ background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; }}
        .weather-card {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .weather-item {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }}
        .weather-item:last-child {{ border-bottom: none; }}
        .alert-box {{ background: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 15px 0; border-radius: 4px; }}
        .alert-box.severe {{ background: #f8d7da; border-left-color: #dc3545; }}
        .normal-box {{ background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px; }}
        .actions {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }}
        .actions ul {{ margin: 10px 0; padding-left: 20px; }}
        .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌾 BalirajaSahayak Weather Alert</h1>
            <p style="margin: 0;">Smart Agriculture Platform</p>
        </div>
        <div class="content">
            <div class="weather-card">
                <h2 style="margin-top: 0; color: #2e7d32;">📍 {location}</h2>
                <div class="weather-item">
                    <span><strong>🌡️ Temperature:</strong></span>
                    <span>{weather_data['temperature']}°C</span>
                </div>
                <div class="weather-item">
                    <span><strong>🌧️ Rainfall:</strong></span>
                    <span>{weather_data['rainfall']}mm/hr</span>
                </div>
                <div class="weather-item">
                    <span><strong>💧 Humidity:</strong></span>
                    <span>{weather_data['humidity']}%</span>
                </div>
                <div class="weather-item">
                    <span><strong>💨 Wind Speed:</strong></span>
                    <span>{weather_data['wind_speed']}km/h</span>
                </div>
                <div class="weather-item">
                    <span><strong>☁️ Condition:</strong></span>
                    <span>{weather_data['condition']}</span>
                </div>
            </div>
"""
    
    # Add severity alert or normal status
    if severity_info.get("is_severe"):
        html_content += f"""
            <div class="alert-box {'severe' if severity_info['severity'] in ['High', 'Extreme'] else ''}">
                <h3 style="margin-top: 0;">⚠️ ALERT: {severity_info['anomaly']}</h3>
                <p><strong>Severity:</strong> {severity_info['severity']}</p>
            </div>
            <div class="actions">
                <h3 style="margin-top: 0; color: #d32f2f;">Recommended Actions:</h3>
                <ul>
"""
        if "Heavy Rainfall" in severity_info['anomaly']:
            html_content += """
                    <li>Ensure proper drainage in fields</li>
                    <li>Protect crops from waterlogging</li>
                    <li>Postpone irrigation activities</li>
"""
        elif "Extreme Heat" in severity_info['anomaly']:
            html_content += """
                    <li>Increase irrigation frequency</li>
                    <li>Provide shade for sensitive crops</li>
                    <li>Monitor crops for heat stress</li>
"""
        elif "Strong Winds" in severity_info['anomaly']:
            html_content += """
                    <li>Secure loose equipment and materials</li>
                    <li>Protect young plants with support</li>
                    <li>Check for crop damage after winds subside</li>
"""
        elif "Thunderstorm" in severity_info['anomaly']:
            html_content += """
                    <li>Avoid field work during storm</li>
                    <li>Secure all equipment</li>
                    <li>Stay indoors for safety</li>
"""
        html_content += """
                </ul>
            </div>
"""
    else:
        html_content += """
            <div class="normal-box">
                <h3 style="margin-top: 0; color: #2e7d32;">✅ Weather Conditions Normal</h3>
                <p>No severe weather alerts at this time. Continue regular farming activities.</p>
            </div>
"""
    
    html_content += """
            <div class="footer">
                <p><strong>Stay safe and farm smart! 🌾</strong></p>
                <p>BalirajaSahayak - Smart Agriculture Platform</p>
                <p style="font-size: 11px; color: #999;">To unsubscribe, reply with 'STOP'</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
    
    # Send to all recipients
    results = []
    for email in recipient_emails:
        result = send_email(email, subject, message, html_content)
        results.append(result)
    
    successful = sum(1 for r in results if r.get("success"))
    
    return {
        "success": successful > 0,
        "sent": successful,
        "failed": len(results) - successful,
        "total": len(results),
        "results": results
    }


def send_welcome_email(
    email: str,
    location: str,
    weather_data: Dict,
    severity_info: Dict
) -> Dict[str, any]:
    """
    Send welcome email when user registers for alerts.
    
    Args:
        email: User's email address
        location: User's location
        weather_data: Current weather data
        severity_info: Weather severity information
    
    Returns:
        Dict with send status
    """
    subject = "🌾 Welcome to BalirajaSahayak Weather Alerts!"
    
    message = f"""Welcome to BalirajaSahayak Weather Alerts! 🌾

Thank you for registering. You will now receive real-time weather alerts for your location.

📍 Your Location: {location}

Current Weather:
🌡️ Temperature: {weather_data['temperature']}°C
🌧️ Rainfall: {weather_data['rainfall']}mm/hr
💧 Humidity: {weather_data['humidity']}%
💨 Wind Speed: {weather_data['wind_speed']}km/h
☁️ Condition: {weather_data['condition']}

"""
    
    if severity_info.get("is_severe"):
        message += f"""⚠️ Current Alert: {severity_info['anomaly']}
Severity: {severity_info['severity']}

"""
    else:
        message += "✅ Weather conditions are currently normal.\n\n"
    
    message += """You will receive automatic alerts for:
• Thunderstorms and severe weather
• Heavy rainfall (>10mm/hr)
• Extreme heat (>42°C)
• Strong winds (>50km/h)
• High humidity (>90%)

Stay safe and farm smart! 🌾

---
BalirajaSahayak - Smart Agriculture Platform
To unsubscribe, reply with 'STOP'
"""
    
    # HTML version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }}
        .content {{ background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; }}
        .welcome-box {{ background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .weather-card {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .weather-item {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }}
        .weather-item:last-child {{ border-bottom: none; }}
        .alert-types {{ background: white; padding: 15px; margin: 15px 0; border-radius: 8px; }}
        .alert-types ul {{ margin: 10px 0; padding-left: 20px; }}
        .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌾 Welcome to BalirajaSahayak!</h1>
            <p style="margin: 0; font-size: 18px;">Weather Alerts Registration Successful</p>
        </div>
        <div class="content">
            <div class="welcome-box">
                <h2 style="margin-top: 0; color: #2e7d32;">Thank You for Registering! 🎉</h2>
                <p>You will now receive real-time weather alerts for <strong>{location}</strong>.</p>
            </div>
            
            <div class="weather-card">
                <h3 style="margin-top: 0; color: #2e7d32;">📍 Current Weather - {location}</h3>
                <div class="weather-item">
                    <span><strong>🌡️ Temperature:</strong></span>
                    <span>{weather_data['temperature']}°C</span>
                </div>
                <div class="weather-item">
                    <span><strong>🌧️ Rainfall:</strong></span>
                    <span>{weather_data['rainfall']}mm/hr</span>
                </div>
                <div class="weather-item">
                    <span><strong>💧 Humidity:</strong></span>
                    <span>{weather_data['humidity']}%</span>
                </div>
                <div class="weather-item">
                    <span><strong>💨 Wind Speed:</strong></span>
                    <span>{weather_data['wind_speed']}km/h</span>
                </div>
                <div class="weather-item">
                    <span><strong>☁️ Condition:</strong></span>
                    <span>{weather_data['condition']}</span>
                </div>
            </div>
            
            {"<div style='background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 15px 0; border-radius: 4px;'><h3 style='margin-top: 0; color: #d32f2f;'>⚠️ Current Alert</h3><p><strong>" + severity_info['anomaly'] + "</strong></p><p>Severity: " + severity_info['severity'] + "</p></div>" if severity_info.get('is_severe') else "<div style='background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 4px;'><h3 style='margin-top: 0; color: #2e7d32;'>✅ Weather Normal</h3><p>No severe weather alerts at this time.</p></div>"}
            
            <div class="alert-types">
                <h3 style="margin-top: 0; color: #2e7d32;">📬 You Will Receive Alerts For:</h3>
                <ul>
                    <li>⛈️ Thunderstorms and severe weather</li>
                    <li>🌧️ Heavy rainfall (>10mm/hr)</li>
                    <li>🌡️ Extreme heat (>42°C)</li>
                    <li>💨 Strong winds (>50km/h)</li>
                    <li>💧 High humidity (>90%)</li>
                </ul>
            </div>
            
            <div class="footer">
                <p><strong>Stay safe and farm smart! 🌾</strong></p>
                <p>BalirajaSahayak - Smart Agriculture Platform</p>
                <p style="font-size: 11px; color: #999;">To unsubscribe, reply with 'STOP'</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
    
    return send_email(email, subject, message, html_content)


def send_crop_recommendation_email(
    email: str,
    location: str,
    recommended_crops: List[str],
    soil_data: Dict,
    weather_data: Dict
) -> Dict[str, any]:
    """
    Send crop recommendation report via email.
    
    Args:
        email: Recipient email
        location: Farm location
        recommended_crops: List of recommended crops
        soil_data: Soil NPK and pH data
        weather_data: Current weather data
    
    Returns:
        Dict with send status
    """
    subject = f"🌾 Crop Recommendations for {location}"
    
    crops_list = "\n".join([f"{i+1}. {crop}" for i, crop in enumerate(recommended_crops)])
    
    message = f"""BalirajaSahayak Crop Recommendation Report

📍 Location: {location}

🌾 Recommended Crops:
{crops_list}

🧪 Soil Analysis:
• Nitrogen (N): {soil_data.get('N', 'N/A')} kg/ha
• Phosphorus (P): {soil_data.get('P', 'N/A')} kg/ha
• Potassium (K): {soil_data.get('K', 'N/A')} kg/ha
• pH Level: {soil_data.get('pH', 'N/A')}

🌤️ Current Weather:
• Temperature: {weather_data.get('temperature', 'N/A')}°C
• Rainfall: {weather_data.get('rainfall', 'N/A')}mm/hr
• Humidity: {weather_data.get('humidity', 'N/A')}%

These recommendations are based on your soil conditions, local weather patterns, and regional agricultural data.

For detailed farming plans, visit: http://localhost:5173

Stay safe and farm smart! 🌾

---
BalirajaSahayak - Smart Agriculture Platform
"""
    
    return send_email(email, subject, message)
