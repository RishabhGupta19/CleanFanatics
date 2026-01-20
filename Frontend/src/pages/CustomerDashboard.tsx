import { useState, useEffect,useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { getBookings, getServiceTypes, createBooking, cancelBooking, updateBookingStatus } from "@/api/api";
import { Booking, ServiceType, ServiceCategory, BookingStatus, CreateBookingRequest } from "@/types/booking";
import { Sparkles, Plus, Calendar, MapPin, Clock, User, LogOut, X, Play, CheckCircle } from "lucide-react";

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

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, hydrated } = useApp();

  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [selectedService, setSelectedService] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [address, setAddress] = useState({ street: "", unit: "", city: "", state: "", postalCode: "", notes: "" });
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    if (!hydrated) {
  return ; // or <Loader />
}

if (!isAuthenticated) {
  navigate("/login");
  return ;
}

    loadData();
  }, [isAuthenticated, hydrated]);

  const loadData = async () => {
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        getBookings({ customerId: user?.id }),
        getServiceTypes(),
      ]);
      setBookings(bookingsRes.data);
      setServiceTypes(servicesRes);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const serviceTypeMap = useMemo(() => {
  return Object.fromEntries(
    serviceTypes.map(st => [st.id, st])
  );
}, [serviceTypes]);



  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !scheduledDate || !address.street || !address.city) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const request: CreateBookingRequest = {
        serviceTypeId: selectedService,
        scheduledDate: new Date(scheduledDate).toISOString(),
        address,
        notes,
      };
      await createBooking(request);
      toast({ title: "Success", description: "Booking created successfully!" });
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create booking", variant: "destructive" });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId, "Customer requested cancellation");
      toast({ title: "Cancelled", description: "Booking has been cancelled" });
      loadData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel booking", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setSelectedService("");
    setScheduledDate("");
    setAddress({ street: "", unit: "", city: "", state: "", postalCode: "", notes: "" });
    setNotes("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const selectedServiceType = serviceTypes.find(s => s.id === selectedService);

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
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.name || "Customer"}</span>
              <Badge variant="secondary">Customer</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your bookings and services</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> New Booking</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>Fill in the details to book a service</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Type *</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {Object.values(ServiceCategory).map(cat => (
                        <div key={cat}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{cat.replace("_", " ")}</div>
                          {serviceTypes.filter(s => s.category === cat).map(service => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${(service.basePrice / 100).toFixed(2)}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedServiceType && (
                    <p className="text-sm text-muted-foreground">{selectedServiceType.description}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Date & Time *</Label>
                  <Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} min={new Date().toISOString().slice(0, 16)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Street Address *</Label>
                    <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit/Apt</Label>
                    <Input value={address.unit} onChange={(e) => setAddress({ ...address, unit: e.target.value })} placeholder="Apt 4B" />
                  </div>
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="10001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." />
                </div>
                {selectedServiceType && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between">
                      <span>Estimated Price:</span>
                      <span className="font-bold">${(selectedServiceType.basePrice / 100).toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full">Create Booking</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bookings List */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4">
              {bookings.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No bookings yet. Create your first booking!</CardContent></Card>
              ) : (
                bookings.map((booking) => (
                  
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                           {(() => {
                                          const st = serviceTypeMap[booking.serviceTypeId];
                                          return (
                                            <h3 className="font-semibold">
                                              {st ? st.name : booking.serviceTypeId}
                                            </h3>
                                          );
                                        })()}

                            <Badge className={statusColors[booking.status]}>{booking.status.replace("_", " ")}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{booking.address.city}</span>
                          </div>
                          {booking.provider && (
                            <p className="text-sm">Provider: <span className="font-medium">{booking.provider.name}</span></p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${(booking.totalPrice / 100).toFixed(2)}</span>
                          {booking.status === BookingStatus.PENDING && (
                            <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                              <X className="w-4 h-4" />
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
          <TabsContent value="active" className="mt-6">
            <div className="grid gap-4">
              {bookings.filter(b => [BookingStatus.PENDING, BookingStatus.ASSIGNED, BookingStatus.IN_PROGRESS].includes(b.status)).map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{booking.serviceTypeId}</h3>
                        
                        <p className="text-sm text-muted-foreground">{new Date(booking.scheduledDate).toLocaleString()}</p>
                      </div>
                      <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-4">
              {bookings.filter(b => b.status === BookingStatus.COMPLETED).map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
            {booking.serviceTypeId.replace("-", " ").toUpperCase()}
          </h3>
                        <p className="text-sm text-muted-foreground">{new Date(booking.scheduledDate).toLocaleString()}</p>
                      </div>
                      <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
