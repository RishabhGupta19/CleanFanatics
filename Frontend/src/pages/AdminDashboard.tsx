


import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { getBookings, getDashboardStats, getBookingEvents, adminOverrideStatus, retryBooking, getAvailableProviders, assignProvider } from "@/api/api";
import { Booking, BookingStatus, DashboardStats, BookingEvent, Provider } from "@/types/booking";
import { Sparkles, Shield, LogOut, Search, RefreshCw, Users, Calendar, DollarSign, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "bg-warning/10 text-warning",
  [BookingStatus.ASSIGNED]: "bg-info/10 text-info",
  [BookingStatus.IN_PROGRESS]: "bg-primary/10 text-primary",
  [BookingStatus.COMPLETED]: "bg-success/10 text-success",
  [BookingStatus.CANCELLED]: "bg-muted text-muted-foreground",
  [BookingStatus.REJECTED]: "bg-destructive/10 text-destructive",
  [BookingStatus.PROVIDER_NO_SHOW]: "bg-destructive/10 text-destructive",
  [BookingStatus.RE_ASSIGNED]: "bg-info/10 text-info",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
 const { user, logout, isAuthenticated, hydrated } = useApp();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [events, setEvents] = useState<BookingEvent[]>([]);

  useEffect(() => {
    if (!hydrated) return ; // or spinner

if (!isAuthenticated) {
  navigate("/login");
  return ;
}

    loadData();
  }, [isAuthenticated, hydrated]);

  const loadData = async () => {
    try {
      const [bookingsRes, statsRes, providersRes] = await Promise.all([
        getBookings(),
        getDashboardStats(),
        getAvailableProviders(),
      ]);
      setBookings(bookingsRes.data);
      setStats(statsRes);
      setProviders(providersRes);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (bookingId: string) => {
    try {
      const eventsRes = await getBookingEvents(bookingId);
      setEvents(eventsRes);
    } catch (error) {
      console.error("Failed to load events");
    }
  };

  const handleOverride = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await adminOverrideStatus(bookingId, newStatus, "Admin override");
      toast({ title: "Updated", description: `Status changed to ${newStatus}` });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleRetry = async (bookingId: string) => {
    try {
      await retryBooking(bookingId);
      toast({ title: "Retried", description: "Booking re-assigned" });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to retry booking", variant: "destructive" });
    }
  };

  const handleAssign = async (bookingId: string, providerId: string) => {
    try {
      await assignProvider({ bookingId, providerId });
      toast({ title: "Assigned", description: "Provider assigned successfully" });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to assign provider", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const needsAttention = bookings.filter(b => [BookingStatus.REJECTED, BookingStatus.PROVIDER_NO_SHOW].includes(b.status));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Clean Fanatics</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{user?.name || "Admin"}</span>
              <Badge className="bg-destructive/10 text-destructive">Admin</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Monitor and manage all bookings</p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Calendar className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold">{stats.totalBookings}</p><p className="text-xs text-muted-foreground">Total Bookings</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10"><Users className="w-5 h-5 text-success" /></div>
              <div><p className="text-2xl font-bold">{stats.activeProviders}</p><p className="text-xs text-muted-foreground">Active Providers</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10"><DollarSign className="w-5 h-5 text-info" /></div>
              <div><p className="text-2xl font-bold">${(stats.totalRevenue / 100).toFixed(0)}</p><p className="text-xs text-muted-foreground">Revenue</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10"><AlertTriangle className="w-5 h-5 text-warning" /></div>
              <div><p className="text-2xl font-bold">{stats.requiresAttention}</p><p className="text-xs text-muted-foreground">Needs Attention</p></div>
            </CardContent></Card>
          </div>
        )}

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="attention">Needs Attention ({needsAttention.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.values(BookingStatus).map(status => (
                    <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
                      <TableCell>{booking.customer?.name || "N/A"}</TableCell>
                      <TableCell>
                          {booking.serviceType?.name || booking.serviceTypeId?.replace("-", " ").toUpperCase() || "N/A"}
                        </TableCell>
                      <TableCell>{new Date(booking.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell><Badge className={statusColors[booking.status]}>{booking.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell>{booking.provider?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedBooking(booking); loadEvents(booking.id); }}>View</Button>
                            </DialogTrigger>
                            

<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Booking Details</DialogTitle>
    <DialogDescription>ID: {booking.id}</DialogDescription>
  </DialogHeader>
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Service</p>
        <p className="font-medium">{booking.serviceType?.name || booking.serviceTypeId || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Status</p>
        <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Customer</p>
        <p className="font-medium">{booking.customer?.name || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Provider</p>
        <p className="font-medium">{booking.provider?.name || "Unassigned"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Scheduled</p>
        <p className="font-medium">{new Date(booking.scheduledDate).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Price</p>
        {/* ✅ FIX: Add null check */}
        <p className="font-medium">
          ${typeof booking.totalPrice === 'number' ? (booking.totalPrice / 100).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>

    {/* ✅ ADD: Assign Provider Section - Show for all bookings */}
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        {booking.provider ? "Re-assign Provider" : "Assign Provider"}
      </p>
      <Select 
        onValueChange={(v) => handleAssign(booking.id, v)}
        defaultValue={booking.providerId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select provider" />
        </SelectTrigger>
        <SelectContent>
          {providers.map(p => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} {booking.providerId === p.id && "(Current)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <p className="text-sm text-muted-foreground mb-2">Override Status</p>
      <Select onValueChange={(v) => handleOverride(booking.id, v as BookingStatus)}>
        <SelectTrigger><SelectValue placeholder="Change status" /></SelectTrigger>
        <SelectContent>
          {Object.values(BookingStatus).map(s => (
            <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <p className="text-sm font-medium mb-2">Event Log</p>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {events.map((e, idx) => (
          <div key={e.id || idx} className="flex items-start gap-2 text-sm p-2 bg-muted rounded">
            <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {(e.eventType || (e as any).status || "UNKNOWN").replace(/_/g, " ")}
              </p>
              {(e as any).note && (
                <p className="text-xs text-muted-foreground">{(e as any).note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {e.createdAt ? new Date(e.createdAt).toLocaleString() : 
                 (e as any).timestamp ? new Date((e as any).timestamp).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</DialogContent>
                          </Dialog>
                          {[BookingStatus.REJECTED, BookingStatus.PROVIDER_NO_SHOW].includes(booking.status) && (
                            <Button variant="outline" size="sm" onClick={() => handleRetry(booking.id)}><RefreshCw className="w-3 h-3" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="attention" className="mt-6">
            <div className="grid gap-4">
              {needsAttention.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground flex items-center justify-center gap-2"><CheckCircle className="w-5 h-5 text-success" /> All bookings are on track!</CardContent></Card>
              ) : (
                needsAttention.map((booking) => (
                  <Card key={booking.id} className="border-destructive/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-destructive" />
                            <h3 className="font-semibold">{booking.serviceType?.name}</h3>
                            <Badge className={statusColors[booking.status]}>{booking.status.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Customer: {booking.customer?.name} | {new Date(booking.scheduledDate).toLocaleString()}</p>
                        </div>
                        <Button onClick={() => handleRetry(booking.id)} className="gap-1"><RefreshCw className="w-4 h-4" /> Retry Assignment</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
