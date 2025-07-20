import { useEffect, useState } from "react";
import { auth, provider } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Settings, 
  LogOut, 
  Edit, 
  Save, 
  X,
  ShoppingBag,
  Heart,
  Star,
  CreditCard,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSettings } from "@/components/ProfileSettings";
import { UserStats } from "@/components/UserStats";
import { useTheme } from "@/contexts/ThemeContext";
import axios from "axios";

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  favoriteCategories: string[];
  memberSince: string;
  lastLogin: string;
}

const ProfilePage = () => {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 12,
    totalSpent: 2847.50,
    favoriteCategories: ["Electronics", "Fashion", "Home & Garden"],
    memberSince: "March 2024",
    lastLogin: "2 hours ago"
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [recentActivity] = useState([
    {
      type: "order",
      description: "Order #12345 delivered",
      date: "2 hours ago",
      amount: 1299
    },
    {
      type: "wishlist",
      description: "Added iPhone 15 to wishlist",
      date: "1 day ago"
    },
    {
      type: "order",
      description: "Order #12344 placed",
      date: "3 days ago",
      amount: 2499
    },
    {
      type: "review",
      description: "Reviewed Samsung Galaxy S24",
      date: "1 week ago"
    }
  ]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
    }
  }, [user]);

  // Fetch orders for the user
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;
    let interval: NodeJS.Timeout;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/orders/user/${user.id}`
        );
        if (isMounted) {
          setOrders(res.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setOrdersError(
            err.response?.data?.detail || err.message || "Failed to fetch orders."
          );
        }
      } finally {
        if (isMounted) setOrdersLoading(false);
      }
    };

    fetchOrders();
    interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!orders.length) return;

    // Total Orders
    const totalOrders = orders.length;

    // Total Spent (assuming each order has a 'total' or you can sum price * quantity)
    const totalSpent = orders.reduce((sum, order) => {
      // If you have order.items, sum their price * quantity, else use order.total or similar
      if (order.items) {
        return sum + order.items.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
      }
      // fallback: if you have order.price or order.total
      return sum + (order.total || 0);
    }, 0);

    // Favorite Categories (if you have product/category info)
    // This is a placeholder; you may need to fetch product details for real categories
    const categoryCount: Record<string, number> = {};
    orders.forEach(order => {
      if (order.category) {
        categoryCount[order.category] = (categoryCount[order.category] || 0) + 1;
      }
    });
    const favoriteCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);

    setUserStats({
      totalOrders,
      totalSpent,
      favoriteCategories,
      memberSince: "N/A", // or a static value, or remove this field
      lastLogin: "N/A"    // or a static value, or remove this field
    });
  }, [orders, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      // For now, just update the local state
      // In a real app, you'd update the profile in Firebase
      console.log("Profile update:", { name: editName, email: editEmail });
      
      setIsEditing(false);
      // You might want to refresh the user data here
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
  return (
    <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <CardTitle className="text-2xl">Welcome to Shop-Pulse</CardTitle>
              <CardDescription>
                Sign in to access your personalized profile and shopping experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={loginWithGoogle} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
              <p className="text-sm text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Order Card List
  const renderOrders = () => {
    if (ordersLoading) {
      return <div className="py-8 text-center text-gray-500">Loading orders...</div>;
    }
    if (ordersError) {
      return <div className="py-8 text-center text-red-500">{ordersError}</div>;
    }
    if (!orders.length) {
      return <div className="py-8 text-center text-gray-400">No orders found.</div>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">Order #{order.id}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Product ID: <span className="font-mono">{order.product_id}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Quantity: <span className="font-semibold">{order.quantity}</span>
            </div>
            <div className="text-xs text-gray-400 mt-auto">
              Ordered: {new Date(order.order_date).toLocaleString()}
            </div>
            {order.tracking_number && (
              <div className="text-xs text-blue-500 mt-1">
                Tracking: {order.tracking_number}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="xl:hidden mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "stats", label: "Stats", icon: TrendingUp },
            { id: "settings", label: "Settings", icon: Settings }
          ].map((tab) => (
          <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
          </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Profile Card */}
        <div className="xl:col-span-3 space-y-6">
          {/* Profile Information - Show on desktop or when profile tab is active */}
          {(activeTab === "profile" || window.innerWidth >= 1280) && (
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Profile Information</CardTitle>
                <CardDescription>
                  Your personal details and account information
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || ""} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
        </div>
      ) : (
                    <div>
                      <h3 className="text-xl font-semibold">{user.name || "No name set"}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      <Badge variant="secondary" className="mt-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Account
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}

              <Separator />

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userStats.memberSince}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userStats.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Statistics - Show on desktop or when stats tab is active */}
          {(activeTab === "stats" || window.innerWidth >= 1280) && (
            <>
              <UserStats
                totalOrders={userStats.totalOrders}
                totalSpent={userStats.totalSpent}
                favoriteCategories={userStats.favoriteCategories}
                memberSince={userStats.memberSince}
                lastLogin={userStats.lastLogin}
                recentActivity={recentActivity}
              />
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Your Orders (Real-Time)</h3>
                {renderOrders()}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings - Show on desktop or when settings tab is active */}
          {(activeTab === "settings" || window.innerWidth >= 1280) && (
            <ProfileSettings
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;