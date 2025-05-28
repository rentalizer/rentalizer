
import React from 'react';
import { TopNavBar } from '@/components/TopNavBar';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TopNavBar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="bg-gray-900/60 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
            Terms of Service
          </h1>
          
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">Last updated: January 2025</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Rentalizer, you accept and agree to be bound by the terms and 
                provision of this agreement. These Terms of Service govern your use of our platform 
                and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                Rentalizer is an AI-powered platform that provides short-term rental market analysis, 
                revenue calculations, and investment insights. Our services include:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Market analysis and competitive intelligence</li>
                <li>Revenue projection calculations</li>
                <li>Property investment insights</li>
                <li>Market data visualization</li>
                <li>API access for developers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">3. User Accounts</h2>
              <p className="mb-4">
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">4. Data and Information Disclaimer</h2>
              <p>
                The market data, analysis, and projections provided by Rentalizer are for informational 
                purposes only and should not be considered as financial or investment advice. Past 
                performance does not guarantee future results. Users should conduct their own due 
                diligence before making investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">5. Subscription and Billing</h2>
              <p className="mb-4">
                Subscription fees are billed in advance on a recurring basis. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Pay all applicable fees and charges</li>
                <li>Automatic renewal unless cancelled</li>
                <li>Changes to pricing with advance notice</li>
                <li>No refunds for partial billing periods</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">6. Prohibited Uses</h2>
              <p className="mb-4">You may not use our service to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reproduce, duplicate, or copy our content without permission</li>
                <li>Use automated systems to access our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of Rentalizer are owned by us and are protected 
                by international copyright, trademark, and other intellectual property laws. You may not 
                reproduce, distribute, or create derivative works without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall Rentalizer be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our service immediately, without 
                prior notice, for conduct that we believe violates these Terms of Service or is harmful 
                to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">10. Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us at{' '}
                <a href="mailto:legal@istayusa.com" className="text-cyan-300 hover:text-cyan-200">
                  legal@istayusa.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
