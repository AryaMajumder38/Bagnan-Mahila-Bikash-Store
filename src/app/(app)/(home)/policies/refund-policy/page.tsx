import React from 'react';

export const metadata = {
  title: 'Refund Policy | Chitra',
  description: 'Our refund policy at Chitra',
};

const RefundPolicyPage = () => {
  return (
    <div className="py-12 px-8">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Refund Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: July 23, 2025
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Returns</h2>
        <p>
          We accept returns within 30 days of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it.
          It must also be in the original packaging. To complete your return, we require a receipt or proof of purchase.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Refunds</h2>
        <p>
          Once we receive and inspect your return, we will send you an email to notify you that we have received your returned item.
          We will also notify you of the approval or rejection of your refund.
        </p>
        <p className="mt-4">
          If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment,
          within 5-7 business days.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Late or Missing Refunds</h2>
        <p>
          If you have not received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted.
          Next, contact your bank. There is often some processing time before a refund is posted. If you have done all of this and you still have not received your refund yet,
          please contact us at support@chitra.com.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Sale Items</h2>
        <p>
          Only regular priced items may be refunded, unfortunately sale items cannot be refunded.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Exchanges</h2>
        <p>
          We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at support@chitra.com.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy, please contact us at support@chitra.com.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
