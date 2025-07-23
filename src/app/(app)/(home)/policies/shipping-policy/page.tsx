import React from 'react';

export const metadata = {
  title: 'Shipping Policy | Chitra',
  description: 'Shipping Policy for Chitra',
};

const ShippingPolicyPage = () => {
  return (
    <div className="py-12 px-8">
      <h1 className="text-3xl font-serif mb-8 border-b pb-4">Shipping Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="mb-6">
          Last updated: July 23, 2025
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Processing Time</h2>
        <p>
          All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
          If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          If there will be a significant delay in the shipment of your order, we will contact you via email.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Shipping Rates & Delivery Times</h2>
        <p>
          Shipping charges for your order will be calculated and displayed at checkout. We offer the following shipping options:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Standard Shipping (5-7 business days):</strong> Free for orders over $75, otherwise $5.99</li>
          <li><strong>Express Shipping (2-3 business days):</strong> $12.99</li>
          <li><strong>Overnight Shipping (1 business day):</strong> $24.99</li>
        </ul>
        <p>
          Delivery delays can occasionally occur due to carrier delays, inclement weather, or other situations beyond our control.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Shipment Confirmation & Order Tracking</h2>
        <p>
          You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
          The tracking number will be active within 24 hours.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">International Shipping</h2>
        <p>
          We currently ship to the following countries: Canada, United Kingdom, Australia, and New Zealand.
          International shipping rates are calculated at checkout based on shipping address and order weight.
        </p>
        <p className="mt-4">
          Please note that international orders may be subject to import duties and taxes, which are levied once
          a shipment reaches your country. Additional charges for customs clearance must be paid by the recipient.
          Chitra has no control over these charges and cannot predict what they may be.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Damages</h2>
        <p>
          Chitra is not liable for any products damaged or lost during shipping. If you received your order damaged,
          please contact the shipment carrier to file a claim.
          Please save all packaging materials and damaged goods before filing a claim.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Local Pickup</h2>
        <p>
          We offer local pickup at our store location for customers in the area. Select "Local Pickup" at checkout
          and we'll contact you when your order is ready for pickup.
        </p>

        <h2 className="text-xl font-medium mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about our Shipping Policy, please contact us at shipping@chitra.com.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
