import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ShoppingCart, 
  Search, 
  Shield, 
  Truck, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  Users,
  TrendingUp,
  Zap,
  Heart,
  MessageCircle
} from "lucide-react";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import { useState } from "react";
import axios from "axios";

const Index = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/contact/", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        message: form.message,
      });
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Logo */}
      <div 
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content with slight transparency */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50/90 to-indigo-100/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Shopping Assistant
              </Badge>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Shop-Pulse
                </h1>
                <p className="max-w-[700px] text-xl text-gray-600 md:text-2xl dark:text-gray-300">
                  Your intelligent shopping companion that finds the best deals, compares prices, and helps you make informed purchasing decisions.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
                <Link to="/deals">
                  <Button size="lg" className="inline-flex items-center gap-2">
                    Explore Deals
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat with AI
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="w-full py-16 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  About Shop-Pulse
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Shop-Pulse is a revolutionary e-commerce platform that combines the power of artificial intelligence with comprehensive product discovery. 
                  We help you find the best deals, compare prices across multiple retailers, and make informed purchasing decisions.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI-powered chatbot provides personalized shopping recommendations, answers your questions, and helps you navigate through thousands of products with ease. 
                  Whether you're looking for electronics, fashion, home goods, or anything in between, Shop-Pulse is your trusted shopping companion.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.9/5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">50K+ Users</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-blue-500" />
                      Smart Product Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our advanced search algorithms help you find exactly what you're looking for, with intelligent filters and personalized recommendations.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Price Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Compare prices across multiple retailers to ensure you're getting the best possible deal on every purchase.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Personalized Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get tailored recommendations based on your preferences, browsing history, and shopping patterns.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose Shop-Pulse?
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-300">
                Experience the future of online shopping with our cutting-edge features and AI-powered assistance.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>AI Shopping Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Chat with our intelligent AI assistant for personalized product recommendations and shopping guidance.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Secure Shopping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Shop with confidence knowing your data is protected with enterprise-grade security measures.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Fast Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Quick and reliable delivery options with real-time tracking for all your orders.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Round-the-clock customer support to help you with any questions or concerns.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Smart Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Intelligent cart management with price alerts and automatic deal notifications.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle>Advanced Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Powerful search capabilities with filters, sorting, and intelligent suggestions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <ProductCategories />
        </div>

        {/* Featured Products */}
        <div className="bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <FeaturedProducts />
        </div>

        {/* Contact Section */}
        <section className="w-full py-16 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Get in Touch
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-300">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+91 6363538606</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">gratedeals1118@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Manglore<br />
                      Moodbidri, 574227<br />
                      Karnataka
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mt-1 bg-white/50 dark:bg-gray-800/50"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mt-1 bg-white/50 dark:bg-gray-800/50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1 bg-white/50 dark:bg-gray-800/50"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md mt-1 h-32 bg-white/50 dark:bg-gray-800/50"
                        placeholder="Your message here..."
                      />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                    {status === "success" && <p className="text-green-500 mt-2">Message sent successfully!</p>}
                    {status === "error" && <p className="text-red-500 mt-2">Failed to send message. Please try again later.</p>}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 bg-gray-900/95 text-white backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Shop-Pulse</h3>
                <p className="text-gray-400">
                  Your intelligent shopping companion for the best deals and personalized recommendations.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/deals" className="hover:text-white">Deals</Link></li>
                  <li><Link to="/products" className="hover:text-white">Products</Link></li>
                  <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                  <li><Link to="/chatbot" className="hover:text-white">AI Assistant</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/profile" className="hover:text-white">My Account</Link></li>
                  <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
                  <li><Link to="/orders" className="hover:text-white">Order History</Link></li>
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Connect</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>greatdeals1118@gmail.com</li>
                  <li>+91 6363538606</li>
                  <li>moodbidri</li>
                  <li>Manglore, Karnataka</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Shop-Pulse. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
