import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, CheckCircle } from "lucide-react";

interface MPesaPaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MPesaPayment({ amount, onSuccess, onCancel }: MPesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'confirm'>('input');
  const { toast } = useToast();

  const formatPhoneNumber = (value: string) => {
    // Remove any non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as Kenyan number
    if (digits.startsWith('254')) {
      return digits;
    } else if (digits.startsWith('0')) {
      return '254' + digits.slice(1);
    } else if (digits.length <= 9) {
      return '254' + digits;
    }
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const initiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 12) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Simulate M-Pesa STK Push
      const response = await fetch('/api/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          amount,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setStep('confirm');
        toast({
          title: "Payment Request Sent",
          description: "Check your phone for M-Pesa prompt",
        });
        
        // Simulate payment confirmation after 5 seconds
        setTimeout(() => {
          onSuccess();
          toast({
            title: "Payment Successful!",
            description: "Welcome to Premium!",
          });
        }, 5000);
      } else {
        throw new Error('Payment initiation failed');
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process M-Pesa payment. Please try again.",
        variant: "destructive",
      });
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Smartphone className="w-6 h-6 text-green-600" />
          M-Pesa Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'input' && (
          <>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phoneNumber.replace('254', '0')}
                onChange={handlePhoneChange}
                maxLength={10}
                data-testid="input-mpesa-phone"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your Safaricom number
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  KSH {amount}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                data-testid="button-cancel-mpesa"
              >
                Cancel
              </Button>
              <Button
                onClick={initiatePayment}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
                data-testid="button-pay-mpesa"
              >
                Pay Now
              </Button>
            </div>
          </>
        )}
        
        {step === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Sending Payment Request...</h3>
            <p className="text-gray-600 text-sm">
              Please wait while we process your payment
            </p>
          </div>
        )}
        
        {step === 'confirm' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Check Your Phone</h3>
            <p className="text-gray-600 text-sm mb-4">
              You should receive an M-Pesa prompt on {phoneNumber.replace('254', '0')}
            </p>
            <p className="text-xs text-gray-500">
              Enter your M-Pesa PIN to complete the payment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}