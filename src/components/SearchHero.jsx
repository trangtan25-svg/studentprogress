import React from 'react';
import { Search, X, Phone, UserCheck, CreditCard, Sparkles } from 'lucide-react';

export default function SearchHero({ searchCategory, onChangeCategory, searchInput, setSearchInput, onSearch, isSearching }) {
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const setQuickQuery = (val) => {
    setSearchInput(val);
    onSearch(val);
  };

  return (
    <section className="search-container no-print" style={{ textAlign: 'center', padding: '48px 20px 32px 20px', maxWidth: '840px', margin: '0 auto' }}>
      
      {/* Badge Banner */}
      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px', 
        padding: '6px 16px', 
        borderRadius: 'var(--radius-full)', 
        background: 'rgba(99, 102, 241, 0.12)', 
        border: '1px solid rgba(99, 102, 241, 0.25)', 
        color: 'var(--accent-primary)',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '20px'
      }}>
        <Sparkles size={16} />
        <span>Đồng bộ thời gian thực từ Google Sheets (sheet "tracuu")</span>
      </div>

      {/* Main Title */}
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: 1.2 }}>
        Tra Cứu Quá Trình & Tiến Độ <span className="gradient-text">Học Viên</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '620px', margin: '0 auto 32px auto' }}>
        Nhập Số điện thoại, Mã học viên hoặc Họ tên để xem chi tiết nhật ký các buổi học, kết quả đánh giá và nhận xét từ giáo viên.
      </p>

      {/* Search Input Box */}
      <div className="glass-card" style={{ padding: '10px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Category Toggles */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onChangeCategory('sdt')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: searchCategory === 'sdt' ? 'var(--accent-gradient)' : 'transparent',
              color: searchCategory === 'sdt' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Phone size={15} />
            <span>Số điện thoại</span>
          </button>

          <button
            onClick={() => onChangeCategory('mahv')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: searchCategory === 'mahv' ? 'var(--accent-gradient)' : 'transparent',
              color: searchCategory === 'mahv' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <CreditCard size={15} />
            <span>Mã học viên</span>
          </button>

          <button
            onClick={() => onChangeCategory('hoten')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: searchCategory === 'hoten' ? 'var(--accent-gradient)' : 'transparent',
              color: searchCategory === 'hoten' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={15} />
            <span>Họ và tên</span>
          </button>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <Search className="input-icon" size={22} />
            <input
              type="text"
              className="input-field"
              placeholder={
                searchCategory === 'sdt' 
                  ? 'Ví dụ: 0901234567...' 
                  : searchCategory === 'mahv' 
                  ? 'Ví dụ: HV001...' 
                  : 'Ví dụ: Nguyễn Văn A...'
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ fontSize: '1.05rem', paddingLeft: '48px', paddingRight: searchInput ? '44px' : '18px', height: '54px' }}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onSearch()}
            disabled={isSearching}
            style={{ height: '54px', padding: '0 28px', fontSize: '1rem', flexShrink: 0 }}
          >
            {isSearching ? 'Đang tìm...' : 'Tra cứu ngay'}
          </button>
        </div>

        {/* Quick Demo Chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>Gợi ý dùng thử:</span>
          {['0901234567', 'HV001', 'Nguyễn Văn Anh', '0987654321'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuickQuery(tag)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

    </section>
  );
}
