"use client";

import { useQuery } from "convex-helpers/react";
import { api } from "convex/_generated/api";
import { Camera, Github, Mail, Upload, User } from "lucide-react";
import { useTheme } from "next-themes";
import FullScreenLoading from "~/components/full-screen-loading";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import ActivityStatusAvatar from "~/components/users/activity-status-avatar";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: user, isPending } = useQuery(api.users.query.getCurrentUser);
  if (isPending) return <FullScreenLoading />;
  if (!user) return null;

  const connectedAccounts = [
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      connected: true,
    },
    {
      id: "google",
      name: "Google",
      icon: Mail,
      connected: true,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription>
                Update your profile information and photo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ActivityStatusAvatar />
                  <label
                    htmlFor="profile-upload"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 absolute -right-2 -bottom-2 cursor-pointer rounded-full p-2 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Photo</h3>
                  <p className="text-muted-foreground text-sm">
                    Upload a new profile photo. Recommended size: 400x400px.
                  </p>
                  <label htmlFor="profile-upload">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer bg-transparent"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Username and Email */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={user.username}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Manage your connected social accounts and integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-lg p-2">
                        <account.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{account.name}</span>
                          {account.connected && (
                            <Badge variant="secondary" className="text-xs">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={account.connected ? "outline" : "default"}
                      size="sm"
                    >
                      {account.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="dark-mode"
                      className="text-base font-medium"
                    >
                      Dark Mode
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Switch between light and dark themes.
                    </p>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    id="dark-mode"
                    onCheckedChange={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-destructive/20 flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-muted-foreground text-sm">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
