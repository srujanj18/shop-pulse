# Improved Amazon Product Scraper

An enhanced Amazon product scraper with better anti-detection measures, error handling, and rate limiting.

## Features

- ✅ **Anti-Detection**: Uses cloudscraper to bypass Amazon's bot detection
- ✅ **Rate Limiting**: Intelligent delays between requests to avoid blocking
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Affiliate Integration**: Automatically adds your affiliate ID to all URLs
- ✅ **Category Organization**: Products organized by search categories
- ✅ **Duplicate Prevention**: Removes duplicate products based on title

## Installation

1. Install the required dependencies:
```bash
pip install -r requirements_improved.txt
```

2. Run the improved scraper:
```bash
python amazon_scraper_improved.py
```

## Usage

### Basic Usage
```bash
python amazon_scraper_improved.py
```

### Configuration Options
- **Affiliate ID**: Your Amazon affiliate tag (required)
- **Search Queries**: Custom search terms (comma-separated)
- **Max Products**: Number of products per query (default: 5)
- **Output File**: `products_improved.json`

## Troubleshooting

### Common Issues

#### 1. 503 Service Unavailable
**Problem**: Amazon returns 503 errors
**Solution**: 
- The improved scraper includes longer delays and retry logic
- Try running with fewer products per query
- Use the default search queries first

#### 2. Connection Timeouts
**Problem**: Network timeouts during scraping
**Solution**:
- Check your internet connection
- The scraper now has increased timeout values
- Retry logic will handle temporary network issues

#### 3. DNS Resolution Errors
**Problem**: "Failed to resolve 'www.amazon.in'"
**Solution**:
- Check your DNS settings
- Try using a different DNS server (8.8.8.8 or 1.1.1.1)
- Restart your network connection

#### 4. Rate Limiting/Blocking
**Problem**: Amazon blocks the scraper
**Solution**:
- The improved scraper includes intelligent rate limiting
- Longer delays between requests
- Random delays to mimic human behavior

### Best Practices

1. **Start Small**: Begin with 2-3 products per query
2. **Use Default Queries**: Test with the default search terms first
3. **Monitor Logs**: Check `amazon_scraper_improved.log` for detailed information
4. **Respect Rate Limits**: Don't run the scraper too frequently
5. **Valid Affiliate ID**: Ensure your affiliate ID is correct

### Advanced Configuration

#### Custom Search Queries
```
smartphone, laptop, headphones, smart watch, camera
```

#### Environment Variables (Optional)
```bash
export AMAZON_AFFILIATE_ID="your-affiliate-id"
export AMAZON_BASE_URL="https://www.amazon.in"
```

## Output Format

The scraper generates a JSON file with the following structure:

```json
{
  "Smartphone": [
    {
      "title": "Product Title",
      "price": "₹25,999",
      "image": "https://...",
      "url": "https://amazon.in/...?tag=your-affiliate-id",
      "rating": "4.5",
      "category": "Smartphone",
      "scraped_at": "2024-01-01T12:00:00"
    }
  ],
  "Laptop": [
    // ... more products
  ]
}
```

## Logging

The scraper creates detailed logs in `amazon_scraper_improved.log`:

- Request attempts and responses
- Error messages and retry attempts
- Rate limiting information
- Product extraction details

## Legal and Ethical Considerations

⚠️ **Important**: Web scraping may violate Amazon's Terms of Service. Use responsibly:

1. **Respect robots.txt**: Check Amazon's robots.txt file
2. **Rate Limiting**: Don't overload their servers
3. **Terms of Service**: Review Amazon's ToS before scraping
4. **Personal Use**: Use scraped data for personal projects only
5. **Affiliate Compliance**: Follow Amazon's affiliate program guidelines

## Alternative Solutions

If you continue to face issues:

1. **Use Amazon's API**: Consider using Amazon's official Product Advertising API
2. **Proxy Rotation**: Implement proxy rotation for better success rates
3. **Selenium**: Use browser automation for more complex scenarios
4. **Third-party Services**: Consider using existing product data services

## Support

For issues and questions:

1. Check the logs in `amazon_scraper_improved.log`
2. Review the troubleshooting section above
3. Ensure your affiliate ID is valid
4. Try with different search queries

## Changelog

### v2.0 (Improved Version)
- Added cloudscraper for anti-detection
- Implemented intelligent rate limiting
- Enhanced error handling and retry logic
- Improved product extraction
- Better logging and monitoring
- Category-based organization

### v1.0 (Original Version)
- Basic Amazon scraping functionality
- Affiliate ID integration
- Simple error handling 