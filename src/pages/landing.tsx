import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Plus,
  BarChart3,
  TrendingUp,
  RefreshCw,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowUpRight,
  Circle,
} from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { useState } from "react";

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-sm bg-background/90">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <div className="w-5 h-5 bg-primary-foreground rounded-sm"></div>
            </div>
            <span className="text-2xl font-bold">adaptive.fyi</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAuth(true)}
            className="px-6"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8">
        <div className="text-center pt-32 mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-12">
            <span className="text-sm font-medium text-primary">
              People first Analytics
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
            Understand Your Users
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn how customers use your platform, adapt instantly, and improve
            with their feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-4 h-14"
              onClick={() => setShowAuth(true)}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 h-14"
              onClick={() => setShowAuth(true)}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-muted/50 border border-border/30">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-3 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-3 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-3 border-background"></div>
            </div>
            <span className="text-base font-medium text-foreground">
              Loved by 3,456 users and counting
            </span>
          </div>
        </div>

        {/* The Process */}
        <div className="-mx-8 px-8 py-24 bg-muted/30 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">The Process</h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Add adaptive</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Understand behavior</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Adapt your app</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <RefreshCw className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Repeat</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Goals</h3>
              <p className="text-muted-foreground">
                Define and track user goals to measure success and identify
                improvement opportunities
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Journeys</h3>
              <p className="text-muted-foreground">
                Visualize complete user journeys to understand how customers
                navigate through your platform
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-1 bg-primary rounded"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Features</h3>
              <p className="text-muted-foreground">
                Track feature adoption and usage to understand what resonates
                with your users
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-primary"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trends</h3>
              <p className="text-muted-foreground">
                Monitor trends and patterns over time to make data-driven
                decisions
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-primary rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-muted-foreground mb-4">
                See data in 1000 different ways. Perspective is power
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <div className="flex gap-1">
                  <div className="w-2 h-8 bg-primary rounded"></div>
                  <div className="w-2 h-6 bg-primary rounded mt-2"></div>
                  <div className="w-2 h-4 bg-primary rounded mt-4"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">APIs</h3>
              <p className="text-muted-foreground mb-4">
                Use adaptive.fyi to power your own apps. Analytics data doesn't
                have be siloed
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of testimonials */}
              <div className="flex gap-6 px-6">
                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Product Manager at TechCorp</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "adaptive.fyi transformed how we understand our users. The insights are immediate and actionable."
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                    <div>
                      <div className="font-semibold">Alex Rivera</div>
                      <div className="text-sm text-muted-foreground">CTO at DataFlow</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Finally, analytics that actually help us make better decisions. The integration was seamless."
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div>
                      <div className="font-semibold">Emily Watson</div>
                      <div className="text-sm text-muted-foreground">UX Designer at CreativeHub</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The user journey insights have been game-changing for our design process. Highly recommend!"
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
                    <div>
                      <div className="font-semibold">Michael Park</div>
                      <div className="text-sm text-muted-foreground">Founder at StartupX</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "We've seen a 40% improvement in user retention since implementing adaptive.fyi. Incredible ROI."
                  </p>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-6 px-6">
                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Product Manager at TechCorp</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "adaptive.fyi transformed how we understand our users. The insights are immediate and actionable."
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600"></div>
                    <div>
                      <div className="font-semibold">Alex Rivera</div>
                      <div className="text-sm text-muted-foreground">CTO at DataFlow</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Finally, analytics that actually help us make better decisions. The integration was seamless."
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div>
                      <div className="font-semibold">Emily Watson</div>
                      <div className="text-sm text-muted-foreground">UX Designer at CreativeHub</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The user journey insights have been game-changing for our design process. Highly recommend!"
                  </p>
                </div>

                <div className="min-w-[350px] p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600"></div>
                    <div>
                      <div className="font-semibold">Michael Park</div>
                      <div className="text-sm text-muted-foreground">Founder at StartupX</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "We've seen a 40% improvement in user retention since implementing adaptive.fyi. Incredible ROI."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-20">
          <Button
            size="lg"
            className="text-lg px-12 py-4 h-14"
            onClick={() => setShowAuth(true)}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
