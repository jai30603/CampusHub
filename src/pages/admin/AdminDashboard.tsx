import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import {
  Users,
  Package,
  CheckCircle,
  FileText,
  AlertTriangle,
  FolderOpen,
  Activity,
  Settings,
  ShieldCheck,
  Search,
  Lock,
  PlusCircle,
  FolderPlus,
  Trash2,
  Undo,
  BarChart2,
  Download,
  TrendingUp,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Navigation state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'listings' | 'categories' | 'reports' | 'activity' | 'settings' | 'analytics'>('dashboard');

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [listingAnalytics, setListingAnalytics] = useState<any>(null);
  const [reservationAnalytics, setReservationAnalytics] = useState<any>(null);
  const [reviewAnalytics, setReviewAnalytics] = useState<any>(null);
  const [reportAnalytics, setReportAnalytics] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState<string>('30d');

  // Backend state payloads
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [listingsList, setListingsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [activitiesList, setActivitiesList] = useState<any[]>([]);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('tag');

  // Loading and search states
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch functions
  const fetchDashboardData = async () => {
    try {
      const res = await apiRequest('/admin/dashboard');
      if (res.success) setDashboardData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiRequest('/admin/users');
      if (res.success) setUsersList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await apiRequest('/admin/listings');
      if (res.success) setListingsList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiRequest('/categories');
      if (res.success) setCategoriesList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await apiRequest('/admin/reports');
      if (res.success) setReportsList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await apiRequest('/admin/activity');
      if (res.success) setActivitiesList(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [summary, users, listings, reservations, reviews, reports] = await Promise.all([
        apiRequest('/admin/analytics'),
        apiRequest('/admin/analytics/users'),
        apiRequest('/admin/analytics/listings'),
        apiRequest('/admin/analytics/reservations'),
        apiRequest('/admin/analytics/reviews'),
        apiRequest('/admin/analytics/reports'),
      ]);
      if (summary.success) setAnalyticsData(summary.data);
      if (users.success) setUserAnalytics(users.data);
      if (listings.success) setListingAnalytics(listings.data);
      if (reservations.success) setReservationAnalytics(reservations.data);
      if (reviews.success) setReviewAnalytics(reviews.data);
      if (reports.success) setReportAnalytics(reports.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = async (type: string) => {
    try {
      const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1';
      const token = localStorage.getItem('campushub_token');
      const response = await fetch(`${BASE_URL}/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    }
  };

  const syncData = async () => {
    setIsLoading(true);
    if (activeTab === 'dashboard') await fetchDashboardData();
    else if (activeTab === 'users') await fetchUsers();
    else if (activeTab === 'listings') await fetchListings();
    else if (activeTab === 'categories') await fetchCategories();
    else if (activeTab === 'reports') await fetchReports();
    else if (activeTab === 'activity') await fetchActivities();
    else if (activeTab === 'analytics') await fetchAnalytics();
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) syncData();
  }, [activeTab, isAdmin]);

  // Actions
  const handleUpdateUserStatus = async (userId: number, currentVerification: boolean) => {
    setActioningId(userId);
    try {
      const res = await apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ is_verified: !currentVerification }),
      });
      if (res.success) {
        alert('User status updated!');
        fetchUsers();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleUpdateListingStatus = async (listingId: number, targetStatus: string) => {
    setActioningId(listingId);
    try {
      const res = await apiRequest(`/admin/listings/${listingId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.success) {
        alert(`Listing updated to ${targetStatus}.`);
        fetchListings();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await apiRequest('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCatName.trim(), icon: newCatIcon }),
      });
      if (res.success) {
        alert('Category created successfully!');
        setNewCatName('');
        fetchCategories();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResolveReport = async (reportId: number, targetStatus: string) => {
    setActioningId(reportId);
    try {
      const res = await apiRequest(`/admin/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.success) {
        alert(`Report marked as ${targetStatus}.`);
        fetchReports();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  // Guard Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">403 Forbidden</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          Access denied. Only system administrators can view the CampusHub administration portal.
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-1 border-r border-border/80 pr-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <Activity className="w-4 h-4" /> Overview Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <Users className="w-4 h-4" /> User Accounts
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'listings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <Package className="w-4 h-4" /> Listings Audit
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'categories' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <FolderOpen className="w-4 h-4" /> Category Manager
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Moderation Reports
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'activity' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <FileText className="w-4 h-4" /> Admin Audit Logs
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <Settings className="w-4 h-4" /> Platform Settings
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-left flex items-center gap-2.5 transition-colors ${
            activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/60'
          }`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics & Reports
        </button>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        <PageHeader
          title={
            activeTab === 'dashboard'
              ? 'Control Dashboard'
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          }
          description="Centralized administration center for managing marketplace moderation and student directory"
        />

        {isLoading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" label="Synchronizing platform records..." />
          </div>
        ) : (
          <>
            {/* Overview Dashboard Tab */}
            {activeTab === 'dashboard' && dashboardData && (
              <div className="space-y-6">
                {/* KPI Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase">Total Users</span>
                      <span className="text-xl font-extrabold">{dashboardData.kpis?.total_users}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase">Active Listings</span>
                      <span className="text-xl font-extrabold text-primary">{dashboardData.kpis?.active_listings}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase">Completed Deals</span>
                      <span className="text-xl font-extrabold text-emerald-500">{dashboardData.kpis?.completed_deals}</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground block uppercase">Open Reports</span>
                      <span className="text-xl font-extrabold text-danger">{dashboardData.kpis?.total_reports}</span>
                    </CardContent>
                  </Card>
                </div>

                {/* Health Check Checklist Section */}
                <Card className="p-4 border-border/80">
                  <CardHeader className="p-0 pb-2 border-b border-border/50">
                    <CardTitle className="text-xs font-extrabold">System & Node Health Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-[10px] font-medium text-foreground">
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Database Status</span>
                      <span className="text-emerald-500 font-bold">✅ Deployed & Connected</span>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Backend API</span>
                      <span className="text-emerald-500 font-bold">✅ Node Online</span>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Frontend Version</span>
                      <span className="text-primary font-bold">v1.0.0</span>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Daily Actives</span>
                      <span className="font-bold">{dashboardData.health?.active_users_today} students</span>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Unresolved Alerts</span>
                      <span className="text-danger font-bold">{dashboardData.health?.open_reports} pending</span>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/40">
                      <span className="text-[9px] text-muted-foreground block uppercase">Storage Usage</span>
                      <span className="font-bold">{dashboardData.health?.storage_usage}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Ledger Tab */}
            {activeTab === 'users' && (
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Input
                    placeholder="Search name, college, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
                    className="h-9 max-w-xs text-xs"
                  />
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-accent/45 border-b border-border text-muted-foreground font-bold">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">College</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Verification</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {usersList
                        .filter((u) => {
                          const q = searchQuery.toLowerCase();
                          return u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
                        })
                        .map((u) => (
                          <tr key={u.id}>
                            <td className="p-3 font-bold">{u.full_name}</td>
                            <td className="p-3 text-muted-foreground">{u.email}</td>
                            <td className="p-3 truncate max-w-[120px]">{u.college || 'IIT Bombay'}</td>
                            <td className="p-3 uppercase font-semibold text-[10px]">{u.role}</td>
                            <td className="p-3">
                              <Badge variant={u.is_verified ? 'secondary' : 'outline'} className={u.is_verified ? 'bg-emerald-500/10 text-emerald-500' : ''}>
                                {u.is_verified ? 'Verified Student' : 'Unverified'}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                disabled={actioningId === u.id}
                                onClick={() => handleUpdateUserStatus(u.id, u.is_verified)}
                              >
                                Toggle Verification
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Listings Audit Tab */}
            {activeTab === 'listings' && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-accent/45 border-b border-border text-muted-foreground font-bold">
                      <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Seller</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {listingsList.map((l) => (
                        <tr key={l.id}>
                          <td className="p-3 font-bold truncate max-w-[150px]">{l.title}</td>
                          <td className="p-3 text-muted-foreground">{l.seller?.full_name || 'Student'}</td>
                          <td className="p-3 font-bold text-primary">₹{l.price?.toLocaleString('en-IN')}</td>
                          <td className="p-3 uppercase text-[10px]">{l.status}</td>
                          <td className="p-3 text-right space-x-1">
                            {l.status !== 'archived' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-danger"
                                disabled={actioningId === l.id}
                                onClick={() => handleUpdateListingStatus(l.id, 'archived')}
                              >
                                Archive Item
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={actioningId === l.id}
                                onClick={() => handleUpdateListingStatus(l.id, 'active')}
                              >
                                Restore
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Category Manager Tab */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <Card className="md:col-span-2 overflow-hidden">
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-accent/45 border-b border-border text-muted-foreground font-bold">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Slug</th>
                          <th className="p-3">Icon</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {categoriesList.map((c) => (
                          <tr key={c.id}>
                            <td className="p-3 font-bold">{c.name}</td>
                            <td className="p-3 text-muted-foreground">{c.slug}</td>
                            <td className="p-3">{c.icon || 'tag'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-4 space-y-4">
                  <CardHeader className="p-0 pb-2 border-b border-border">
                    <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                      <FolderPlus className="w-4 h-4 text-primary" /> Create New Category
                    </CardTitle>
                  </CardHeader>
                  <form onSubmit={handleCreateCategory} className="space-y-3 pt-2 text-xs">
                    <div className="space-y-1">
                      <label className="block font-medium">Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lab Equipment"
                        className="w-full p-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-medium">Lucide Icon Name</label>
                      <input
                        type="text"
                        placeholder="tag"
                        className="w-full p-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="primary" className="w-full text-xs">
                      Submit Category
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {/* Moderation Reports Tab */}
            {activeTab === 'reports' && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-accent/45 border-b border-border text-muted-foreground font-bold">
                      <tr>
                        <th className="p-3">Reported Item</th>
                        <th className="p-3">Reporter</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {reportsList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            All clear! No moderation reports submitted.
                          </td>
                        </tr>
                      ) : (
                        reportsList.map((r) => (
                          <tr key={r.id}>
                            <td className="p-3 font-bold truncate max-w-[150px]">
                              {r.listing?.title || 'User Profile'}
                            </td>
                            <td className="p-3 text-muted-foreground">{r.reporter?.full_name}</td>
                            <td className="p-3 font-semibold text-danger">{r.reason}</td>
                            <td className="p-3 uppercase font-bold text-[10px]">{r.status}</td>
                            <td className="p-3 text-right space-x-1">
                              {r.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-danger"
                                    disabled={actioningId === r.id}
                                    onClick={() => handleResolveReport(r.id, 'resolved')}
                                  >
                                    Resolve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={actioningId === r.id}
                                    onClick={() => handleResolveReport(r.id, 'dismissed')}
                                  >
                                    Dismiss
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Admin Audit Logs Tab */}
            {activeTab === 'activity' && (
              <Card className="p-4 space-y-4">
                <CardHeader className="p-0 pb-2 border-b border-border/80">
                  <CardTitle className="text-xs font-bold">Security & Activity Audit Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-2 space-y-3">
                  {activitiesList.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center">
                      No administrative logs registered yet.
                    </p>
                  ) : (
                    activitiesList.map((act) => (
                      <div key={act.id} className="flex items-center justify-between text-xs py-2 border-b border-border last:border-0">
                        <span className="font-semibold text-foreground">{act.action}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {new Date(act.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Platform Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Platform Settings Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-2 border-b border-border/85 pb-4">
                    <label className="block font-bold">Marketplace Name</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-background border border-input rounded-xl"
                      value="CampusHub Marketplace"
                      disabled
                    />
                  </div>
                  <div className="space-y-2 border-b border-border/85 pb-4">
                    <label className="block font-bold">Supported Colleges</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-background border border-input rounded-xl"
                      value="IIT Bombay, NIT Trichy, BITS Pilani, Delhi University, IIT Madras"
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-bold">Max Images per Listing</label>
                      <input
                        type="number"
                        className="w-full p-2.5 bg-background border border-input rounded-xl"
                        value="5"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-bold">Max Description Length</label>
                      <input
                        type="number"
                        className="w-full p-2.5 bg-background border border-input rounded-xl"
                        value="1000"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analytics & Reports Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Date Range Quick Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-muted-foreground">Date Range:</span>
                  {['7d', '30d', '90d', '1y', 'all'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setDateFilter(range)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors border ${
                        dateFilter === range
                          ? 'bg-primary/10 text-primary border-primary/30'
                          : 'text-muted-foreground border-border hover:bg-accent/40'
                      }`}
                    >
                      {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : range === '90d' ? 'Last 90 Days' : range === '1y' ? 'Last Year' : 'All Time'}
                    </button>
                  ))}
                </div>

                {/* Export CSV Buttons */}
                <Card className="p-4">
                  <CardHeader className="p-0 pb-3 border-b border-border/70">
                    <CardTitle className="text-xs font-bold flex items-center gap-2">
                      <Download className="w-4 h-4 text-primary" /> Export Data Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-3 flex flex-wrap gap-2">
                    {['users', 'listings', 'reservations', 'reviews'].map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => handleExportCSV(type)}
                      >
                        Export {type.charAt(0).toUpperCase() + type.slice(1)} CSV
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* KPI Summary Grid */}
                {analyticsData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Users', value: analyticsData.total_users, color: 'text-primary' },
                      { label: 'New This Month', value: analyticsData.new_users_this_month, color: 'text-blue-500' },
                      { label: 'Completed Deals', value: analyticsData.completed_deals, color: 'text-emerald-500' },
                      { label: 'Total Reviews', value: analyticsData.total_reviews, color: 'text-amber-500' },
                      { label: 'Active Listings', value: analyticsData.active_listings, color: 'text-violet-500' },
                      { label: 'Reservations', value: analyticsData.total_reservations, color: 'text-cyan-500' },
                      { label: 'Open Reports', value: analyticsData.total_reports, color: 'text-danger' },
                      { label: 'Categories', value: analyticsData.total_categories, color: 'text-foreground' },
                    ].map((kpi) => (
                      <Card key={kpi.label}>
                        <CardContent className="p-3 space-y-0.5">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase block">{kpi.label}</span>
                          <span className={`text-xl font-extrabold ${kpi.color}`}>{kpi.value}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registration Timeline Chart */}
                  {userAnalytics?.registration_timeline && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-primary" /> User Registrations (Last 7 Days)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <div className="flex items-end gap-1 h-28">
                          {userAnalytics.registration_timeline.map((day: any, i: number) => {
                            const max = Math.max(...userAnalytics.registration_timeline.map((d: any) => d.registrations), 1);
                            const pct = max > 0 ? (day.registrations / max) * 100 : 0;
                            return (
                              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                <span className="text-[9px] text-muted-foreground">{day.registrations}</span>
                                <div
                                  className="w-full bg-primary/80 rounded-t-sm transition-all"
                                  style={{ height: `${Math.max(pct, 4)}%` }}
                                />
                                <span className="text-[8px] text-muted-foreground mt-1">
                                  {day.date.slice(5)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* College Distribution */}
                  {userAnalytics?.college_distribution && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-blue-500" /> Student College Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2 space-y-2">
                        {Object.entries(userAnalytics.college_distribution).slice(0, 5).map(([college, count]: [string, any]) => {
                          const total = (Object.values(userAnalytics.college_distribution) as number[]).reduce((s, v) => s + v, 0);
                          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                          return (
                            <div key={college} className="flex items-center gap-2 text-[10px]">
                              <span className="w-24 truncate text-muted-foreground shrink-0">{college}</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="font-bold w-6 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* Listings by Category */}
                  {listingAnalytics?.category_distribution && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-violet-500" /> Listings by Category
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2 space-y-2">
                        {Object.entries(listingAnalytics.category_distribution).slice(0, 6).map(([cat, count]: [string, any]) => {
                          const max = Math.max(...(Object.values(listingAnalytics.category_distribution) as number[]), 1);
                          const pct = max > 0 ? Math.round((count / max) * 100) : 0;
                          return (
                            <div key={cat} className="flex items-center gap-2 text-[10px]">
                              <span className="w-24 truncate text-muted-foreground shrink-0">{cat}</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="font-bold w-6 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* Reservation Conversion Funnel */}
                  {reservationAnalytics && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Reservation Conversion Funnel
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2 space-y-3">
                        <div className="text-center py-2">
                          <span className="text-3xl font-extrabold text-emerald-500">{reservationAnalytics.conversion_rate}%</span>
                          <p className="text-[10px] text-muted-foreground mt-1">Pending → Completed rate</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                          {Object.entries(reservationAnalytics.status_counts || {}).map(([key, val]: [string, any]) => (
                            <div key={key} className="p-2 rounded-lg bg-accent/40 space-y-0.5">
                              <span className="block font-extrabold text-base">{val}</span>
                              <span className="text-muted-foreground capitalize">{key}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Review Star Distribution */}
                  {reviewAnalytics && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500" /> Platform Rating Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2 space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-3xl font-extrabold">{reviewAnalytics.average_rating}</span>
                          <div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(reviewAnalytics.average_rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{reviewAnalytics.total_reviews} reviews total</span>
                          </div>
                        </div>
                        {[5,4,3,2,1].map((star) => {
                          const count = reviewAnalytics.rating_distribution?.[star] || 0;
                          const pct = reviewAnalytics.total_reviews > 0 ? Math.round((count / reviewAnalytics.total_reviews) * 100) : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-[10px]">
                              <span className="w-4 font-bold">{star}</span>
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-6 text-right font-bold">{count}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}

                  {/* Report Status Overview */}
                  {reportAnalytics && (
                    <Card className="p-4">
                      <CardHeader className="p-0 pb-3">
                        <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-danger" /> Moderation Reports Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 pt-2">
                        <div className="grid grid-cols-3 gap-3 text-center text-[10px]">
                          <div className="p-3 rounded-xl bg-amber-500/10 space-y-1">
                            <span className="text-2xl font-extrabold text-amber-500">{reportAnalytics.pending}</span>
                            <p className="text-muted-foreground">Pending</p>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/10 space-y-1">
                            <span className="text-2xl font-extrabold text-emerald-500">{reportAnalytics.resolved}</span>
                            <p className="text-muted-foreground">Resolved</p>
                          </div>
                          <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                            <span className="text-2xl font-extrabold text-foreground">{reportAnalytics.dismissed}</span>
                            <p className="text-muted-foreground">Dismissed</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
