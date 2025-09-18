#!/usr/bin/env python3
"""
Test script to measure chatbot performance and response times
"""

import requests
import time
import json
from typing import List, Dict

def test_chatbot_performance():
    """Test chatbot performance with various queries"""
    
    base_url = "http://localhost:8000/api"
    
    # Test queries with expected response times
    test_queries = [
        ("hello", "Cached response (should be < 100ms)"),
        ("hi", "Cached response (should be < 100ms)"),
        ("help", "Cached response (should be < 100ms)"),
        ("What is the weather like?", "Short query (should be < 2000ms)"),
        ("Tell me about the latest smartphones and their features in detail", "Long query (should be < 5000ms)"),
    ]
    
    print("🚀 Chatbot Performance Test")
    print("=" * 50)
    
    results = []
    
    for query, description in test_queries:
        print(f"\n📝 Testing: '{query}'")
        print(f"   Expected: {description}")
        
        try:
            start_time = time.time()
            
            response = requests.post(
                f"{base_url}/chat",
                json={
                    "message": query,
                    "history": [],
                    "user_id": "test_user"
                },
                timeout=20
            )
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200:
                data = response.json()
                bot_response = data.get("response", "No response")
                response_time_from_api = data.get("response_time", 0)
                
                print(f"   ✅ Success!")
                print(f"   ⏱️  Response time: {response_time:.0f}ms")
                print(f"   📊 API reported time: {response_time_from_api}ms")
                print(f"   🤖 Response: {bot_response[:100]}...")
                
                results.append({
                    "query": query,
                    "response_time": response_time,
                    "api_time": response_time_from_api,
                    "success": True
                })
                
            else:
                print(f"   ❌ Error: {response.status_code}")
                print(f"   📄 Response: {response.text}")
                results.append({
                    "query": query,
                    "response_time": 0,
                    "api_time": 0,
                    "success": False
                })
                
        except requests.exceptions.Timeout:
            print(f"   ⏰ Timeout (>20s)")
            results.append({
                "query": query,
                "response_time": 20000,
                "api_time": 0,
                "success": False
            })
        except Exception as e:
            print(f"   ❌ Error: {e}")
            results.append({
                "query": query,
                "response_time": 0,
                "api_time": 0,
                "success": False
            })
    
    # Performance summary
    print(f"\n📊 Performance Summary")
    print("=" * 50)
    
    successful_results = [r for r in results if r["success"]]
    
    if successful_results:
        avg_response_time = sum(r["response_time"] for r in successful_results) / len(successful_results)
        fastest_response = min(r["response_time"] for r in successful_results)
        slowest_response = max(r["response_time"] for r in successful_results)
        
        print(f"✅ Successful requests: {len(successful_results)}/{len(results)}")
        print(f"⚡ Average response time: {avg_response_time:.0f}ms")
        print(f"🏃 Fastest response: {fastest_response:.0f}ms")
        print(f"🐌 Slowest response: {slowest_response:.0f}ms")
        
        # Performance rating
        if avg_response_time < 1000:
            print(f"🎉 Excellent performance!")
        elif avg_response_time < 3000:
            print(f"👍 Good performance")
        elif avg_response_time < 5000:
            print(f"⚠️  Moderate performance - consider optimizations")
        else:
            print(f"❌ Poor performance - needs optimization")
    else:
        print("❌ No successful requests")
    
    # Test health endpoint
    try:
        health_response = requests.get(f"{base_url}/health", timeout=5)
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"\n🏥 Health Check: ✅ {health_data}")
        else:
            print(f"\n🏥 Health Check: ❌ {health_response.status_code}")
    except Exception as e:
        print(f"\n🏥 Health Check: ❌ {e}")

def test_concurrent_requests():
    """Test multiple concurrent requests"""
    
    print(f"\n🔄 Concurrent Request Test")
    print("=" * 50)
    
    import concurrent.futures
    import threading
    
    def make_request(query: str) -> Dict:
        try:
            start_time = time.time()
            response = requests.post(
                "http://localhost:8000/api/chat",
                json={
                    "message": query,
                    "history": [],
                    "user_id": f"user_{threading.current_thread().ident}"
                },
                timeout=10
            )
            end_time = time.time()
            
            return {
                "query": query,
                "response_time": (end_time - start_time) * 1000,
                "success": response.status_code == 200,
                "status_code": response.status_code
            }
        except Exception as e:
            return {
                "query": query,
                "response_time": 0,
                "success": False,
                "error": str(e)
            }
    
    # Test with 5 concurrent requests
    concurrent_queries = ["hello", "hi", "help", "test", "quick"]
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(make_request, query) for query in concurrent_queries]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    print(f"📊 Concurrent Test Results:")
    for result in results:
        status = "✅" if result["success"] else "❌"
        print(f"   {status} '{result['query']}': {result['response_time']:.0f}ms")
    
    successful_concurrent = [r for r in results if r["success"]]
    if successful_concurrent:
        avg_concurrent_time = sum(r["response_time"] for r in successful_concurrent) / len(successful_concurrent)
        print(f"   ⚡ Average concurrent response time: {avg_concurrent_time:.0f}ms")

if __name__ == "__main__":
    print("Starting chatbot performance tests...")
    print("Make sure your backend server is running on http://localhost:8000")
    print()
    
    test_chatbot_performance()
    test_concurrent_requests()
    
    print(f"\n✅ Performance testing completed!")