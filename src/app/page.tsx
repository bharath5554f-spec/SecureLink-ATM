
"use client";

import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AtmKeypad } from '@/components/atm-keypad';
import { authService, AuthStatus } from '@/lib/auth-service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<'card' | 'pin' | 'otp'>('card');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-focus logic simulation
  useEffect(() => {
    if (cardNumber.length === 16 && activeField === 'card') {
      setActiveField('pin');
    }
  }, [cardNumber]);

  const handleKeypadInput = (val: string) => {
    setError('');
    if (activeField === 'card') {
      if (cardNumber.length < 16) setCardNumber(prev => prev + val);
    } else if (activeField === 'pin') {
      if (pin.length < 4) setPin(prev => prev + val);
    } else if (activeField === 'otp') {
      if (otp.length < 6) setOtp(prev => prev + val);
    }
  };

  const handleKeypadDelete = () => {
    if (activeField === 'card') setCardNumber(prev => prev.slice(0, -1));
    else if (activeField === 'pin') setPin(prev => prev.slice(0, -1));
    else if (activeField === 'otp') setOtp(prev => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    if (activeField === 'card') setCardNumber('');
    else if (activeField === 'pin') setPin('');
    else if (activeField === 'otp') setOtp('');
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length !== 16 || pin.length !== 4) {
      setError('Please enter complete credentials.');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = authService.validateCredentials(cardNumber, pin);
      if (result.status === 'otp_required') {
        setStatus('otp_required');
        setActiveField('otp');
        setError('');
      } else if (result.status === 'locked') {
        setStatus('locked');
        setError(result.message || 'Account locked.');
      } else {
        setError(result.message || 'Authentication failed.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = authService.verifyOtp(cardNumber, otp);
      if (result.success) {
        setStatus('authenticated');
        // Store session briefly for dashboard check
        localStorage.setItem('atm_auth', 'true');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        setError(result.message || 'Verification failed.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="text-primary-foreground w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-none">SecureLink</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">ATM Systems</p>
        </div>
      </div>

      <div className="w-full max-w-md grid gap-6">
        <Card className="border-border shadow-2xl bg-card overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  {status === 'otp_required' ? 'Identity Verification' : 'Welcome Back'}
                </CardTitle>
                <CardDescription>
                  {status === 'otp_required' 
                    ? 'Enter the 6-digit code sent to your device' 
                    : 'Please enter your card details to proceed'}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                {status === 'locked' ? 'Locked' : 'Secure Session'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {status !== 'otp_required' && status !== 'authenticated' && (
              <form onSubmit={handleInitialLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className={`space-y-2 atm-input-focus p-1 rounded-lg ${activeField === 'card' ? 'ring-1 ring-primary/30' : ''}`} onClick={() => setActiveField('card')}>
                    <Label htmlFor="cardNumber" className="text-xs text-muted-foreground uppercase tracking-wider ml-1">Card Number (16 Digits)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        value={cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                        readOnly
                        placeholder="0000 0000 0000 0000"
                        className="pl-10 h-12 bg-background border-none text-lg tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  <div className={`space-y-2 atm-input-focus p-1 rounded-lg ${activeField === 'pin' ? 'ring-1 ring-primary/30' : ''}`} onClick={() => setActiveField('pin')}>
                    <Label htmlFor="pin" className="text-xs text-muted-foreground uppercase tracking-wider ml-1">Secret PIN (4 Digits)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="pin"
                        type="password"
                        value={pin}
                        readOnly
                        placeholder="••••"
                        className="pl-10 h-12 bg-background border-none text-lg tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive animate-in zoom-in-95 duration-200">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {status === 'locked' ? (
                  <Button variant="outline" className="w-full h-12 border-destructive text-destructive hover:bg-destructive/10" disabled>
                    Account Temporarily Locked
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-md font-bold transition-all shadow-lg shadow-primary/20"
                    disabled={isLoading || cardNumber.length !== 16 || pin.length !== 4}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Continue to Verification <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                )}
              </form>
            )}

            {status === 'otp_required' && (
              <form onSubmit={handleOtpVerification} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2 atm-input-focus p-1 rounded-lg" onClick={() => setActiveField('otp')}>
                    <Label htmlFor="otp" className="text-xs text-muted-foreground uppercase tracking-wider ml-1 text-center block">One-Time Password</Label>
                    <Input
                      id="otp"
                      value={otp}
                      readOnly
                      placeholder="000 000"
                      className="h-16 bg-background border-none text-3xl tracking-[1em] text-center font-mono placeholder:tracking-normal placeholder:text-muted/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-md font-bold transition-all"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>Verify and Access Dashboard <CheckCircle2 className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  type="button"
                  className="w-full text-muted-foreground text-xs hover:text-primary transition-colors"
                  onClick={() => setStatus('idle')}
                >
                  Return to card entry
                </Button>
              </form>
            )}

            {status === 'authenticated' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 fade-in duration-500">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-accent-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">Authenticated!</h3>
                  <p className="text-muted-foreground">Initializing secure environment...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Physical Numeric Keypad simulation */}
        <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <Card className="border-border bg-card/50 backdrop-blur-sm p-4">
            <AtmKeypad 
              onInput={handleKeypadInput} 
              onDelete={handleKeypadDelete} 
              onClear={handleKeypadClear} 
            />
          </Card>
        </div>

        <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground/50">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> 256-bit Encrypted
          </div>
          <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div>PCI-DSS Compliant</div>
          <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> V2.4.0
          </div>
        </div>
      </div>
    </div>
  );
}
