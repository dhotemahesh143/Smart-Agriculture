import os
import requests
import logging
from datetime import datetime, timedelta
from typing import List, Dict

logger = logging.getLogger(__name__)

# ── News API Service ──────────────────────────────────────────────────────────
# Fetches farming and agriculture related news from NewsAPI
# Get free API key at https://newsapi.org/

def _get_newsapi_key():
    """Get NewsAPI key from environment."""
    return os.getenv("NEWS_API_KEY", "")


def fetch_agriculture_news(country: str = "in", page_size: int = 12) -> List[Dict]:
    """
    Fetch latest agriculture and farming news.
    
    Args:
        country: Country code (in=India, us=USA, etc.)
        page_size: Number of articles to fetch (max 100)
    
    Returns:
        List of news articles with title, description, url, image, source, date
    """
    api_key = _get_newsapi_key()
    
    # If no API key, return curated sample news
    if not api_key:
        logger.info("NEWS_API_KEY not configured, returning sample news")
        return _get_sample_news()
    
    try:
        # NewsAPI endpoint
        url = "https://newsapi.org/v2/everything"
        
        # Agriculture-related keywords
        keywords = "agriculture OR farming OR crops OR farmers OR agricultural OR agritech OR farm technology"
        
        # Date range (last 7 days)
        from_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        
        params = {
            "q": keywords,
            "from": from_date,
            "sortBy": "publishedAt",
            "language": "en",
            "pageSize": page_size,
            "apiKey": api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
            
            # Format articles
            formatted_news = []
            for article in articles:
                # Skip articles without images
                if not article.get("urlToImage"):
                    continue
                
                formatted_news.append({
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "url": article.get("url", ""),
                    "image": article.get("urlToImage", ""),
                    "source": article.get("source", {}).get("name", "Unknown"),
                    "author": article.get("author", ""),
                    "published_at": article.get("publishedAt", ""),
                    "category": _categorize_article(article.get("title", "") + " " + article.get("description", ""))
                })
            
            logger.info(f"Fetched {len(formatted_news)} agriculture news articles")
            return formatted_news
        
        else:
            logger.warning(f"NewsAPI returned status {response.status_code}")
            return _get_sample_news()
    
    except Exception as e:
        logger.error(f"Failed to fetch news: {e}")
        return _get_sample_news()


def _categorize_article(text: str) -> str:
    """Categorize article based on keywords in title/description."""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ["government", "policy", "subsidy", "scheme", "minister"]):
        return "Government Schemes"
    elif any(word in text_lower for word in ["technology", "ai", "iot", "drone", "sensor", "digital"]):
        return "AgriTech"
    elif any(word in text_lower for word in ["organic", "sustainable", "eco", "green", "natural"]):
        return "Sustainable Farming"
    elif any(word in text_lower for word in ["market", "price", "export", "trade", "commodity"]):
        return "Market Intelligence"
    elif any(word in text_lower for word in ["weather", "climate", "rain", "drought", "flood"]):
        return "Weather & Climate"
    elif any(word in text_lower for word in ["disease", "pest", "insect", "fungus", "blight"]):
        return "Crop Protection"
    elif any(word in text_lower for word in ["fertilizer", "soil", "nutrient", "compost"]):
        return "Soil & Fertilizers"
    else:
        return "General Agriculture"


