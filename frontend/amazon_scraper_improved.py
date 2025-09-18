#!/usr/bin/env python3
"""
Improved Amazon Product Scraper with Affiliate ID
Enhanced with better error handling, proxy support, and anti-detection measures
"""

import requests
import json
import time
import random
import re
from urllib.parse import urljoin, urlparse, parse_qs
from bs4 import BeautifulSoup
import os
from datetime import datetime
import logging
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import cloudscraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('amazon_scraper_improved.log'),
        logging.StreamHandler()
    ]
)

class ImprovedAmazonScraper:
    def __init__(self, affiliate_id, base_url="https://www.amazon.in", use_proxy=False):
        """
        Initialize improved Amazon scraper with affiliate ID
        
        Args:
            affiliate_id (str): Amazon affiliate ID
            base_url (str): Amazon base URL
            use_proxy (bool): Whether to use proxy rotation
        """
        self.affiliate_id = affiliate_id
        self.base_url = base_url
        self.products_file = "products_improved.json"
        self.use_proxy = use_proxy
        
        # Initialize cloudscraper to bypass anti-bot measures
        self.session = cloudscraper.create_scraper(
            browser={
                'browser': 'chrome',
                'platform': 'windows',
                'desktop': True
            }
        )
        
        # Set up retry strategy
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"],
            backoff_factor=1
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        # Enhanced headers to mimic real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        })
        
        # Load existing products
        self.products = self.load_products()
        
        # Request counter for rate limiting
        self.request_count = 0
        self.last_request_time = time.time()
        
    def load_products(self):
        """Load existing products from JSON file"""
        if os.path.exists(self.products_file):
            try:
                with open(self.products_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                logging.warning(f"Could not load {self.products_file}, starting fresh")
                return {}
        return {}
    
    def save_products(self):
        """Save products to JSON file"""
        try:
            with open(self.products_file, 'w', encoding='utf-8') as f:
                json.dump(self.products, f, indent=2, ensure_ascii=False)
            logging.info(f"Saved products to {self.products_file}")
        except Exception as e:
            logging.error(f"Error saving products: {e}")
    
    def rate_limit(self):
        """Implement rate limiting to avoid detection"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        # Ensure minimum delay between requests
        min_delay = random.uniform(3, 8)
        if time_since_last < min_delay:
            sleep_time = min_delay - time_since_last
            logging.info(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
            time.sleep(sleep_time)
        
        # Add longer delays every 10 requests
        if self.request_count % 10 == 0 and self.request_count > 0:
            long_delay = random.uniform(15, 30)
            logging.info(f"Taking a longer break: {long_delay:.2f} seconds")
            time.sleep(long_delay)
        
        self.last_request_time = time.time()
        self.request_count += 1
    
    def make_request(self, url, max_retries=3):
        """Make HTTP request with retry logic and rate limiting"""
        for attempt in range(max_retries):
            try:
                self.rate_limit()
                
                logging.info(f"Making request to: {url} (attempt {attempt + 1})")
                
                response = self.session.get(url, timeout=15)
                
                # Check if we got blocked
                if response.status_code == 503 or "captcha" in response.text.lower():
                    logging.warning(f"Detected blocking on attempt {attempt + 1}")
                    if attempt < max_retries - 1:
                        delay = random.uniform(30, 60)
                        logging.info(f"Waiting {delay:.2f} seconds before retry")
                        time.sleep(delay)
                        continue
                
                response.raise_for_status()
                return response
                
            except requests.exceptions.RequestException as e:
                logging.error(f"Request failed (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    delay = random.uniform(10, 30)
                    logging.info(f"Waiting {delay:.2f} seconds before retry")
                    time.sleep(delay)
                else:
                    raise
        
        return None
    
    def add_affiliate_id(self, url):
        """Add affiliate ID to Amazon URL"""
        if not url or not self.affiliate_id:
            return url
            
        parsed = urlparse(url)
        query_params = parse_qs(parsed.query)
        
        # Add affiliate ID
        query_params['tag'] = [self.affiliate_id]
        
        # Rebuild URL
        new_query = '&'.join([f"{k}={v[0]}" for k, v in query_params.items()])
        new_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}?{new_query}"
        
        return new_url
    
    def extract_price(self, price_element):
        """Extract price from price element"""
        if not price_element:
            return "₹0"
        
        price_text = price_element.get_text(strip=True)
        
        # Remove currency symbols and extract numbers
        price_match = re.search(r'[₹$]?([\d,]+\.?\d*)', price_text)
        if price_match:
            price = price_match.group(1).replace(',', '')
            return f"₹{price}"
        
        return "₹0"
    
    def extract_rating(self, rating_element):
        """Extract rating from rating element"""
        if not rating_element:
            return "0"
        
        rating_text = rating_element.get_text(strip=True)
        rating_match = re.search(r'(\d+\.?\d*)', rating_text)
        if rating_match:
            return rating_match.group(1)
        
        return "0"
    
    def scrape_search_results(self, search_query, max_pages=2, max_products=10):
        """Scrape products from search results with improved error handling"""
        products = []
        
        for page in range(1, max_pages + 1):
            try:
                # Construct search URL
                search_url = f"{self.base_url}/s?k={search_query.replace(' ', '+')}&page={page}"
                
                response = self.make_request(search_url)
                if not response:
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find product containers with multiple selectors
                product_containers = soup.find_all('div', {'data-component-type': 's-search-result'})
                
                if not product_containers:
                    # Try alternative selectors
                    product_containers = soup.find_all('div', {'class': 's-result-item'})
                
                if not product_containers:
                    logging.warning(f"No products found on page {page}")
                    break
                
                for container in product_containers:
                    if len(products) >= max_products:
                        break
                        
                    try:
                        # Extract product link with multiple selectors
                        link_elem = container.find('a', {'class': 'a-link-normal s-no-outline'})
                        if not link_elem:
                            link_elem = container.find('a', {'class': 'a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal'})
                        if not link_elem:
                            link_elem = container.find('a', {'class': 'a-link-normal'})
                        
                        if not link_elem or not link_elem.get('href'):
                            continue
                        
                        product_url = urljoin(self.base_url, link_elem['href'])
                        
                        # Skip sponsored products
                        if 'sponsored' in container.get('class', []):
                            continue
                        
                        # Extract basic info
                        product = {}
                        
                        # Title
                        title_elem = container.find('span', {'class': 'a-size-medium a-color-base a-text-normal'})
                        if not title_elem:
                            title_elem = container.find('span', {'class': 'a-size-base-plus a-color-base a-text-normal'})
                        if title_elem:
                            product['title'] = title_elem.get_text(strip=True)
                        
                        # Price
                        price_elem = container.find('span', {'class': 'a-price-whole'})
                        if price_elem:
                            product['price'] = self.extract_price(price_elem)
                        
                        # Image
                        img_elem = container.find('img', {'class': 's-image'})
                        if img_elem and img_elem.get('src'):
                            product['image'] = img_elem['src']
                        
                        # Rating
                        rating_elem = container.find('span', {'class': 'a-icon-alt'})
                        if rating_elem:
                            product['rating'] = self.extract_rating(rating_elem)
                        
                        # Add affiliate URL
                        product['url'] = self.add_affiliate_id(product_url)
                        
                        # Add timestamp
                        product['scraped_at'] = datetime.now().isoformat()
                        
                        # Add category based on search query
                        product['category'] = search_query.title()
                        
                        if product.get('title') and product.get('price') != "₹0":
                            products.append(product)
                            logging.info(f"Added product: {product['title'][:50]}...")
                        
                    except Exception as e:
                        logging.error(f"Error processing product container: {e}")
                        continue
                
                # Check if we have enough products
                if len(products) >= max_products:
                    break
                    
            except Exception as e:
                logging.error(f"Error scraping search page {page}: {e}")
                continue
        
        return products
    
    def run_scraper(self, search_queries=None, max_products_per_query=5):
        """Run the improved scraper"""
        if search_queries is None:
            search_queries = [
                "smartphone",
                "laptop",
                "headphones",
                "smart watch",
                "camera"
            ]
        
        all_products = {}
        
        # Scrape search queries
        for query in search_queries:
            logging.info(f"Scraping products for: {query}")
            try:
                products = self.scrape_search_results(query, max_pages=2, max_products=max_products_per_query)
                
                if products:
                    all_products[query.title()] = products
                    logging.info(f"Found {len(products)} products for '{query}'")
                else:
                    logging.warning(f"No products found for '{query}'")
                
                # Longer delay between different queries
                time.sleep(random.uniform(10, 20))
                
            except Exception as e:
                logging.error(f"Error scraping query '{query}': {e}")
                continue
        
        # Update products
        self.products = all_products
        
        # Save to file
        self.save_products()
        
        total_products = sum(len(products) for products in all_products.values())
        logging.info(f"Scraping completed! Total products: {total_products}")
        return all_products

def main():
    """Main function to run the improved scraper"""
    print("🚀 Improved Amazon Product Scraper with Affiliate ID")
    print("=" * 55)
    
    # Get affiliate ID from user
    affiliate_id = input("Enter your Amazon affiliate ID (tag): ").strip()
    
    if not affiliate_id:
        print("❌ Affiliate ID is required!")
        return
    
    # Initialize scraper
    scraper = ImprovedAmazonScraper(affiliate_id)
    
    print(f"\n✅ Scraper initialized with affiliate ID: {affiliate_id}")
    print("📁 Products will be saved to: products_improved.json")
    
    # Ask for custom search queries
    custom_queries = input("\nEnter custom search queries (comma-separated) or press Enter for defaults: ").strip()
    
    if custom_queries:
        search_queries = [q.strip() for q in custom_queries.split(',')]
    else:
        search_queries = None
    
    # Ask for max products per query
    try:
        max_products = int(input("Enter max products per query (default 5): ") or "5")
    except ValueError:
        max_products = 5
    
    print(f"\n🎯 Starting improved scraper with:")
    print(f"   - Affiliate ID: {affiliate_id}")
    print(f"   - Search queries: {search_queries or 'Default queries'}")
    print(f"   - Max products per query: {max_products}")
    print(f"   - Output file: products_improved.json")
    print(f"   - Enhanced anti-detection measures enabled")
    
    # Confirm before starting
    confirm = input("\nStart scraping? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Scraping cancelled!")
        return
    
    try:
        # Run scraper
        products = scraper.run_scraper(
            search_queries=search_queries,
            max_products_per_query=max_products
        )
        
        print(f"\n🎉 Scraping completed successfully!")
        
        total_products = sum(len(products_list) for products_list in products.values())
        print(f"📊 Total products scraped: {total_products}")
        print(f"💾 Products saved to: products_improved.json")
        print(f"🔗 All products now include your affiliate ID: {affiliate_id}")
        
        # Show summary by category
        if products:
            print(f"\n📋 Products by category:")
            for category, products_list in products.items():
                print(f"   {category}: {len(products_list)} products")
        
    except KeyboardInterrupt:
        print("\n⚠️ Scraping interrupted by user!")
    except Exception as e:
        print(f"\n❌ Error during scraping: {e}")
        logging.error(f"Scraping error: {e}")

if __name__ == "__main__":
    main() 