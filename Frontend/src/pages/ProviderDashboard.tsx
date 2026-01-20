import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { getBookings, acceptJob, rejectJob, updateBookingStatus, getProviderStats } from "@/api/api";
import { Booking, BookingStatus, ProviderStats } from "@/types/booking";
import { Sparkles, Wrench, Calendar, MapPin, Clock, LogOut, CheckCircle, X, Play, DollarSign, Star, TrendingUp } from "lucide-react";

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "bg-warning/10 text-warning border-warning/20",
  [BookingStatus.ASSIGNED]: "bg-info/10 text-info border-info/20",
  [BookingStatus.IN_PROGRESS]: "bg-primary/10 text-primary border-primary/20",
  [BookingStatus.COMPLETED]: "bg-success/10 text-success border-success/20",
  [BookingStatus.CANCELLED]: "bg-muted text-muted-foreground",
  [BookingStatus.REJECTED]: "bg-destructive/10 text-destructive border-destructive/20",
  [BookingStatus.PROVIDER_NO_SHOW]: "bg-destructive/10 text-destructive border-destructive/20",
  [BookingStatus.RE_ASSIGNED]: "bg-info/10 text-info border-info/20",
};

export default function ProviderDashboard() {
 const navigate = useNavigate();
 const { user, logout, isAuthenticated, hydrated } = useApp();

  const { toast } = useToast();

  const [availableJobs, setAvailableJobs] = useState<Booking[]>([]);
  const [myJobs, setMyJobs] = useState<Booking[]>([]);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) {
  return ; // or <Loader />
}

if (!isAuthenticated) {
  navigate("/login");
  return ;
}

    loadData();
  }, [hydrated, isAuthenticated]);

  const loadData = async () => {
    try {
      const [availableRes, myJobsRes, statsRes] = await Promise.all([
        getBookings({ scope: "all" }),
        getBookings({ scope: "mine" }),
        getProviderStats(user!.id),
      ]);

      setAvailableJobs(availableRes.data);
      setMyJobs(myJobsRes.data);
      setStats(statsRes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load provider data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      await acceptJob(bookingId);
      toast({ title: "Accepted", description: "Job accepted successfully" });
      loadData();
    } catch {
      toast({ title: "Error", description: "Failed to accept job", variant: "destructive" });
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await rejectJob(bookingId, "Not available");
      toast({ title: "Rejected", description: "Job rejected" });
      loadData();
    } catch {
      toast({ title: "Error", description: "Failed to reject job", variant: "destructive" });
    }
  };

  const handleStartJob = async (bookingId: string) => {
    await updateBookingStatus({ bookingId, status: BookingStatus.IN_PROGRESS });
    loadData();
  };

  const handleComplete = async (bookingId: string) => {
    await updateBookingStatus({ bookingId, status: BookingStatus.COMPLETED });
    loadData();
  };
 const handleLogout = () => {
    logout();
    navigate("/");
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
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
              <Wrench className="w-4 h-4" />
              <span className="text-sm">{user?.name || "Provider"}</span>
              <Badge variant="outline" className="bg-accent/10 text-accent">Provider</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your jobs and track earnings</p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10"><CheckCircle className="w-5 h-5 text-success" /></div>
                <div><p className="text-2xl font-bold">{stats.completedBookings}</p><p className="text-xs text-muted-foreground">Completed</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><DollarSign className="w-5 h-5 text-primary" /></div>
                <div><p className="text-2xl font-bold">${(stats.totalEarnings / 100).toFixed(0)}</p><p className="text-xs text-muted-foreground">Earnings</p></div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10"><Star className="w-5 h-5 text-warning" /></div>
                <div><p className="text-2xl font-bold">{stats.averageRating}</p><p className="text-xs text-muted-foreground">Rating</p></div>
              </CardContent>
            </Card> */}
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10"><TrendingUp className="w-5 h-5 text-info" /></div>
                <div><p className="text-2xl font-bold">{stats.acceptanceRate}%</p><p className="text-xs text-muted-foreground">Acceptance</p></div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">Available Jobs ({availableJobs.length})</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs ({myJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            <div className="grid gap-4">
              {availableJobs.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No available jobs at the moment</CardContent></Card>
              ) : (
                availableJobs.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                                      {booking.serviceTypeId.replace("-", " ").toUpperCase()}
                                    </h3>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{booking.address.city}</span>
                          </div>
                          {booking.notes && <p className="text-sm text-muted-foreground">Notes: {booking.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">
                                ${typeof booking.totalPrice === 'number' 
                                  ? (booking.totalPrice / 100).toFixed(2) 
                                  : '0.00'}
                              </span>
                          <Button variant="outline" size="sm" onClick={() => handleReject(booking.id)}><X className="w-4 h-4" /></Button>
                          <Button size="sm" onClick={() => handleAccept(booking.id)}>Accept</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-jobs" className="mt-6">
            <div className="grid gap-4">
              {myJobs.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No assigned jobs</CardContent></Card>
              ) : (
                myJobs.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">
            {booking.serviceTypeId.replace("-", " ").toUpperCase()}
          </h3>
                            <Badge className={statusColors[booking.status]}>{booking.status.replace("_", " ")}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{booking.address.street}, {booking.address.city}</p>
                          <p className="text-sm">{new Date(booking.scheduledDate).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {booking.status === BookingStatus.ASSIGNED && (
                            <Button size="sm" onClick={() => handleStartJob(booking.id)} className="gap-1">
                              <Play className="w-4 h-4" /> Start
                            </Button>
                          )}
                          {booking.status === BookingStatus.IN_PROGRESS && (
                            <Button size="sm" onClick={() => handleComplete(booking.id)} className="gap-1 bg-success hover:bg-success/90">
                              <CheckCircle className="w-4 h-4" /> Complete
                            </Button>
                          )}
                        </div>
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
