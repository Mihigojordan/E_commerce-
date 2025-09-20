import React from 'react';

function AdvertismentBanner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#e6f3f5', borderRadius: '10px' }}>
      {/* Left Banner */}
      <div style={{ flex: 1, padding: '20px', textAlign: 'left' }}>
        <h2 style={{ color: '#2e7d32' }}>Deal of the Day.</h2>
        <p style={{ color: '#666' }}>Limited quantities.</p>
        <p style={{ fontWeight: 'bold' }}>Summer Collection New Mordern Design</p>
        <p style={{ color: '#d32f2f' }}>$139.00 <del>$160.99</del></p>
        <p style={{ color: '#2e7d32' }}>Hurry Up! Offer End In:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>00</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>00</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>00</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>00</span>
        </div>
        <p>DAYS HOURS MINS SEC</p>
        <button style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Shop Now →</button>
      </div>
      {/* Right Banner */}
      <div style={{ flex: 1, padding: '20px', textAlign: 'left' }}>
        <h2 style={{ color: '#2e7d32' }}>Men Clothing</h2>
        <p style={{ color: '#666' }}>Shirt & Bag</p>
        <p style={{ fontWeight: 'bold' }}>Try something new on vacation</p>
        <p style={{ color: '#d32f2f' }}>$178.00 <del>$256.99</del></p>
        <p style={{ color: '#2e7d32' }}>Hurry Up! Offer End In:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>03</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>08</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>16</span>
          <span style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>38</span>
        </div>
        <p>DAYS HOURS MINS SEC</p>
        <button style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Shop Now →</button>
      </div>
    </div>
  );
}

export default AdvertismentBanner;