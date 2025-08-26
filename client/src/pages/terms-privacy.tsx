import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsPrivacy() {
  const [, setLocation] = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleContinue = () => {
    if (acceptedTerms && acceptedPrivacy) {
      // Store acceptance in localStorage
      localStorage.setItem('termsAccepted', 'true');
      localStorage.setItem('privacyAccepted', 'true');
      // Redirect to authentication
      window.location.href = '/api/login';
    }
  };

  const canContinue = acceptedTerms && acceptedPrivacy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="bg-gradient-to-r from-pink-600 to-orange-600 p-6 text-white">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/landing')}
            className="text-white hover:bg-white/20 mr-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Terms & Privacy Policy</h1>
        </div>
        <p className="opacity-90">Please review and accept our terms and privacy policy to continue</p>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Terms of Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full border rounded p-4 text-sm">
              <div className="space-y-4">
                <h3 className="font-semibold">1. ACCEPTANCE OF TERMS</h3>
                <p>By accessing and using LoveConnect ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

                <h3 className="font-semibold">2. DESCRIPTION OF SERVICE</h3>
                <p>LoveConnect is a dating application that connects users in Kenya and globally to help them find meaningful relationships. Our service includes profile creation, matching algorithms, messaging, and premium features.</p>

                <h3 className="font-semibold">3. USER ELIGIBILITY</h3>
                <p>You must be at least 18 years old to use this service. By using LoveConnect, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all terms and conditions.</p>

                <h3 className="font-semibold">4. USER CONDUCT</h3>
                <p>You agree to use the service only for lawful purposes and in accordance with these Terms. You agree NOT to:
                • Harass, abuse, or harm another person
                • Post false, inaccurate, misleading, defamatory, or libelous content
                • Share inappropriate, offensive, or adult content
                • Engage in commercial activities without consent
                • Violate any applicable laws or regulations of Kenya</p>

                <h3 className="font-semibold">5. PRIVACY AND DATA PROTECTION</h3>
                <p>Your privacy is important to us. We comply with Kenya's Data Protection Act, 2019. Please review our Privacy Policy which also governs your use of the service.</p>

                <h3 className="font-semibold">6. PAYMENT TERMS</h3>
                <p>Premium features require payment via Stripe or M-Pesa. All payments are processed securely. Subscriptions auto-renew unless cancelled. Refunds are subject to our refund policy.</p>

                <h3 className="font-semibold">7. CONTENT OWNERSHIP</h3>
                <p>You retain ownership of content you post. However, by posting content, you grant LoveConnect a license to use, modify, and display such content for service operation.</p>

                <h3 className="font-semibold">8. TERMINATION</h3>
                <p>We may terminate or suspend your account at any time for violating these terms or for any other reason. You may delete your account at any time through the app settings.</p>

                <h3 className="font-semibold">9. LIMITATION OF LIABILITY</h3>
                <p>LoveConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>

                <h3 className="font-semibold">10. GOVERNING LAW</h3>
                <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes shall be resolved in Kenyan courts.</p>

                <h3 className="font-semibold">11. CONTACT INFORMATION</h3>
                <p>For questions about these Terms, contact us at legal@loveconnect.co.ke or our Data Protection Officer at dpo@loveconnect.co.ke</p>
              </div>
            </ScrollArea>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                data-testid="checkbox-accept-terms"
              />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the Terms of Service
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full border rounded p-4 text-sm">
              <div className="space-y-4">
                <h3 className="font-semibold">1. WHO WE ARE</h3>
                <p>LoveConnect is a dating application operated in compliance with Kenya's Data Protection Act, 2019. We are registered with the Office of the Data Protection Commissioner (ODPC) Kenya.
                
                Data Protection Officer: dpo@loveconnect.co.ke
                Business Address: Nairobi, Kenya
                Phone: +254-XXX-XXXX</p>

                <h3 className="font-semibold">2. WHAT DATA WE COLLECT</h3>
                <p>We collect the following types of information:
                • Profile Information: Name, age, gender, photos, bio, preferences
                • Location Data: GPS coordinates for matching nearby users
                • Communication Data: Messages, likes, swipes, matches
                • Payment Information: Subscription and transaction data (via Stripe/M-Pesa)
                • Device Information: Device type, IP address, app usage analytics
                • Social Media: Data from connected social accounts (if you choose to connect)</p>

                <h3 className="font-semibold">3. HOW WE USE YOUR DATA</h3>
                <p>We use your data to:
                • Provide matching services and show you compatible profiles
                • Enable communication between matched users
                • Process payments for premium features
                • Improve our service through analytics and machine learning
                • Ensure safety and prevent fraud
                • Comply with legal obligations in Kenya</p>

                <h3 className="font-semibold">4. DATA SHARING & THIRD PARTIES</h3>
                <p>We may share your data with:
                • Other users (profile information only, as part of the service)
                • Payment processors (Stripe, Safaricom M-Pesa) for transaction processing
                • Cloud service providers (data stored in Kenya-compliant data centers)
                • Law enforcement when required by Kenyan law
                • Service providers who help us operate the app (under strict data protection agreements)
                
                We DO NOT sell your personal data to advertisers or data brokers.</p>

                <h3 className="font-semibold">5. YOUR RIGHTS</h3>
                <p>Under Kenya's Data Protection Act, you have the right to:
                • Access your personal data and get a copy
                • Correct inaccurate or incomplete data
                • Delete your data (right to erasure)
                • Restrict processing of your data
                • Data portability (transfer your data to another service)
                • Object to processing for marketing purposes
                • Withdraw consent at any time</p>

                <h3 className="font-semibold">6. DATA SECURITY</h3>
                <p>We protect your data using:
                • Encryption in transit and at rest
                • Secure servers located in Kenya-compliant data centers
                • Regular security audits and monitoring
                • Access controls and staff training
                • Secure payment processing systems</p>

                <h3 className="font-semibold">7. DATA RETENTION</h3>
                <p>We retain your data for as long as your account is active or as needed to provide services. When you delete your account:
                • Profile data is immediately removed from public view
                • Personal data is deleted within 30 days
                • Some data may be retained longer for legal compliance or fraud prevention</p>

                <h3 className="font-semibold">8. DATA TRANSFERS</h3>
                <p>Your data is primarily processed and stored in Kenya-compliant data centers. If data needs to be transferred outside Kenya, we ensure adequate protection measures are in place.</p>

                <h3 className="font-semibold">9. COOKIES & TRACKING</h3>
                <p>We use cookies and similar technologies to:
                • Keep you logged in
                • Remember your preferences
                • Analyze app usage and performance
                • Provide personalized content
                
                You can control cookies through your device settings.</p>

                <h3 className="font-semibold">10. CHILDREN'S PRIVACY</h3>
                <p>LoveConnect is not intended for users under 18. We do not knowingly collect data from children under 18. If we become aware of such data collection, we will delete it immediately.</p>

                <h3 className="font-semibold">11. DATA BREACH NOTIFICATION</h3>
                <p>In case of a data breach that may affect your personal data, we will:
                • Notify the ODPC within 72 hours
                • Inform affected users without undue delay
                • Take immediate steps to contain and remedy the breach</p>

                <h3 className="font-semibold">12. CHANGES TO THIS POLICY</h3>
                <p>We may update this Privacy Policy from time to time. We will notify you of material changes through:
                • Email notification
                • In-app notification
                • Website announcement
                
                Changes take effect 30 days after notification unless you object.</p>

                <h3 className="font-semibold">13. CONTACT US</h3>
                <p>For privacy-related questions or to exercise your rights:
                
                Data Protection Officer: dpo@loveconnect.co.ke
                General Support: support@loveconnect.co.ke
                Address: LoveConnect, Nairobi, Kenya
                
                You also have the right to file a complaint with the Office of the Data Protection Commissioner (ODPC) Kenya: info@odpc.go.ke</p>

                <h3 className="font-semibold">14. CONSENT</h3>
                <p>By using LoveConnect, you consent to the collection and use of your information as described in this Privacy Policy. You may withdraw consent at any time by deleting your account or contacting our DPO.</p>
              </div>
            </ScrollArea>
            
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="privacy" 
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                data-testid="checkbox-accept-privacy"
              />
              <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the Privacy Policy
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation('/landing')}
            className="flex-1"
            data-testid="button-back-to-landing"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`flex-1 ${canContinue ? 'bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700' : ''}`}
            data-testid="button-continue"
          >
            Continue to Profile Setup
          </Button>
        </div>
      </div>
    </div>
  );
}