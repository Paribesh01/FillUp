import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Zap,
  Palette,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  F
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">Tally</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#templates"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>

            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              ✨ New: AI-powered form suggestions
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Create Stunning Forms in{" "}
              <span className="text-primary">Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Intuitive design, customizable templates, and professional
              results. Build beautiful forms that convert without any coding
              knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Templates
              </Button>
            </div>

            {/* Hero Visual */}
            <div className="mt-16 relative">
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <div className="h-3 w-3 rounded-full bg-accent"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-8 bg-input border border-border rounded"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-input border border-border rounded"></div>
                    <div className="h-10 bg-primary rounded text-primary-foreground flex items-center justify-center font-medium">
                      Submit Form
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Everything you need to build amazing forms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make form building effortless and results
              impressive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Create professional forms in minutes with our intuitive
                  drag-and-drop builder
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Beautiful Design</CardTitle>
                <CardDescription>
                  Stunning templates and customization options to match your
                  brand perfectly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together with your team to create and manage forms
                  efficiently
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Start with a template
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Contact Form", category: "Business", popular: true },
              { name: "Survey Form", category: "Research", popular: false },
              { name: "Registration Form", category: "Events", popular: true },
              { name: "Feedback Form", category: "Support", popular: false },
              { name: "Order Form", category: "E-commerce", popular: true },
              { name: "Application Form", category: "HR", popular: false },
            ].map((template, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <CardHeader>
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-16 w-16 bg-card rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.popular && (
                      <Badge
                        variant="secondary"
                        className="bg-accent/10 text-accent"
                      >
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{template.category}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Loved by thousands of users
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                content:
                  "FormCraft has revolutionized how we collect customer feedback. The forms look amazing and the analytics are incredibly helpful.",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Small Business Owner",
                content:
                  "I was able to create a professional contact form in under 10 minutes. The templates saved me so much time!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Event Coordinator",
                content:
                  "The registration forms we create with FormCraft have significantly improved our event sign-up rates.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Ready to create your first form?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust FormCraft for their form building
            needs
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Start Building for Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  F
                </span>
              </div>
              <span className="font-bold text-xl text-foreground">
                FormCraft
              </span>
            </div>

            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 FormCraft. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
