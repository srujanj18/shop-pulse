import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  X
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ProfileSettingsProps {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}

export const ProfileSettings = ({
  notifications,
  setNotifications
}: ProfileSettingsProps) => {
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and security settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferences */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Preferences
          </h4>
          <div className="space-y-4">
                          <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Moon className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="notifications" className="text-sm">Email Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Security */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Security
          </h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-sm">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password" className="text-sm">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-sm">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <Button className="w-full" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>
        </div>

        <Separator />

        {/* Account Status */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
            Account Status
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">Email Verification</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Account Type</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Standard
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 