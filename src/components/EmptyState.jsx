import React from 'react';
import { SearchX, HelpCircle, ArrowUp } from 'lucide-react';

export default function EmptyState({ query, isInitial }) {
  if (isInitial) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '640px', margin: '0 auto' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.1)',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ArrowUp size={36} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
          Sẵn Sàng Tra Cứu Tiến Độ
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
          Vui lòng nhập <strong>Số điện thoại</strong> (ví dụ: <code>0901234567</code>) hoặc <strong>Mã học viên</strong> (ví dụ: <code>HV001</code>) ở khung tìm kiếm phía trên để xem kết quả.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px auto'
      }}>
        <SearchX size={36} />
      </div>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
        Không Tìm Thấy Học Viên
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 20px auto' }}>
        Không tìm thấy hồ sơ nào khớp với từ khóa <strong>"{query}"</strong> trong bảng dữ liệu sheet <code>tracuu</code>.
      </p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>
        <HelpCircle size={16} />
        <span>Gợi ý: Kiểm tra lại chính xác Số điện thoại hoặc Mã HV được cấp lúc đăng ký.</span>
      </div>
    </div>
  );
}
