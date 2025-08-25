import { useState } from "react";
import { Link } from "wouter";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Crown, Infinity, Star, RotateCcw, Eye } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";

// Use a test key for development
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51234567890abcdef';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PREMIUM_FEATURES = [
  {
    icon: Infinity,
    title: "Unlimited Likes",
    description: "Like as many profiles as you want",
    color: "from-pink-500 to-purple-500"
  },
  {
    icon: Star,
    title: "5 Super Likes Daily",
    description: "Stand out with Super Likes",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: RotateCcw,
    title: "Rewind Feature",
    description: "Undo your last swipe",
    color: "from-green-500 to-teal-500"
  },
  {
    icon: Eye,
    title: "See Who Likes You",
    description: "Match instantly with people who like you",
    color: "from-purple-500 to-pink-500"
  },
];

const PRICING_PLANS = [
  {
    duration: "1 Month",
    price: 19.99,
    monthlyPrice: 19.99,
    savings: null,
    popular: false,
  },
  {
    duration: "6 Months",
    price: 89.94,
    monthlyPrice: 14.99,
    savings: 25,
    popular: true,
  },
  {
    duration: "12 Months",
    price: 119.88,
    monthlyPrice: 9.99,
    savings: 50,
    popular: false,
  },
];

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState(1); // Default to 6 months
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleContinue = async () => {
    try {
      const response = await fetch("/api/get-or-create-subscription", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  if (showCheckout && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCheckout(false)}
                className="text-white hover:bg-white/20 mr-4"
                data-testid="button-back-to-plans"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold">Complete Payment</h1>
            </div>
            <p className="opacity-90">Secure payment powered by Stripe</p>
          </div>
          
          <div className="p-6">
            <CheckoutForm />
          </div>
        </div>
      </Elements>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
        <div className="flex items-center mb-4">
          <Link href="/settings">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 mr-4"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">LoveConnect Premium</h1>
        </div>
        <p className="opacity-90">Unlock all features and find love faster</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Premium Features */}
        <div className="space-y-4">
          {PREMIUM_FEATURES.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mr-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing Plans */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Your Plan</h3>
          <div className="space-y-4">
            {PRICING_PLANS.map((plan, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlan === index 
                    ? plan.popular 
                      ? "border-2 border-purple-400 bg-purple-50 shadow-lg"
                      : "border-2 border-orange-400 bg-orange-50 shadow-lg"
                    : "border border-gray-200 hover:shadow-md"
                } ${plan.popular ? "relative" : ""}`}
                onClick={() => setSelectedPlan(index)}
                data-testid={`plan-${index}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-3 py-1">
                      POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 border-2 rounded-full mr-3 flex items-center justify-center ${
                        selectedPlan === index 
                          ? plan.popular 
                            ? "border-purple-500 bg-purple-500"
                            : "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      }`}>
                        {selectedPlan === index && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{plan.duration}</h4>
                        {plan.savings && (
                          <p className="text-sm text-green-600 font-medium">
                            Save {plan.savings}%
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        ${plan.monthlyPrice}
                      </p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          data-testid="button-continue-payment"
        >
          <Crown className="w-5 h-5 mr-2" />
          Continue with Premium
        </Button>
        
        <p className="text-center text-xs text-gray-500">
          Auto-renewal. Cancel anytime in settings.
        </p>
      </div>
    </div>
  );
}

