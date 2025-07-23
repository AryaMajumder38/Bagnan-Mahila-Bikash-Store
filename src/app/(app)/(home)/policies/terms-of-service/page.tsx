import React from 'react';

export const metadata = {
  title: 'Terms of Service | Chitra',
  description: 'Terms of Service for Chitra',
};

const TermsOfServicePage = () => {
  return (
    <div className="py-12 px-8">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: July 23, 2025
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to Chitra. By accessing our website, you agree to these terms of service. 
          Please read them carefully. If you do not agree with these terms, please do not use our website.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Use of Our Services</h2>
        <p>
          You must follow any policies made available to you within the Services. Don't misuse our Services.
          For example, don't interfere with our Services or try to access them using a method other than the interface and 
          the instructions that we provide.
        </p>
        
        <h2 className="text-xl font-medium mt-8 mb-4">Account Registration</h2>
        <p>
          To access certain features of the Site, you may be required to register for an account. 
          You agree to keep your password confidential and will be responsible for all use of your account and password.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Purchase and Payment</h2>
        <p>
          When you make a purchase, you agree to provide a valid payment method. All prices are shown in the applicable currency
          and do not include taxes unless stated otherwise. We reserve the right to change our prices at any time.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Intellectual Property Rights</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of
          Chitra and its licensors. The Service is protected by copyright, trademark, and other laws.
          Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Chitra.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">User Content</h2>
        <p>
          By posting, uploading, or submitting content to the Site, you grant us a non-exclusive, royalty-free, worldwide, 
          perpetual license to use, modify, publicly display, reproduce, and distribute such content on and through the Service.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
          under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Limitation of Liability</h2>
        <p>
          In no event shall Chitra, nor its directors, employees, partners, agents, suppliers, or affiliates, 
          be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
          loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access 
          or use the Service.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
          By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@chitra.com.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
