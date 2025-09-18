import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ThemeDemo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Dark Mode Demo</h1>
        <p className="text-muted-foreground">
          Current theme: <span className="font-semibold capitalize">{theme}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <ThemeToggle size="lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Light Mode Colors</CardTitle>
            <CardDescription>
              These colors adapt automatically based on the theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-background border rounded flex items-center px-3">
                Background
              </div>
              <div className="h-8 bg-card border rounded flex items-center px-3">
                Card Background
              </div>
              <div className="h-8 bg-primary text-primary-foreground rounded flex items-center px-3">
                Primary
              </div>
              <div className="h-8 bg-secondary text-secondary-foreground rounded flex items-center px-3">
                Secondary
              </div>
              <div className="h-8 bg-muted text-muted-foreground rounded flex items-center px-3">
                Muted
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Features</CardTitle>
            <CardDescription>
              What's included in the dark mode implementation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Persistent across sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System preference detection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Smooth transitions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Accessible toggle buttons</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Works across all components</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 