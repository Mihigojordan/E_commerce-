/* eslint-disable prefer-const */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';

export default function PaymentStatusPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'timeout'>('processing');
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const txRef = query.get('OrderMerchantReference');

  useEffect(() => {
    if (!txRef) return;

    let interval: number; // ✅ browser interval ID is a number
    const startTime = Date.now();
    const TIMEOUT = 2 * 60 * 1000; // 2 minutes

    const checkStatus = async () => {
      try {
        const res = await api.get(`/payments/status/${txRef}`);
        const data = res.data;

        if (data.status === 'SUCCESSFUL') {
          setStatus('success');
          clearInterval(interval);
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          clearInterval(interval);
        } else if (Date.now() - startTime > TIMEOUT) {
          setStatus('timeout');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching payment status', err);
      }
    };

    interval = window.setInterval(checkStatus, 3000);
    checkStatus(); // run immediately on mount

    return () => clearInterval(interval);
  }, [txRef]);

  return (
    <div className="payment-status">
      {status === 'processing' && <p>Payment is processing...</p>}
      {status === 'success' && <p>Payment Successful! 🎉</p>}
      {status === 'failed' && <p>Payment Failed ❌</p>}
      {status === 'timeout' && <p>Payment status could not be confirmed. Please contact support.</p>}
    </div>
  );
}
