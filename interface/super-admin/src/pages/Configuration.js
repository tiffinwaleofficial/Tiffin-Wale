import { useEffect, useState, useRef } from 'react';
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
import CollectionViewerModal from '@/components/CollectionViewerModal';

export default function Configuration() {
  const [systemConfig, setSystemConfig] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [dbStats, setDbStats] = useState([]);
  const [crons, setCrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [cleanTarget, setCleanTarget] = useState(null); // 'all' or collection name
  const [reportType, setReportType] = useState('customer-financial');
  const [reportAction, setReportAction] = useState('preview');
  const [generating, setGenerating] = useState(false);
  const [collectionViewerOpen, setCollectionViewerOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchConfigurationData();
      hasLoadedRef.current = true;
    }
  }, []);

  const fetchConfigurationData = async () => {
    setLoading(true);
    try {
      const [configRes, statsRes, cronsRes, dbStatsRes] = await Promise.all([
        apiClient.get('/super-admin/system/config'),
        apiClient.get('/super-admin/system/stats').catch(() => ({ data: null })),
        apiClient.get('/super-admin/system/crons').catch(() => ({ data: [] })),
        apiClient.get('/super-admin/system/db-stats').catch(() => ({ data: [] })),
      ]);
      setSystemConfig(configRes.data);
      setSystemStats(statsRes.data);
      // Handle both array and object responses
      const cronsData = Array.isArray(cronsRes.data) ? cronsRes.data : (cronsRes.data?.data || []);
      setCrons(cronsData);
      setDbStats(dbStatsRes.data || []);
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
      // Silently refresh config without showing loading state
      const configRes = await apiClient.get('/super-admin/system/config');
      setSystemConfig(configRes.data);
    } catch (error) {
      console.error('Config update error:', error);
      toast.error('Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeature = async (feature, enabled) => {
    // Store previous state for revert (deep copy) - only if config exists
    const previousConfig = systemConfig ? JSON.parse(JSON.stringify(systemConfig)) : null;

    // Optimistically update local state
    const updatedConfig = {
      ...systemConfig,
      features: {
        ...(systemConfig?.features || {}),
        [feature]: enabled,
      },
    };
    setSystemConfig(updatedConfig);

    // Update via API
    const updates = {
      features: {
        ...(systemConfig?.features || {}),
        [feature]: enabled,
      },
    };

    try {
      await apiClient.patch('/super-admin/system/config', updates);
      toast.success(`Feature ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Feature toggle error:', error);
      toast.error('Failed to update feature');
      // Revert on error - silently refresh to get correct state
      try {
        const configRes = await apiClient.get('/super-admin/system/config');
        setSystemConfig(configRes.data);
      } catch (refreshError) {
        // If refresh fails, revert to previous
        if (previousConfig) {
          setSystemConfig(previousConfig);
        }
      }
    }
  };

  const handleToggleCron = async (cronName, enabled) => {
    // Optimistically update local state
    setCrons(crons.map(cron =>
      cron.name === cronName ? { ...cron, enabled } : cron
    ));

    try {
      await apiClient.patch(`/super-admin/system/crons/${cronName}/status`, { enabled });
      toast.success(`Cron job ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Cron toggle error:', error);
      toast.error('Failed to update cron job status');
      // Revert on error - refetch to get correct state
      const cronsRes = await apiClient.get('/super-admin/system/crons').catch(() => ({ data: [] }));
      const cronsData = Array.isArray(cronsRes.data) ? cronsRes.data : (cronsRes.data?.data || []);
      setCrons(cronsData);
    }
  };

  const handleTriggerCron = async (cronName) => {
    setExecuting(`cron-${cronName}`);
    try {
      await apiClient.post(`/super-admin/system/crons/${cronName}/trigger`);
      toast.success('Cron job triggered successfully');
      // Silently refresh cron data without showing loading state
      const cronsRes = await apiClient.get('/super-admin/system/crons').catch(() => ({ data: [] }));
      const cronsData = Array.isArray(cronsRes.data) ? cronsRes.data : (cronsRes.data?.data || []);
      setCrons(cronsData);
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
      // Silently refresh stats if needed, without showing loading state
      const statsRes = await apiClient.get('/super-admin/system/stats').catch(() => ({ data: null }));
      setSystemStats(statsRes.data);
    } catch (error) {
      console.error('Command execution error:', error);
      toast.error(error.response?.data?.message || 'Failed to execute command');
    } finally {
      setExecuting(null);
      setConfirmDialogOpen(false);
      setSelectedCommand(null);
    }
  };

  const handleCleanDatabase = async (target) => {
    setExecuting(`clean-${target}`);
    try {
      await apiClient.post('/super-admin/system/commands/clean-db', { target });
      toast.success(target === 'all' ? 'Entire database cleaned successfully' : `Collection ${target} cleaned successfully`);
      // Refresh stats
      const dbStatsRes = await apiClient.get('/super-admin/system/db-stats').catch(() => ({ data: [] }));
      setDbStats(dbStatsRes.data || []);
    } catch (error) {
      console.error('Database cleanup error:', error);
      toast.error('Failed to clean database');
    } finally {
      setExecuting(null);
      setConfirmDialogOpen(false);
      setCleanTarget(null);
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

  const handleCleanClick = (target) => {
    setCleanTarget(target);
    setConfirmDialogOpen(true);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await apiClient.post('/super-admin/reports/generate', {
        reportType,
        action: reportAction,
        email: reportAction === 'email' ? prompt('Enter your email address:') : undefined,
      }, {
        responseType: reportAction !== 'email' ? 'blob' : 'json',
      });

      if (reportAction === 'email') {
        toast.success('Report sent to email successfully!');
      } else {
        // Create blob and download/preview
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        if (reportAction === 'preview') {
          // Open in new tab
          window.open(url, '_blank');
          toast.success('Report opened in new tab');
        } else {
          // Download
          const link = document.createElement('a');
          link.href = url;
          link.download = `${reportType}_report.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success('Report downloaded successfully');
        }
      }
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  // Only show loading on initial load when we have no data
  if (loading && systemConfig === null && crons.length === 0) {
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
        <TabsList className="flex flex-col h-auto md:grid md:w-full md:grid-cols-6 gap-2 md:gap-0">
          <TabsTrigger value="features" className="w-full">Feature Flags</TabsTrigger>
          <TabsTrigger value="crons" className="w-full">Cron Jobs</TabsTrigger>
          <TabsTrigger value="system" className="w-full">System Config</TabsTrigger>
          <TabsTrigger value="commands" className="w-full">Critical Commands</TabsTrigger>
          <TabsTrigger value="database" className="w-full">Database</TabsTrigger>
          <TabsTrigger value="reports" className="w-full">Reports</TabsTrigger>
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
                  onCheckedChange={async (checked) => {
                    // Optimistically update
                    setSystemConfig({ ...systemConfig, maintenanceMode: checked });
                    try {
                      await apiClient.patch('/super-admin/system/config', { maintenanceMode: checked });
                      toast.success(`Maintenance mode ${checked ? 'enabled' : 'disabled'}`);
                      // Silently refresh
                      const configRes = await apiClient.get('/super-admin/system/config');
                      setSystemConfig(configRes.data);
                    } catch (error) {
                      console.error('Maintenance mode toggle error:', error);
                      toast.error('Failed to update maintenance mode');
                      // Revert
                      const configRes = await apiClient.get('/super-admin/system/config');
                      setSystemConfig(configRes.data);
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-gray-500">Enable debug logging</p>
                </div>
                <Switch
                  checked={systemConfig?.debugMode || false}
                  onCheckedChange={async (checked) => {
                    // Optimistically update
                    setSystemConfig({ ...systemConfig, debugMode: checked });
                    try {
                      await apiClient.patch('/super-admin/system/config', { debugMode: checked });
                      toast.success(`Debug mode ${checked ? 'enabled' : 'disabled'}`);
                      // Silently refresh
                      const configRes = await apiClient.get('/super-admin/system/config');
                      setSystemConfig(configRes.data);
                    } catch (error) {
                      console.error('Debug mode toggle error:', error);
                      toast.error('Failed to update debug mode');
                      // Revert
                      const configRes = await apiClient.get('/super-admin/system/config');
                      setSystemConfig(configRes.data);
                    }
                  }}
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

        {/* Database Management Tab */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>Manage database collections and cleanup operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-300">Danger Zone</h3>
                    <p className="text-sm text-red-700 dark:text-red-400">Irreversible actions that affect the entire database</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleCleanClick('all')}
                  disabled={executing === 'clean-all'}
                >
                  {executing === 'clean-all' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clean Entire Database
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Collections</h3>
                <div className="grid grid-cols-1 gap-4">
                  {dbStats.map((collection) => (
                    <div
                      key={collection.name}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedCollection(collection.name);
                        setCollectionViewerOpen(true);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{collection.name}</h4>
                          <p className="text-sm text-gray-500">{collection.count} documents</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCollection(collection.name);
                            setCollectionViewerOpen(true);
                          }}
                        >
                          <Database className="w-4 h-4 mr-2" />
                          View Data
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCleanClick(collection.name);
                          }}
                          disabled={executing === `clean-${collection.name}`}
                        >
                          {executing === `clean-${collection.name}` ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Clean
                        </Button>
                      </div>
                    </div>
                  ))}
                  {dbStats.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No collections found or failed to load stats
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation</CardTitle>
              <CardDescription>Generate, preview, and email PDF reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selector */}
              <div className="space-y-2">
                <Label htmlFor="reportType">Select Report Type</Label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="customer-financial">Customer Financial Report</option>
                  <option value="partner-financial">Partner Financial Report</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Label>Choose Action</Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      setReportAction('preview');
                      handleGenerateReport();
                    }}
                    disabled={generating}
                    variant="outline"
                  >
                    {generating && reportAction === 'preview' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4 mr-2" />
                    )}
                    Preview
                  </Button>

                  <Button
                    onClick={() => {
                      setReportAction('email');
                      handleGenerateReport();
                    }}
                    disabled={generating}
                    variant="outline"
                  >
                    {generating && reportAction === 'email' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    )}
                    Email Me
                  </Button>

                  <Button
                    onClick={() => {
                      setReportAction('download');
                      handleGenerateReport();
                    }}
                    disabled={generating}
                  >
                    {generating && reportAction === 'download' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Download
                  </Button>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Report Generation Tips:
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                      <li><strong>Preview:</strong> Opens the PDF in a new browser tab</li>
                      <li><strong>Email Me:</strong> Sends the report to your email address</li>
                      <li><strong>Download:</strong> Downloads the PDF file directly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cleanTarget ? 'Confirm Database Cleanup' : 'Confirm Command Execution'}
            </DialogTitle>
            <DialogDescription>
              {cleanTarget ? (
                <div className="space-y-2">
                  <p className="font-semibold text-red-600">Warning: This action is irreversible!</p>
                  <p>
                    Are you sure you want to clean {cleanTarget === 'all' ? 'the ENTIRE database' : `the "${cleanTarget}" collection`}?
                    All data will be permanently deleted.
                  </p>
                </div>
              ) : (
                'Are you sure you want to execute this command? This action may have significant impact on the system.'
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConfirmDialogOpen(false); setSelectedCommand(null); setCleanTarget(null); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (cleanTarget) {
                  handleCleanDatabase(cleanTarget);
                } else if (selectedCommand) {
                  handleExecuteCommand(selectedCommand);
                }
              }}
              disabled={executing !== null}
            >
              {executing !== null ? 'Processing...' : (cleanTarget ? 'Yes, Clean It' : 'Execute Command')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Viewer Modal */}
      <CollectionViewerModal
        open={collectionViewerOpen}
        onOpenChange={(open) => {
          setCollectionViewerOpen(open);
          if (!open) {
            // Refresh collection stats when modal closes
            fetchConfigurationData();
          }
        }}
        collectionName={selectedCollection}
      />
    </div>
  );
}

