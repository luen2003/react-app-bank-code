// src/App.jsx
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePaymentClick = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'https://online-payment-qr-code.vercel.app/payments',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: Date.now().toString(),
            description: `Thanh toán ${amount} VND`,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (data.code === '00') {
        // ✅ CHUYỂN TRANG THANH TOÁN TRỰC TIẾP
        window.location.href = data.data.checkoutUrl;
      } else {
        alert(data.desc || 'Tạo giao dịch thất bại');
      }
    } catch (error) {
      alert('Lỗi kết nối thanh toán');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>💳 Thanh toán</h1>
        <p className="subtitle">Nhập số tiền để thanh toán</p>

        <input
          type="number"
          placeholder="Số tiền (VND)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handlePaymentClick} disabled={loading}>
          {loading ? 'Đang chuyển...' : 'Thanh toán'}
        </button>
      </div>
    </div>
  );
};

export default App;
