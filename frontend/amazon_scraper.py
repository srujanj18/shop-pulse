#!/usr/bin/env python3
"""
Amazon Product Scraper with Affiliate ID
Scrapes products from Amazon and stores them in products.json with affiliate links
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

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('amazon_scraper.log'),
        logging.StreamHandler()
    ]
)

class AmazonScraper:
    def __init__(self, affiliate_id, base_url="https://www.amazon.in"):
        """
        Initialize Amazon scraper with affiliate ID
        
        Args:
            affiliate_id (str): bestdeal03ff2-21
            base_url (str): Amazon base URL (default: amazon.in)
        """
        self.affiliate_id = affiliate_id
        self.base_url = base_url
        self.products_file = "products.json"
        self.session = requests.Session()
        
        # Set headers to mimic a real browser
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        # Load existing products
        self.products = self.load_products()
        
    def load_products(self):
        """Load existing products from JSON file"""
        if os.path.exists(self.products_file):
            try:
                with open(self.products_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                logging.warning(f"Could not load {self.products_file}, starting fresh")
                return []
        return []
    
    def save_products(self):
        """Save products to JSON file"""
        try:
            with open(self.products_file, 'w', encoding='utf-8') as f:
                json.dump(self.products, f, indent=2, ensure_ascii=False)
            logging.info(f"Saved {len(self.products)} products to {self.products_file}")
        except Exception as e:
            logging.error(f"Error saving products: {e}")
    
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
    
    def scrape_product_page(self, url):
        """Scrape a single product page"""
        try:
            logging.info(f"Scraping product: {url}")
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract product information
            product = {}
            
            # Product title
            title_elem = soup.find('span', {'id': 'productTitle'})
            if title_elem:
                product['title'] = title_elem.get_text(strip=True)
            
            # Product price
            price_elem = soup.find('span', {'class': 'a-price-whole'})
            if not price_elem:
                price_elem = soup.find('span', {'class': 'a-price'})
            product['price'] = self.extract_price(price_elem)
            
            # Product image
            img_elem = soup.find('img', {'id': 'landingImage'})
            if img_elem and img_elem.get('src'):
                product['image'] = img_elem['src']
            elif img_elem and img_elem.get('data-old-hires'):
                product['image'] = img_elem['data-old-hires']
            
            # Product rating
            rating_elem = soup.find('span', {'class': 'a-icon-alt'})
            product['rating'] = self.extract_rating(rating_elem)
            
            # Product category (try to extract from breadcrumb)
            breadcrumb = soup.find('nav', {'aria-label': 'breadcrumb'})
            if breadcrumb:
                category_links = breadcrumb.find_all('a')
                if len(category_links) > 1:
                    product['category'] = category_links[1].get_text(strip=True)
            
            # Add affiliate URL
            product['url'] = self.add_affiliate_id(url)
            
            # Add timestamp
            product['scraped_at'] = datetime.now().isoformat()
            
            return product
            
        except Exception as e:
            logging.error(f"Error scraping product {url}: {e}")
            return None
    
    def scrape_search_results(self, search_query, max_pages=3):
        """Scrape products from search results"""
        products = []
        
        for page in range(1, max_pages + 1):
            try:
                # Construct search URL
                search_url = f"{self.base_url}/s?k={search_query.replace(' ', '+')}&page={page}"
                logging.info(f"Scraping search page {page}: {search_url}")
                
                response = self.session.get(search_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find product containers
                product_containers = soup.find_all('div', {'data-component-type': 's-search-result'})
                
                if not product_containers:
                    logging.warning(f"No products found on page {page}")
                    break
                
                for container in product_containers:
                    try:
                        # Extract product link
                        link_elem = container.find('a', {'class': 'a-link-normal s-no-outline'})
                        if not link_elem:
                            link_elem = container.find('a', {'class': 'a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal'})
                        
                        if not link_elem or not link_elem.get('href'):
                            continue
                        
                        product_url = urljoin(self.base_url, link_elem['href'])
                        
                        # Skip if not a product page
                        if '/dp/' not in product_url:
                            continue
                        
                        # Extract basic info from search result
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
                
                # Random delay to avoid being blocked
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                logging.error(f"Error scraping search page {page}: {e}")
                continue
        
        return products
    
    def scrape_deals_page(self, max_pages=2):
        """Scrape products from Amazon deals page"""
        products = []
        
        for page in range(1, max_pages + 1):
            try:
                deals_url = f"{self.base_url}/deals?page={page}"
                logging.info(f"Scraping deals page {page}: {deals_url}")
                
                response = self.session.get(deals_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find deal containers
                deal_containers = soup.find_all('div', {'data-component-type': 's-deal-card'})
                
                if not deal_containers:
                    logging.warning(f"No deals found on page {page}")
                    break
                
                for container in deal_containers:
                    try:
                        # Extract product link
                        link_elem = container.find('a', {'class': 'a-link-normal s-no-outline'})
                        if not link_elem:
                            continue
                        
                        product_url = urljoin(self.base_url, link_elem['href'])
                        
                        # Extract basic info
                        product = {}
                        
                        # Title
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
                        
                        # Add affiliate URL
                        product['url'] = self.add_affiliate_id(product_url)
                        
                        # Add timestamp
                        product['scraped_at'] = datetime.now().isoformat()
                        
                        # Add category
                        product['category'] = "Deals"
                        
                        if product.get('title') and product.get('price') != "₹0":
                            products.append(product)
                            logging.info(f"Added deal: {product['title'][:50]}...")
                        
                    except Exception as e:
                        logging.error(f"Error processing deal container: {e}")
                        continue
                
                # Random delay
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                logging.error(f"Error scraping deals page {page}: {e}")
                continue
        
        return products
    
    def run_scraper(self, search_queries=None, scrape_deals=True, max_products_per_query=20):
        """Run the complete scraper"""
        if search_queries is None:
            search_queries = [
                "smartphone",
                "laptop",
                "headphones",
                "smart watch",
                "camera",
                "gaming console",
                "tablet",
                "earbuds",
                "power bank",
                "bluetooth speaker"
            ]
        
        all_products = []
        
        # Scrape search queries
        for query in search_queries:
            logging.info(f"Scraping products for: {query}")
            products = self.scrape_search_results(query, max_pages=2)
            
            # Limit products per query
            if len(products) > max_products_per_query:
                products = products[:max_products_per_query]
            
            all_products.extend(products)
            logging.info(f"Found {len(products)} products for '{query}'")
            
            # Delay between queries
            time.sleep(random.uniform(3, 7))
        
        # Scrape deals
        if scrape_deals:
            logging.info("Scraping deals page")
            deals = self.scrape_deals_page(max_pages=2)
            all_products.extend(deals)
            logging.info(f"Found {len(deals)} deals")
        
        # Remove duplicates based on title
        unique_products = []
        seen_titles = set()
        
        for product in all_products:
            title = product.get('title', '').lower().strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique_products.append(product)
        
        # Update products list
        self.products = unique_products
        
        # Save to file
        self.save_products()
        
        logging.info(f"Scraping completed! Total unique products: {len(unique_products)}")
        return unique_products

def main():
    """Main function to run the scraper"""
    print("🚀 Amazon Product Scraper with Affiliate ID")
    print("=" * 50)
    
    # Get affiliate ID from user
    affiliate_id = input("Enter your Amazon affiliate ID (tag): ").strip()
    
    if not affiliate_id:
        print("❌ Affiliate ID is required!")
        return
    
    # Initialize scraper
    scraper = AmazonScraper(affiliate_id)
    
    print(f"\n✅ Scraper initialized with affiliate ID: {affiliate_id}")
    print("📁 Products will be saved to: products.json")
    
    # Ask for custom search queries
    custom_queries = input("\nEnter custom search queries (comma-separated) or press Enter for defaults: ").strip()
    
    if custom_queries:
        search_queries = [q.strip() for q in custom_queries.split(',')]
    else:
        search_queries = None
    
    # Ask for max products per query
    try:
        max_products = int(input("Enter max products per query (default 20): ") or "20")
    except ValueError:
        max_products = 20
    
    # Ask if user wants to scrape deals
    scrape_deals = input("Scrape deals page? (y/n, default y): ").strip().lower() != 'n'
    
    print(f"\n🎯 Starting scraper with:")
    print(f"   - Affiliate ID: {affiliate_id}")
    print(f"   - Search queries: {search_queries or 'Default queries'}")
    print(f"   - Max products per query: {max_products}")
    print(f"   - Scrape deals: {scrape_deals}")
    print(f"   - Output file: products.json")
    
    # Confirm before starting
    confirm = input("\nStart scraping? (y/n): ").strip().lower()
    if confirm != 'y':
        print("❌ Scraping cancelled!")
        return
    
    try:
        # Run scraper
        products = scraper.run_scraper(
            search_queries=search_queries,
            scrape_deals=scrape_deals,
            max_products_per_query=max_products
        )
        
        print(f"\n🎉 Scraping completed successfully!")
        print(f"📊 Total products scraped: {len(products)}")
        print(f"💾 Products saved to: products.json")
        print(f"🔗 All products now include your affiliate ID: {affiliate_id}")
        
        # Show sample products
        if products:
            print(f"\n📋 Sample products:")
            for i, product in enumerate(products[:3]):
                print(f"   {i+1}. {product.get('title', 'N/A')[:60]}...")
                print(f"      Price: {product.get('price', 'N/A')}")
                print(f"      Category: {product.get('category', 'N/A')}")
                print()
        
    except KeyboardInterrupt:
        print("\n⚠️ Scraping interrupted by user!")
    except Exception as e:
        print(f"\n❌ Error during scraping: {e}")
        logging.error(f"Scraping error: {e}")

if __name__ == "__main__":
    main() 