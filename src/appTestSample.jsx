// src/App.jsx
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const App = () => {
  const [amount, setAmount] = useState(''); // số tiền nhập
  const [payment, setPayment] = useState({ qrCode: null, checkoutUrl: null });
  const [loading, setLoading] = useState(false);

  const handlePaymentClick = async () => {
    // validate input
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://online-payment-qr-code.vercel.app/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: Date.now().toString(), 
          description: `Test payment ${amount} VND`,
          amount: Number(amount)
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.code === '00') {
        setPayment({ qrCode: data.data.qrCode, checkoutUrl: data.data.checkoutUrl });
      } else {
        alert('Tạo giao dịch thất bại: ' + data.desc);
      }

    } catch (err) {
      console.error(err);
      alert('Lỗi khi tạo giao dịch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Nhập số tiền để thanh toán</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Nhập số tiền (VND)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: '10px', width: '200px', marginRight: '10px' }}
        />
        <button
          onClick={handlePaymentClick}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Thanh toán
        </button>
      </div>

      {loading && <p>Đang tạo giao dịch...</p>}

      {payment.qrCode && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Quét QR code để thanh toán</h3>
          <QRCodeCanvas
            value={payment.qrCode}
            size={256}
            level="H"
            includeMargin={true}
          />
          <p style={{ marginTop: '10px' }}>
            Hoặc{' '}
            <a href={payment.checkoutUrl} target="_blank" rel="noopener noreferrer">
              Thanh toán trực tiếp
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;