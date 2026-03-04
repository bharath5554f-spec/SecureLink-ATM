
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  History, 
  Settings, 
  LogOut,
  Bell,
  Fingerprint,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('atm_auth');
    if (!auth) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('atm_auth');
    router.push('/');
  };

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="font-bold text-lg">SecureLink ATM</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-px bg-border mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">John Doe</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Premium Account</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid gap-8 animate-in fade-in duration-700">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary text-primary-foreground shadow-xl shadow-primary/10 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <p className="text-xs font-medium uppercase tracking-widest opacity-80">Total Balance</p>
              <CardTitle className="text-4xl font-bold">$12,450.00</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none flex gap-1">
                  <TrendingUp className="w-3 h-3" /> +2.4%
                </Badge>
                <span className="text-xs opacity-70">since last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Monthly Limit</p>
              <CardTitle className="text-2xl font-bold">$5,000 / $8,000</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={62.5} className="h-2" />
              <p className="text-xs text-muted-foreground">You have $3,000 remaining this month.</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Security Status</p>
              <CardTitle className="text-2xl font-bold flex items-center gap-2 text-accent">
                <ShieldCheck className="w-6 h-6" /> Optimized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Last Login:</span>
                  <span className="font-mono">Today, 14:32</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Location:</span>
                  <span className="font-mono">NYC Branch 42</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Recent Activity
              </h2>
              <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-wider">View All</Button>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'ATM Withdrawal', date: 'Oct 24, 2023', amount: '-$200.00', icon: ArrowUpRight, color: 'text-destructive' },
                { label: 'Online Deposit', date: 'Oct 22, 2023', amount: '+$1,500.00', icon: ArrowDownLeft, color: 'text-accent' },
                { label: 'Card Payment', date: 'Oct 21, 2023', amount: '-$45.20', icon: ArrowUpRight, color: 'text-destructive' },
                { label: 'Dividend Credit', date: 'Oct 15, 2023', amount: '+$12.50', icon: ArrowDownLeft, color: 'text-accent' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <tx.icon className={`w-5 h-5 ${tx.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{tx.label}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <p className={`font-mono font-bold ${tx.color}`}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="h-24 flex-col gap-2 rounded-2xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Cards</span>
              </Button>
              <Button variant="secondary" className="h-24 flex-col gap-2 rounded-2xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                <ArrowUpRight className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Transfer</span>
              </Button>
              <Button variant="secondary" className="h-24 flex-col gap-2 rounded-2xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20">
                <Settings className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest">Security</span>
              </Button>
              <Button 
                variant="secondary" 
                className="h-24 flex-col gap-2 rounded-2xl hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/20 text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest">End Session</span>
              </Button>
            </div>

            <Card className="bg-accent/5 border-dashed border-accent/30 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-accent-foreground w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider">Security Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Always change your PIN every 3 months and never share your OTP with anyone, including bank staff.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 mt-12 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 SecureLink ATM Verification Systems. All rights reserved. 
          <br className="sm:hidden" />
          <span className="mx-2 hidden sm:inline">|</span> 
          System Version v2.4.0 (Stable)
        </p>
      </footer>
    </div>
  );
}
