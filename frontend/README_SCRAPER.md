# Amazon Product Scraper with Affiliate ID

This Python script scrapes products from Amazon and automatically adds your affiliate ID to all product URLs, then saves them to `products.json` for use in your Shop-Pulse application.

## 🚀 Features

- **Affiliate Integration**: Automatically adds your Amazon affiliate ID to all product URLs
- **Multiple Sources**: Scrapes from search results and deals pages
- **Product Data**: Extracts title, price, image, rating, and category
- **Duplicate Prevention**: Removes duplicate products based on title
- **Rate Limiting**: Built-in delays to avoid being blocked
- **Logging**: Comprehensive logging for debugging
- **Error Handling**: Graceful error handling and recovery

## 📋 Prerequisites

1. **Python 3.7+** installed on your system
2. **Amazon Affiliate Account** with your affiliate ID (tag)
3. **Internet Connection** for scraping

## 🛠️ Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements_scraper.txt
   ```

## 🎯 How to Use

### 1. Get Your Amazon Affiliate ID

1. Sign up for Amazon Associates Program
2. Get your affiliate ID (tag) from your dashboard
3. Example affiliate ID: `yourname-21`

### 2. Run the Scraper

```bash
python amazon_scraper.py
```

### 3. Follow the Prompts

The script will ask you for:

- **Affiliate ID**: Enter your Amazon affiliate tag
- **Custom Search Queries**: Enter specific products to search for (optional)
- **Max Products per Query**: How many products to scrape per search term
- **Scrape Deals**: Whether to include Amazon deals page

### 4. Example Usage

```
🚀 Amazon Product Scraper with Affiliate ID
==================================================
Enter your Amazon affiliate ID (tag): yourname-21

✅ Scraper initialized with affiliate ID: yourname-21
📁 Products will be saved to: products.json

Enter custom search queries (comma-separated) or press Enter for defaults: 
Enter max products per query (default 20): 15
Scrape deals page? (y/n, default y): y

🎯 Starting scraper with:
   - Affiliate ID: yourname-21
   - Search queries: Default queries
   - Max products per query: 15
   - Scrape deals: True
   - Output file: products.json

Start scraping? (y/n): y
```

## 📊 Default Search Queries

If you don't specify custom queries, the scraper will search for:

- smartphone
- laptop
- headphones
- smart watch
- camera
- gaming console
- tablet
- earbuds
- power bank
- bluetooth speaker

## 📁 Output Files

### products.json
Contains all scraped products with the following structure:

```json
[
  {
    "title": "Product Name",
    "price": "₹1,999",
    "image": "https://m.media-amazon.com/images/I/...",
    "url": "https://www.amazon.in/product?tag=yourname-21",
    "rating": "4.5",
    "category": "Electronics",
    "scraped_at": "2024-01-15T10:30:00"
  }
]
```

### amazon_scraper.log
Detailed logging file with scraping progress and errors.

## ⚙️ Configuration Options

### Base URL
Change the Amazon domain in the scraper:

```python
scraper = AmazonScraper(affiliate_id, base_url="https://www.amazon.com")  # US
scraper = AmazonScraper(affiliate_id, base_url="https://www.amazon.in")   # India
scraper = AmazonScraper(affiliate_id, base_url="https://www.amazon.co.uk") # UK
```

### Rate Limiting
Adjust delays in the code to avoid being blocked:

```python
time.sleep(random.uniform(2, 5))  # Random delay between requests
```

## 🔧 Customization

### Add New Search Queries

Edit the `search_queries` list in the `run_scraper` method:

```python
search_queries = [
    "smartphone",
    "laptop",
    "your-custom-query",
    "another-product"
]
```

### Modify Product Extraction

Edit the `scrape_search_results` method to extract additional fields:

```python
# Add custom field
product['custom_field'] = "custom_value"
```

## ⚠️ Important Notes

### Legal Compliance
- Ensure you comply with Amazon's Terms of Service
- Respect robots.txt and rate limiting
- Use responsibly and ethically

### Rate Limiting
- The scraper includes built-in delays to avoid being blocked
- Don't run too frequently to avoid IP restrictions
- Consider using proxies for large-scale scraping

### Data Accuracy
- Product prices and availability may change
- Images and URLs may become invalid over time
- Regularly update your product database

## 🐛 Troubleshooting

### Common Issues

1. **No products found**
   - Check your internet connection
   - Verify Amazon is accessible
   - Try different search queries

2. **Blocked by Amazon**
   - Increase delays between requests
   - Use a VPN or proxy
   - Reduce the number of products per query

3. **JSON parsing errors**
   - Check if products.json is corrupted
   - Delete the file and restart

### Debug Mode

Enable detailed logging by modifying the logging level:

```python
logging.basicConfig(level=logging.DEBUG)
```

## 📈 Integration with Shop-Pulse

The scraped `products.json` file is automatically compatible with your Shop-Pulse frontend:

1. **Frontend Integration**: The React app reads from `products.json`
2. **Affiliate Links**: All product URLs include your affiliate ID
3. **Real-time Updates**: Refresh the scraper to get latest products

## 🔄 Automation

### Schedule Regular Updates

Use cron jobs (Linux/Mac) or Task Scheduler (Windows) to run the scraper regularly:

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/frontend && python amazon_scraper.py
```

### Continuous Integration

Add to your deployment pipeline to keep products updated automatically.

## 📞 Support

For issues or questions:
1. Check the `amazon_scraper.log` file for detailed error messages
2. Verify your affiliate ID is correct
3. Ensure all dependencies are installed
4. Test with a small number of products first

## 🎉 Success!

Once the scraper completes, your `products.json` file will contain:
- ✅ Products with your affiliate links
- ✅ Complete product information
- ✅ Ready for use in Shop-Pulse
- ✅ Automatic revenue generation through affiliate sales

Happy scraping! 🚀 