def _get_sample_news() -> List[Dict]:
    """Return curated sample agriculture news (fallback when API not available)."""
    return [
        {
            "title": "PM-Kisan Digital Subsidy for Smart Irrigation Systems Announced",
            "description": "The central government has announced an additional 15% subsidy for farmers implementing IoT-based soil moisture sensors and automated drip irrigation controls. The scheme aims to promote water conservation and precision farming across India.",
            "url": "https://pib.gov.in/",
            "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
            "source": "PIB India",
            "author": "Ministry of Agriculture",
            "published_at": datetime.now().isoformat(),
            "category": "Government Schemes"
        },
        {
            "title": "AI-Powered Crop Disease Detection App Helps 50,000 Farmers",
            "description": "A new mobile application using artificial intelligence has successfully helped over 50,000 farmers detect crop diseases early. The app analyzes leaf images and provides instant treatment recommendations in multiple regional languages.",
            "url": "https://example.com/agritech-news",
            "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
            "source": "AgriTech Today",
            "author": "Tech Reporter",
            "published_at": (datetime.now() - timedelta(hours=5)).isoformat(),
            "category": "AgriTech"
        },
        {
            "title": "Organic Farming Yields 30% Higher Profits in Maharashtra Study",
            "description": "A comprehensive 3-year study in Maharashtra reveals that organic farming methods result in 30% higher net profits compared to conventional farming, despite slightly lower yields. The study covered 500 farms across 10 districts.",
            "url": "https://example.com/organic-farming",
            "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
            "source": "Agricultural Research Journal",
            "author": "Dr. Priya Sharma",
            "published_at": (datetime.now() - timedelta(hours=12)).isoformat(),
            "category": "Sustainable Farming"
        },
        {
            "title": "Wheat Prices Surge 15% Due to Global Supply Chain Disruptions",
            "description": "International wheat prices have increased by 15% in the past month due to supply chain disruptions and adverse weather conditions in major producing countries. Indian farmers are advised to hold stock for better prices.",
            "url": "https://example.com/market-news",
            "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
            "source": "Commodity Market Watch",
            "author": "Market Analyst",
            "published_at": (datetime.now() - timedelta(hours=18)).isoformat(),
            "category": "Market Intelligence"
        },
        {
            "title": "IMD Predicts Above-Normal Monsoon for Central India",
            "description": "The India Meteorological Department has forecast above-normal rainfall for central India during the upcoming monsoon season. Farmers are advised to prepare for increased water availability and adjust crop planning accordingly.",
            "url": "https://example.com/weather-forecast",
            "image": "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80",
            "source": "IMD Weather",
            "author": "Meteorology Dept",
            "published_at": (datetime.now() - timedelta(days=1)).isoformat(),
            "category": "Weather & Climate"
        },
        {
            "title": "New Biological Pesticide Reduces Chemical Use by 60%",
            "description": "Scientists have developed a new biological pesticide derived from neem and garlic extracts that effectively controls major pests while reducing chemical pesticide use by 60%. Field trials show promising results across multiple crops.",
            "url": "https://example.com/biopesticide",
            "image": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80",
            "source": "Agricultural Science Today",
            "author": "Research Team",
            "published_at": (datetime.now() - timedelta(days=1, hours=6)).isoformat(),
            "category": "Crop Protection"
        },
        {
            "title": "Soil Health Card Scheme Reaches 10 Crore Farmers",
            "description": "The Soil Health Card scheme has successfully reached 10 crore farmers across India, helping them optimize fertilizer use and improve soil quality. The initiative has resulted in average fertilizer cost savings of 15-20%.",
            "url": "https://example.com/soil-health",
            "image": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80",
            "source": "Ministry of Agriculture",
            "author": "Government Report",
            "published_at": (datetime.now() - timedelta(days=2)).isoformat(),
            "category": "Soil & Fertilizers"
        },
        {
            "title": "Drone Technology Revolutionizes Pesticide Application",
            "description": "Agricultural drones are transforming pesticide application with precision spraying that reduces chemical use by 40% while improving coverage. Over 5,000 drones are now operational across Indian farms.",
            "url": "https://example.com/drone-farming",
            "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
            "source": "AgriTech Innovation",
            "author": "Technology Reporter",
            "published_at": (datetime.now() - timedelta(days=2, hours=12)).isoformat(),
            "category": "AgriTech"
        },
        {
            "title": "Vertical Farming Gains Momentum in Urban Areas",
            "description": "Vertical farming techniques are gaining popularity in urban and peri-urban areas, allowing farmers to grow multiple crops in limited space. Success stories from Pune and Bangalore show 3x productivity per square meter.",
            "url": "https://example.com/vertical-farming",
            "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80",
            "source": "Urban Agriculture Magazine",
            "author": "Farming Expert",
            "published_at": (datetime.now() - timedelta(days=3)).isoformat(),
            "category": "Sustainable Farming"
        },
        {
            "title": "Cotton Export Demand Increases by 25% in Global Markets",
            "description": "Indian cotton exports have seen a 25% increase in demand from international markets, particularly from textile manufacturers in Bangladesh and Vietnam. Farmers are advised to capitalize on favorable market conditions.",
            "url": "https://example.com/cotton-export",
            "image": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80",
            "source": "Export Trade Journal",
            "author": "Trade Analyst",
            "published_at": (datetime.now() - timedelta(days=3, hours=8)).isoformat(),
            "category": "Market Intelligence"
        },
        {
            "title": "Integrated Pest Management Reduces Crop Loss by 40%",
            "description": "Farmers adopting Integrated Pest Management (IPM) techniques report 40% reduction in crop losses and 50% reduction in pesticide costs. The approach combines biological, cultural, and chemical methods strategically.",
            "url": "https://example.com/ipm-success",
            "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
            "source": "Crop Protection Weekly",
            "author": "IPM Specialist",
            "published_at": (datetime.now() - timedelta(days=4)).isoformat(),
            "category": "Crop Protection"
        },
        {
            "title": "Micro-Irrigation Subsidy Extended to Small Farmers",
            "description": "The government has extended micro-irrigation subsidies to small and marginal farmers, covering up to 55% of installation costs. The scheme aims to promote water-efficient farming practices across 2 million hectares.",
            "url": "https://example.com/irrigation-subsidy",
            "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
            "source": "Government Gazette",
            "author": "Policy Desk",
            "published_at": (datetime.now() - timedelta(days=4, hours=15)).isoformat(),
            "category": "Government Schemes"
        }
    ]


def get_news_by_category(category: str = None) -> List[Dict]:
    """
    Get news filtered by category.
    
    Args:
        category: Category name (Government Schemes, AgriTech, etc.)
    
    Returns:
        Filtered list of news articles
    """
    all_news = fetch_agriculture_news()
    
    if not category:
        return all_news
    
    return [news for news in all_news if news.get("category") == category]


def get_trending_news(limit: int = 6) -> List[Dict]:
    """Get top trending agriculture news."""
    all_news = fetch_agriculture_news()
    return all_news[:limit]
