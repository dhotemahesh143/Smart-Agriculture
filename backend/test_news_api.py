#!/usr/bin/env python3
"""
Test script for NewsAPI integration.
Run this to verify your NewsAPI key is working correctly.

Usage:
    python test_news_api.py
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_newsapi_key():
    """Test if NewsAPI key is valid and working."""
    print("=" * 60)
    print("🔍 Testing NewsAPI Integration")
    print("=" * 60)
    
    api_key = os.getenv("NEWS_API_KEY", "")
    
    if not api_key:
        print("\n❌ NEWS_API_KEY not found in .env file")
        print("\nPlease add your NewsAPI key to backend/.env:")
        print("NEWS_API_KEY=your_api_key_here")
        return False
    
    print(f"\n✓ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    # Test 1: Check API key validity
    print("\n" + "=" * 60)
    print("📡 Test 1: Checking API Key Validity")
    print("=" * 60)
    
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "country": "in",
            "category": "business",
            "pageSize": 1,
            "apiKey": api_key
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ API Key is VALID!")
            data = response.json()
            print(f"✅ Total Results Available: {data.get('totalResults', 0)}")
            return True
        
        elif response.status_code == 401:
            print("❌ API Key is INVALID or UNAUTHORIZED")
            print("\nPossible reasons:")
            print("1. API key is incorrect")
            print("2. API key hasn't been activated yet (check email)")
            print("3. API key has expired")
            print("\nSolution:")
            print("1. Go to https://newsapi.org/")
            print("2. Log in to your account")
            print("3. Check your API key in the dashboard")
            print("4. If needed, generate a new API key")
            return False
        
        elif response.status_code == 429:
            print("⚠️  Rate limit exceeded")
            print("You've used all your free requests for today")
            print("Free tier: 100 requests/day")
            return False
        
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False


def test_agriculture_news():
    """Test fetching agriculture-specific news."""
    print("\n" + "=" * 60)
    print("📰 Test 2: Fetching Agriculture News")
    print("=" * 60)
    
    api_key = os.getenv("NEWS_API_KEY", "")
    
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": "agriculture OR farming",
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 5,
            "apiKey": api_key
        }
        
        print("\nFetching latest agriculture news...")
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            articles = data.get("articles", [])
            
            print(f"\n✅ Found {len(articles)} agriculture articles!")
            
            if articles:
                print("\n📰 Sample Articles:")
                print("-" * 60)
                for i, article in enumerate(articles[:3], 1):
                    print(f"\n{i}. {article.get('title', 'No title')}")
                    print(f"   Source: {article.get('source', {}).get('name', 'Unknown')}")
                    print(f"   Published: {article.get('publishedAt', 'Unknown')}")
                    print(f"   Has Image: {'Yes' if article.get('urlToImage') else 'No'}")
            
            return True
        
        else:
            print(f"❌ Failed to fetch news: Status {response.status_code}")
            return False
    
    except Exception as e:
        print(f"❌ Error fetching news: {e}")
        return False


def test_local_api():
    """Test the local news API endpoint."""
    print("\n" + "=" * 60)
    print("🏠 Test 3: Testing Local API Endpoint")
    print("=" * 60)
    
    try:
        print("\nTesting http://localhost:8000/news...")
        response = requests.get("http://localhost:8000/news?limit=3", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            news = data.get("news", [])
            
            print(f"\n✅ Local API working!")
            print(f"✅ Returned {len(news)} articles")
            
            if news:
                print("\n📰 Sample Article:")
                print("-" * 60)
                article = news[0]
                print(f"Title: {article.get('title', 'No title')}")
                print(f"Category: {article.get('category', 'Unknown')}")
                print(f"Source: {article.get('source', 'Unknown')}")
                print(f"Has Image: {'Yes' if article.get('image') else 'No'}")
            
            return True
        
        else:
            print(f"❌ Local API returned status {response.status_code}")
            return False
    
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to local API")
        print("\nMake sure backend is running:")
        print("cd backend")
        print("python -m uvicorn main:app --reload --port 8000")
        return False
    
    except Exception as e:
        print(f"❌ Error testing local API: {e}")
        return False


def main():
    """Main test function."""
    print("\n🌾 BalirajaSahayak - NewsAPI Integration Test\n")
    
    # Test 1: API Key Validity
    key_valid = test_newsapi_key()
    
    if not key_valid:
        print("\n" + "=" * 60)
        print("⚠️  NewsAPI key is not working")
        print("=" * 60)
        print("\nThe system will use curated sample news instead.")
        print("Sample news includes 12 high-quality agriculture articles.")
        print("\nTo fix NewsAPI:")
        print("1. Check your email for activation link")
        print("2. Verify API key at https://newsapi.org/account")
        print("3. Update backend/.env with correct key")
        print("4. Restart backend server")
    else:
        # Test 2: Fetch Agriculture News
        test_agriculture_news()
    
    # Test 3: Local API
    test_local_api()
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60)
    
    if key_valid:
        print("\n🎉 NewsAPI is working! Your app will fetch real-time news.")
    else:
        print("\n📰 Using sample news. Your app is still fully functional!")
    
    print("\nAccess your app: http://localhost:5173")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
