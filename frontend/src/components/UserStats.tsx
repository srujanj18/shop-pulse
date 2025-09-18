import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Star,
  TrendingUp,
  Calendar,
  MapPin
} from "lucide-react";

interface UserStatsProps {
  totalOrders: number;
  totalSpent: number;
  favoriteCategories: string[];
  memberSince: string;
  lastLogin: string;
  recentActivity?: Array<{
    type: string;
    description: string;
    date: string;
    amount?: number;
  }>;
}

export const UserStats = ({
  totalOrders,
  totalSpent,
  favoriteCategories,
  memberSince,
  lastLogin,
  recentActivity = []
}: UserStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Shopping Statistics</CardTitle>
        <CardDescription>
          Your shopping activity and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold">{totalOrders}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold">{favoriteCategories.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Favorite Categories</p>
          </div>
        </div>

        <Separator />

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{memberSince}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Last Login</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{lastLogin}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Favorite Categories */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            Favorite Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {favoriteCategories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        ₹{activity.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 