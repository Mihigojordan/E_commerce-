import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const PaymentCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

  useEffect(() => {
    // Run only once on mount
    let called = false; // 🔒 ensure only one request
    const query = new URLSearchParams(location.search);
    const orderTrackingId = query.get('OrderTrackingId');
    const orderMerchantReference = query.get('OrderMerchantReference');

    if (!orderMerchantReference || !orderTrackingId) {
      setStatus('failed');
      return;
    }

    const triggerIPN = async () => {
      if (called) return;
      called = true;

      try {
        const res = await axios.post('https://ecommerce.abyride.com/payments/ipn', {
          OrderTrackingId: orderTrackingId,
          OrderMerchantReference: orderMerchantReference,
          Status: 'COMPLETED'
        });

        console.log('IPN response:', res.data);
        setStatus('success');

        Swal.fire({
          title: 'Payment Successful!',
          text: 'Your payment has been processed successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        setTimeout(() => navigate('/orders'), 2000);
      } catch (err) {
        console.error('Failed to trigger IPN:', err);
        setStatus('failed');

        Swal.fire({
          title: 'Payment Failed',
          text: 'Something went wrong. Please contact support.',
          icon: 'error'
        });
      }
    };

    triggerIPN();
  }, []); // ✅ empty dependency array ensures it runs once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {status === 'processing' && <p>Processing your payment...</p>}
      {status === 'success' && <p>Payment Successful! 🎉</p>}
      {status === 'failed' && <p>Payment Failed ❌</p>}
    </div>
  );
};

export default PaymentCallbackPage;
