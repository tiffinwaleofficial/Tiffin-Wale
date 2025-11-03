import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Play, Pause, RefreshCw, Database, Trash2, AlertTriangle, CheckCircle, Clock, Power, Save } from 'lucide-react';
import apiClient from '@/config/api';
import { toast } from 'sonner';

export default function Configuration() {
  const [systemConfig, setSystemConfig] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [crons, setCrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);

  useEffect(() => {
    fetchConfigurationData();
  }, []);

  const fetchConfigurationData = async () => {
    setLoading(true);
    try {
      const [configRes, statsRes, cronsRes] = await Promise.all([
        apiClient.get('/super-admin/system/config'),
        apiClient.get('/super-admin/system/stats').catch(() => ({ data: null })),
        apiClient.get('/super-admin/system/crons').catch(() => ({ data: [] })),
      ]);
      setSystemConfig(configRes.data);
      setSystemStats(statsRes.data);
      // Handle both array and object responses
      const cronsData = Array.isArray(cronsRes.data) ? cronsRes.data : (cronsRes.data?.data || []);
      setCrons(cronsData);
    } catch (error) {
      console.error('Configuration fetch error:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (updates) => {
    setSaving(true);
    try {
      await apiClient.patch('/super-admin/system/config', updates);
      toast.success('Configuration updated successfully');
      fetchConfigurationData();
    } catch (error) {
      console.error('Config update error:', error);
      toast.error('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeature = async (feature, enabled) => {
    const updates = {
      features: {
        ...(systemConfig?.features || {}),
        [feature]: enabled,
      },
    };
    await handleUpdateConfig(updates);
  };

  const handleToggleCron = async (cronName, enabled) => {
    try {
      await apiClient.patch(`/super-admin/system/crons/${cronName}/status`, { enabled });
      toast.success(`Cron job ${enabled ? 'enabled' : 'disabled'} successfully`);
      fetchConfigurationData();
    } catch (error) {
      console.error('Cron toggle error:', error);
      toast.error('Failed to update cron job status');
    }
  };

  const handleTriggerCron = async (cronName) => {
    setExecuting(`cron-${cronName}`);
    try {
      await apiClient.post(`/super-admin/system/crons/${cronName}/trigger`);
      toast.success('Cron job triggered successfully');
      fetchConfigurationData();
    } catch (error) {
      console.error('Cron trigger error:', error);
      toast.error('Failed to trigger cron job');
    } finally {
      setExecuting(null);
    }
  };

  const handleExecuteCommand = async (command, params = {}) => {
    setExecuting(`command-${command}`);
    try {
      await apiClient.post(`/super-admin/system/commands/${command}`, params);
      toast.success('Command executed successfully');
      fetchConfigurationData();
    } catch (error) {
      console.error('Command execution error:', error);
      toast.error(error.response?.data?.message || 'Failed to execute command');
    } finally {
      setExecuting(null);
      setConfirmDialogOpen(false);
      setSelectedCommand(null);
    }
  };

  const handleCommandClick = (command, requiresConfirmation = true) => {
    setSelectedCommand(command);
    if (requiresConfirmation) {
      setConfirmDialogOpen(true);
    } else {
      handleExecuteCommand(command);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading configuration...</p>
        </div>
      </div>
    );
  }

  // Default cron jobs if not available from API
  const defaultCrons = [
    { name: 'notification-processing', description: 'Process pending notifications', schedule: 'Every minute', enabled: true },
    { name: 'daily-morning-notifications', description: 'Send morning notifications', schedule: 'Every day at 9 AM', enabled: true },
    { name: 'daily-evening-notifications', description: 'Send evening notifications', schedule: 'Every day at 6 PM', enabled: true },
    { name: 'redis-health-check', description: 'Redis health monitoring', schedule: 'Every 30 seconds', enabled: true },
    { name: 'redis-analytics', description: 'Analytics aggregation', schedule: 'Every minute', enabled: true },
  ];

  const cronJobs = crons.length > 0 ? crons : defaultCrons;

  const criticalCommands = [
    { name: 'clear-cache', label: 'Clear Redis Cache', description: 'Clear all cached data', requiresConfirmation: true },
    { name: 'refresh-stats', label: 'Refresh System Stats', description: 'Recalculate system statistics', requiresConfirmation: false },
    { name: 'regenerate-keys', label: 'Regenerate API Keys', description: 'Generate new API keys for all services', requiresConfirmation: true },
    { name: 'clear-logs', label: 'Clear Old Logs', description: 'Remove logs older than 30 days', requiresConfirmation: true },
    { name: 'backup-db', label: 'Backup Database', description: 'Create a backup of the database', requiresConfirmation: false },
    { name: 'reset-ratings', label: 'Reset Partner Ratings', description: 'Reset all partner ratings to default', requiresConfirmation: true },
    { name: 'recalculate-revenue', label: 'Recalculate Revenue Stats', description: 'Recalculate all revenue statistics', requiresConfirmation: false },
  ];

  return (
    <div className="space-y-6" data-testid="configuration-page">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Configuration</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage system settings, features, and critical operations</p>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="crons">Cron Jobs</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="commands">Critical Commands</TabsTrigger>
        </TabsList>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payments</Label>
                  <p className="text-sm text-gray-500">Enable payment processing system</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.payments !== false}
                  onCheckedChange={(checked) => handleToggleFeature('payments', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Referrals</Label>
                  <p className="text-sm text-gray-500">Enable referral program</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.referrals !== false}
                  onCheckedChange={(checked) => handleToggleFeature('referrals', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Subscriptions</Label>
                  <p className="text-sm text-gray-500">Enable subscription plans</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.subscriptions !== false}
                  onCheckedChange={(checked) => handleToggleFeature('subscriptions', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <p className="text-sm text-gray-500">Enable notification system</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.notifications !== false}
                  onCheckedChange={(checked) => handleToggleFeature('notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chat Support</Label>
                  <p className="text-sm text-gray-500">Enable chat support feature</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.chatSupport !== false}
                  onCheckedChange={(checked) => handleToggleFeature('chatSupport', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reviews & Ratings</Label>
                  <p className="text-sm text-gray-500">Enable reviews and ratings system</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.reviews !== false}
                  onCheckedChange={(checked) => handleToggleFeature('reviews', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Enable email notification system</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.emailNotifications !== false}
                  onCheckedChange={(checked) => handleToggleFeature('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-500">Enable push notifications</p>
                </div>
                <Switch
                  checked={systemConfig?.features?.pushNotifications !== false}
                  onCheckedChange={(checked) => handleToggleFeature('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cron Jobs Tab */}
        <TabsContent value="crons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cron Jobs Management</CardTitle>
              <CardDescription>Manage scheduled tasks and automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cronJobs.map((cron) => (
                  <div key={cron.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{cron.description || cron.name}</h3>
                        <Badge variant={cron.enabled ? 'default' : 'secondary'}>
                          {cron.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{cron.schedule || 'Schedule not available'}</p>
                      {cron.lastRun && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last run: {new Date(cron.lastRun).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cron.enabled !== false}
                        onCheckedChange={(checked) => handleToggleCron(cron.name, checked)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTriggerCron(cron.name)}
                        disabled={executing === `cron-${cron.name}`}
                      >
                        {executing === `cron-${cron.name}` ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={systemConfig?.platformName || 'TiffinWale'}
                    onChange={(e) => setSystemConfig({ ...systemConfig, platformName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={systemConfig?.commissionRate || 20}
                    onChange={(e) => setSystemConfig({ ...systemConfig, commissionRate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={systemConfig?.minOrderAmount || 100}
                    onChange={(e) => setSystemConfig({ ...systemConfig, minOrderAmount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={systemConfig?.deliveryFee || 0}
                    onChange={(e) => setSystemConfig({ ...systemConfig, deliveryFee: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={systemConfig?.currency || 'INR'}
                    onChange={(e) => setSystemConfig({ ...systemConfig, currency: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
                </div>
                <Switch
                  checked={systemConfig?.maintenanceMode || false}
                  onCheckedChange={(checked) => handleUpdateConfig({ maintenanceMode: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-gray-500">Enable debug logging</p>
                </div>
                <Switch
                  checked={systemConfig?.debugMode || false}
                  onCheckedChange={(checked) => handleUpdateConfig({ debugMode: checked })}
                />
              </div>
              <Button onClick={() => handleUpdateConfig(systemConfig)} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Commands Tab */}
        <TabsContent value="commands" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Critical Commands</CardTitle>
              <CardDescription>Execute system maintenance and administrative commands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalCommands.map((command) => (
                  <Card key={command.name} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{command.label}</h3>
                          <p className="text-sm text-gray-500">{command.description}</p>
                        </div>
                        {command.requiresConfirmation && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <Button
                        variant={command.requiresConfirmation ? 'destructive' : 'default'}
                        className="w-full"
                        onClick={() => handleCommandClick(command.name, command.requiresConfirmation)}
                        disabled={executing === `command-${command.name}`}
                      >
                        {executing === `command-${command.name}` ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" />
                            Execute
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Command Execution</DialogTitle>
            <DialogDescription>
              Are you sure you want to execute this command? This action may have significant impact on the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConfirmDialogOpen(false); setSelectedCommand(null); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCommand && handleExecuteCommand(selectedCommand)}
              disabled={executing === `command-${selectedCommand}`}
            >
              {executing === `command-${selectedCommand}` ? 'Executing...' : 'Execute Command'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

