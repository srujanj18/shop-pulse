#!/usr/bin/env python3
"""
Test script to analyze and validate the products.json file
"""

import json
import os
from datetime import datetime

def analyze_products():
    """Analyze the products.json file and provide insights"""
    
    products_file = "products.json"
    
    if not os.path.exists(products_file):
        print("❌ products.json file not found!")
        return
    
    try:
        with open(products_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("📊 Products.json Analysis")
        print("=" * 40)
        
        # Check if it's a list or dict
        if isinstance(data, list):
            print(f"📋 Total products: {len(data)}")
            print("📁 Structure: List of products")
            
            # Analyze sample products
            if data:
                sample = data[0]
                print(f"\n📝 Sample product structure:")
                for key, value in sample.items():
                    print(f"   {key}: {type(value).__name__}")
                
                # Check for affiliate IDs
                affiliate_products = [p for p in data if 'tag=' in p.get('url', '')]
                print(f"\n🔗 Products with affiliate IDs: {len(affiliate_products)}/{len(data)}")
                
        elif isinstance(data, dict):
            print(f"📁 Structure: Dictionary with categories")
            total_products = 0
            
            for category, products in data.items():
                if isinstance(products, list):
                    print(f"   {category}: {len(products)} products")
                    total_products += len(products)
                else:
                    print(f"   {category}: {type(products).__name__}")
            
            print(f"\n📋 Total products across all categories: {total_products}")
            
            # Analyze sample from first category
            if data:
                first_category = list(data.keys())[0]
                products = data[first_category]
                if isinstance(products, list) and products:
                    sample = products[0]
                    print(f"\n📝 Sample product from '{first_category}':")
                    for key, value in sample.items():
                        print(f"   {key}: {type(value).__name__}")
                    
                    # Check for affiliate IDs
                    affiliate_products = [p for p in products if 'tag=' in p.get('url', '')]
                    print(f"\n🔗 Products with affiliate IDs in '{first_category}': {len(affiliate_products)}/{len(products)}")
        
        # Check file size
        file_size = os.path.getsize(products_file)
        print(f"\n💾 File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
        
        # Check for common issues
        print(f"\n🔍 Data Quality Check:")
        
        if isinstance(data, dict):
            for category, products in data.items():
                if isinstance(products, list):
                    # Check for missing required fields
                    missing_title = sum(1 for p in products if not p.get('title'))
                    missing_price = sum(1 for p in products if not p.get('price'))
                    missing_url = sum(1 for p in products if not p.get('url'))
                    
                    if missing_title or missing_price or missing_url:
                        print(f"   ⚠️  {category}: Missing data - Title: {missing_title}, Price: {missing_price}, URL: {missing_url}")
                    else:
                        print(f"   ✅ {category}: All required fields present")
        
        print(f"\n✅ Analysis complete!")
        
    except json.JSONDecodeError as e:
        print(f"❌ Error reading JSON file: {e}")
    except Exception as e:
        print(f"❌ Error analyzing file: {e}")

def validate_affiliate_links():
    """Validate affiliate links in the products"""
    
    products_file = "products.json"
    
    if not os.path.exists(products_file):
        print("❌ products.json file not found!")
        return
    
    try:
        with open(products_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("\n🔗 Affiliate Link Validation")
        print("=" * 40)
        
        affiliate_id = "bestdeal03ff2-21"
        valid_links = 0
        total_links = 0
        
        def check_products(products):
            nonlocal valid_links, total_links
            
            if isinstance(products, list):
                for product in products:
                    url = product.get('url', '')
                    if url:
                        total_links += 1
                        if affiliate_id in url:
                            valid_links += 1
                        else:
                            print(f"   ❌ Missing affiliate ID: {url[:80]}...")
        
        if isinstance(data, list):
            check_products(data)
        elif isinstance(data, dict):
            for category, products in data.items():
                if isinstance(products, list):
                    print(f"\n📁 Checking {category}:")
                    check_products(products)
        
        print(f"\n📊 Affiliate Link Summary:")
        print(f"   Valid links: {valid_links}")
        print(f"   Total links: {total_links}")
        print(f"   Success rate: {(valid_links/total_links*100):.1f}%" if total_links > 0 else "   Success rate: N/A")
        
    except Exception as e:
        print(f"❌ Error validating links: {e}")

if __name__ == "__main__":
    analyze_products()
    validate_affiliate_links() 