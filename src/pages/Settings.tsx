import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, LogOut, Save } from 'lucide-react';

export default function Settings() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('display_name').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles')
      .update({ display_name: displayName })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) toast.error('Failed to save');
    else toast.success('Profile updated');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <div className="flex-1 p-5 max-w-xl">
          <h2 className="text-lg font-semibold text-foreground mb-6">Settings</h2>

          {/* Profile section */}
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Manage your account settings</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Display Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground mt-1 focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Email</label>
                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-muted-foreground mt-1"
                />
              </div>

              <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave} disabled={saving}>
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Sign out */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Account</h3>
            <p className="text-xs text-muted-foreground mb-3">Sign out of your TaskFlow account.</p>
            <Button variant="destructive" size="sm" className="gap-1.5 text-xs" onClick={handleSignOut}>
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
