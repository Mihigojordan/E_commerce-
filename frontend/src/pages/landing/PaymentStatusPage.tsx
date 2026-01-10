import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api'; // import your Axios instance

export default function PaymentStatusPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const txRef = query.get('OrderMerchantReference'); // Pesapal passes this

  useEffect(() => {
    if (!txRef) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/payments/status/${txRef}`);
        const data = res.data;

        if (data.status === 'SUCCESSFUL') {
          setStatus('success');
          clearInterval(interval);
        } else if (data.status === 'FAILED') {
          setStatus('failed');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching payment status', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [txRef]);

  return (
    <div className="payment-status">
      {status === 'processing' && <p>Payment is processing...</p>}
      {status === 'success' && <p>Payment Successful! 🎉</p>}
      {status === 'failed' && <p>Payment Failed ❌</p>}
    </div>
  );
}
