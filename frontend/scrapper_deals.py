import httpx
from bs4 import BeautifulSoup
import asyncio
import json
import os
import re
import random

# === CONFIG ===
AFFILIATE_TAG = "bestdeal03ff2-21"
PRODUCTS_FILE = "products.json"

SEARCH_KEYWORDS = {
    "Smartphones": [
        "oneplus nord 5", "iqoo neo 9 pro", "realme gt 6", "motorola edge 50 pro", "xiaomi 14 civi", 
        "samsung m15 5g", "honor 200", "infinix gt 20 pro"
    ],
    "Laptops & Tablets": [
        "macbook air m3", "lenovo yoga slim 7", "asus vivobook s15 oled", "hp spectre x360", 
        "dell xps 14 2025", "acer swift go 14", "ipad air m2", "samsung galaxy tab s9 fe"
    ],
    "Wearables & Fitness": [
        "noise colorfit nova", "boat wave sigma", "fire boltt visionary pro", 
        "amazfit gts 4 mini", "fitbit charge 6", "oneplus watch 2", "realme band 2", "xiaomi smart band 8"
    ],
    "Audio & Accessories": [
        "sony wh-1000xm5", "boat nirvana ion", "jbl tune beam", "realme buds air 6", 
        "oneplus nord buds 2r", "noise aura buds", "oppo enco air 3 pro"
    ],
    "Home Tech": [
        "mi 360 home security camera", "wipro smart bulb", "echo dot 5th gen", 
        "fire tv stick 4k 2025", "realme smart tv 43 inch", "redmi smart air fryer"
    ],
    "Gaming": [
        "ps5 slim india", "xbox series s", "logitech g435 wireless", 
        "cooler master gaming chair", "asus tuf gaming f15 2025", "msi katana 17"
    ],
    "Personal Care": [
        "philips 13-in-1 trimmer", "veet sensitive touch electric trimmer", 
        "lifelong hair dryer", "himalaya neem face wash", "beardo beard kit", "bombay shaving company trimmer"
    ],
    "Kitchen & Home Appliances": [
        "kent grand plus water purifier", "prestige induction cooktop", 
        "bajaj room heater", "bosch mixer grinder", "morphy richards oven", "amazonbasics ceiling fan"
    ],
    "Fashion & Accessories": [
        "casio vintage watch", "skmei sports watch", "wildcraft backpack", 
        "allen solly men's tshirt", "roadster jeans", "zouk women handbag"
    ]
}

HEADERS_LIST = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/91.0.4472.114 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/14.0 Safari/605.1.15",
]

# === UTILS ===
def escape(text):
    return re.sub(r'\s+', ' ', text.strip())

def save_product(product, category):
    try:
        if not os.path.exists(PRODUCTS_FILE):
            data = {}
        else:
            with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError as e:
                    print(f"⚠️ JSON decode error: {e}. Starting fresh.")
                    data = {}

        if category not in data:
            data[category] = []

        if any(p["title"] == product["title"] for p in data[category]):
            print(f"⚠️ Duplicate skipped: {product['title']}")
        else:
            data[category].append(product)
            with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"📁 Updated {PRODUCTS_FILE} with new product in '{category}'")
    except Exception as e:
        print(f"❌ Error saving product '{product['title']}': {e}")

# === AMAZON SCRAPER ===
async def fetch_first_product_from_amazon_search(keyword):
    try:
        headers = {
            "User-Agent": random.choice(HEADERS_LIST),
            "Accept-Language": "en-US,en;q=0.9",
        }
        url = f"https://www.amazon.in/s?k={keyword.replace(' ', '+')}"
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, headers=headers)
            soup = BeautifulSoup(resp.text, "html.parser")

            product_block = soup.select_one("div.s-result-item[data-asin]:has(h2)")
            if not product_block:
                print(f"❌ No product found for: {keyword}")
                return None

            title_tag = product_block.select_one("h2 a span")
            link_tag = product_block.select_one("h2 a")
            image_tag = product_block.select_one("img")
            price_tag = product_block.select_one(".a-price .a-offscreen")

            if not title_tag or not link_tag:
                return None

            product = {
                "title": escape(title_tag.text),
                "url": f"https://www.amazon.in{link_tag['href'].split('?')[0]}?tag={AFFILIATE_TAG}",
                "image": image_tag["src"] if image_tag else "",
                "price": escape(price_tag.text) if price_tag else "N/A",
            }

            return product

    except Exception as e:
        print(f"⚠️ Failed to fetch product for '{keyword}': {e}")
        return None

# === MAIN SCRAPER ===
async def run_scraper():
    print(f"📂 Current working directory: {os.getcwd()}")
    print(f"📄 Output file: {PRODUCTS_FILE}\n")

    for category, keywords in SEARCH_KEYWORDS.items():
        for keyword in keywords:
            print(f"🔍 Searching in [{category}]: {keyword}")
            product = await fetch_first_product_from_amazon_search(keyword)
            if product:
                save_product(product, category)
                print(f"✅ Saved: {product['title']}\n")
            await asyncio.sleep(5)  # Be polite to Amazon

if __name__ == "__main__":
    asyncio.run(run_scraper())
