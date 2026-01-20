import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Wrench, 
  Heart, 
  CheckCircle, 
  Clock, 
  Shield, 
  Star, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  SprayCan,
  Home,
  Zap,
  Thermometer,
  Scissors,
  Users,
  Award
} from "lucide-react";

const services = [
  { 
    icon: SprayCan, 
    title: "Deep Cleaning", 
    description: "Thorough cleaning including appliances, windows, and hard-to-reach areas",
    price: "From $150"
  },
  { 
    icon: Sparkles, 
    title: "Standard Cleaning", 
    description: "Regular house cleaning including dusting, vacuuming, and mopping",
    price: "From $80"
  },
  { 
    icon: Home, 
    title: "Move-in/Move-out", 
    description: "Complete cleaning for empty properties before or after moving",
    price: "From $200"
  },
  { 
    icon: Wrench, 
    title: "Plumbing Repair", 
    description: "Fix leaks, unclog drains, repair faucets and pipes",
    price: "From $120"
  },
  { 
    icon: Zap, 
    title: "Electrical Work", 
    description: "Outlet installation, wiring repairs, fixture installation",
    price: "From $150"
  },
  { 
    icon: Thermometer, 
    title: "HVAC Service", 
    description: "AC repair, heating maintenance, duct cleaning",
    price: "From $180"
  },
  { 
    icon: Heart, 
    title: "Spa Massage", 
    description: "Relaxing full body massage with essential oils at home",
    price: "From $120"
  },
  { 
    icon: Scissors, 
    title: "Hair Styling", 
    description: "Professional haircut, styling, and treatment at your doorstep",
    price: "From $75"
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "2000+", label: "Service Providers" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const steps = [
  { 
    step: "01",
    icon: CheckCircle, 
    title: "Choose Your Service", 
    description: "Browse our wide range of home services and select what you need" 
  },
  { 
    step: "02",
    icon: Clock, 
    title: "Book Instantly", 
    description: "Pick a convenient date and time that works for your schedule" 
  },
  { 
    step: "03",
    icon: Shield, 
    title: "Relax & Enjoy", 
    description: "Our verified professionals will handle everything with care" 
  },
];

const testimonials = [
  { 
    name: "Sarah Mitchell", 
    role: "Homeowner", 
    content: "Clean Fanatics transformed my home! The deep cleaning service was exceptional. Every corner was spotless.",
    rating: 5,
    avatar: "SM"
  },
  { 
    name: "Michael Roberts", 
    role: "Business Owner", 
    content: "Quick response for emergency plumbing. Professional team that saved my restaurant from a flood!",
    rating: 5,
    avatar: "MR"
  },
  { 
    name: "Emily Thompson", 
    role: "Working Professional", 
    content: "The at-home spa services are a game changer. Professional massage therapy without leaving home!",
    rating: 5,
    avatar: "ET"
  },
];

const teamValues = [
  { icon: Award, title: "Quality First", description: "We never compromise on service quality" },
  { icon: Users, title: "Verified Pros", description: "All providers are background-checked" },
  { icon: Shield, title: "100% Insured", description: "Full coverage for your peace of mind" },
  { icon: Clock, title: "On-Time", description: "Punctuality is our promise" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">Clean Fanatics</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Services</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">How It Works</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">About Us</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto text-center max-w-4xl relative">
          <Badge className="mb-6 px-4 py-1.5" variant="secondary">
            ⭐ Rated #1 Home Services Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your Home,{" "}
            <span className="text-primary">Our Passion</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            From sparkling clean spaces to expert repairs and wellness treatments — 
            Clean Fanatics brings trusted professionals right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="gap-2 px-8 h-12 text-base">
                Book a Service <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#services">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base">
                Explore Services
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive home services tailored to your needs. Quality guaranteed.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{service.price}</span>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                        Book <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/login">
              <Button size="lg" variant="outline" className="gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three easy steps to a better home</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <Badge variant="outline" className="mb-4">About Us</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                We're <span className="text-primary">Clean Fanatics</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Founded in 2020, Clean Fanatics was born from a simple idea: everyone deserves 
                access to reliable, professional home services without the hassle.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Today, we connect thousands of homeowners with verified, skilled professionals 
                across cleaning, repairs, and wellness. Every provider is background-checked, 
                trained, and committed to delivering exceptional service.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {teamValues.map((value) => (
                  <div key={value.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <value.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <Sparkles className="w-24 h-24 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    Making quality home services accessible, reliable, and stress-free for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Real reviews from real customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of happy customers. Book your first service today and experience the Clean Fanatics difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="gap-2 px-8">
                    Book Now <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="px-8">
                    Become a Provider
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">Clean Fanatics</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your trusted partner for all home services. Quality, reliability, and care in every job.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Services</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-background transition-colors cursor-pointer">Cleaning Services</li>
                <li className="hover:text-background transition-colors cursor-pointer">Repairs & Maintenance</li>
                <li className="hover:text-background transition-colors cursor-pointer">Beauty & Wellness</li>
                <li className="hover:text-background transition-colors cursor-pointer">Emergency Services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-background transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-background transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-background transition-colors cursor-pointer">Partner With Us</li>
                <li className="hover:text-background transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5" /> 
                  <span>1-800-CLEAN-PRO</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5" /> 
                  <span>hello@cleanfanatics.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" /> 
                  <span>New York, NY</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Clean Fanatics. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="hover:text-background cursor-pointer">Privacy Policy</span>
              <span className="hover:text-background cursor-pointer">Terms of Service</span>
              <span className="hover:text-background cursor-pointer">Cookie Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
