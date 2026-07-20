import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SettingsCard } from '@/components/dashboard/SettingsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiRequest } from '@/services/api';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor, Bell, Loader2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Notification states
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [reservationsEnabled, setReservationsEnabled] = useState(true);
  const [reviewsEnabled, setReviewsEnabled] = useState(true);
  const [accountEnabled, setAccountEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await apiRequest('/users/profile');
        if (response.success && response.data) {
          setMessagesEnabled(response.data.messages_enabled !== false);
          setReservationsEnabled(response.data.reservations_enabled !== false);
          setReviewsEnabled(response.data.reviews_enabled !== false);
          setAccountEnabled(response.data.account_enabled !== false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPreferences();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);

    try {
      const response = await apiRequest('/notifications/preferences', {
        method: 'PUT',
        body: JSON.stringify({
          messages_enabled: messagesEnabled,
          reservations_enabled: reservationsEnabled,
          reviews_enabled: reviewsEnabled,
          account_enabled: accountEnabled,
        }),
      });

      if (response.success) {
        setMsg('Notification preferences updated!');
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Account Settings"
        description="Manage your security passwords, notification preferences, and appearance theme"
      />

      <div className="space-y-6 max-w-3xl">
        {/* Security / Password Section */}
        <SettingsCard />

        {/* Notification Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Select which in-app alerts you want to receive on CampusHub.
            </p>

            {msg && (
              <p className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                {msg}
              </p>
            )}

            <form onSubmit={handleSavePreferences} className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-accent/40 hover:bg-accent/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-ring border-input bg-background rounded-sm"
                  checked={messagesEnabled}
                  onChange={(e) => setMessagesEnabled(e.target.checked)}
                />
                <div className="text-left text-xs">
                  <span className="font-bold block">Direct Message Alerts</span>
                  <span className="text-[10px] text-muted-foreground">Get notified when a student sends you a message about an item.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-accent/40 hover:bg-accent/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-ring border-input bg-background rounded-sm"
                  checked={reservationsEnabled}
                  onChange={(e) => setReservationsEnabled(e.target.checked)}
                />
                <div className="text-left text-xs">
                  <span className="font-bold block">Bookings & Reservations</span>
                  <span className="text-[10px] text-muted-foreground">Get notified of reservation approvals, declines, or deal finalizations.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-accent/40 hover:bg-accent/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-ring border-input bg-background rounded-sm"
                  checked={reviewsEnabled}
                  onChange={(e) => setReviewsEnabled(e.target.checked)}
                />
                <div className="text-left text-xs">
                  <span className="font-bold block">Peer Ratings & Reviews</span>
                  <span className="text-[10px] text-muted-foreground">Get notified when a peer leaves feedback on your profile after a deal.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-accent/40 hover:bg-accent/70 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary focus:ring-ring border-input bg-background rounded-sm"
                  checked={accountEnabled}
                  onChange={(e) => setAccountEnabled(e.target.checked)}
                />
                <div className="text-left text-xs">
                  <span className="font-bold block">Account Status Alerts</span>
                  <span className="text-[10px] text-muted-foreground">Get notified of password modifications or student profile card changes.</span>
                </div>
              </label>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  Save Preference Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Theme Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">Appearance Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Customize how CampusHub looks on your device.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10 font-bold text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10 font-bold text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  theme === 'system'
                    ? 'border-primary bg-primary/10 font-bold text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs">System Default</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
