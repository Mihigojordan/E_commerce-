import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PaymentStatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const status = query.get('status');

  React.useEffect(() => {
    if (status === 'success') {
      Swal.fire({
        title: 'Payment Successful 🎉',
        text: 'Your order has been confirmed.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false,
      }).then(() => navigate('/orders'));
    }

    if (status === 'failed') {
      Swal.fire({
        title: 'Payment Failed ❌',
        text: 'Payment could not be completed. Please try again.',
        icon: 'error',
        confirmButtonText: 'Back to Cart',
      }).then(() => navigate('/cart'));
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600 text-lg">
        Processing payment, please wait...
      </p>
    </div>
  );
};

export default PaymentStatusPage;
