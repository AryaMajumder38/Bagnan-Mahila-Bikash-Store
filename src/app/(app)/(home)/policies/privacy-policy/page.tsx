import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Chitra',
  description: 'Privacy Policy for Chitra',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="py-12 px-8">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: July 23, 2025
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, make a purchase, 
          sign up for our newsletter, contact customer support, or otherwise communicate with us. This information 
          may include your name, email address, postal address, phone number, and payment information.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Communicate with you about products, services, offers, and events</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
        </ul>

        <h2 className="text-xl font-medium mt-8 mb-4">Sharing of Information</h2>
        <p>
          We may share your information as follows:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
          <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
          <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Chitra or others</li>
          <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
        </ul>

        <h2 className="text-xl font-medium mt-8 mb-4">Security</h2>
        <p>
          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Your Choices</h2>
        <p>
          You may update, correct, or delete information about you at any time by logging into your online account or emailing us at privacy@chitra.com.
          If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Changes to this Policy</h2>
        <p>
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases,
          we may provide you with additional notice (such as adding a statement to our website or sending you a notification).
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@chitra.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
