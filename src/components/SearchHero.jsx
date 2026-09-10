import React from 'react';
import { Search, X, RotateCw } from 'lucide-react';

export default function SearchHero({ searchInput, setSearchInput, onSearch, onRefresh, isSearching }) {
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="search-container no-print" style={{ textAlign: 'center', padding: '48px 20px 32px 20px', maxWidth: '840px', margin: '0 auto' }}>
      
      {/* Main Title */}
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px', lineHeight: 1.2 }}>
        Tra Cứu <span className="gradient-text">Học Viên</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '620px', margin: '0 auto 32px auto' }}>
        Nhập số điện thoại, mã học viên hoặc họ tên để xem thông tin chi tiết nhật ký các buổi học, kết quả đánh giá và nhận xét.
      </p>

      {/* Search Input Box */}
      <div className="glass-card" style={{ padding: '12px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <Search className="input-icon" size={22} />
            <input
              type="text"
              className="input-field"
              placeholder="Nhập số điện thoại, mã học viên hoặc họ tên..."
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

          {/* Refresh Button */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            disabled={isSearching}
            title="Làm mới dữ liệu mới nhất từ Google Sheets"
            aria-label="Làm mới dữ liệu"
            style={{ height: '54px', width: '54px', flexShrink: 0 }}
          >
            <RotateCw size={20} className={isSearching ? 'spin' : ''} />
          </button>

          {/* Search Button */}
          <button
            className="btn btn-primary"
            onClick={() => onSearch()}
            disabled={isSearching}
            style={{ height: '54px', padding: '0 28px', fontSize: '1rem', flexShrink: 0 }}
          >
            {isSearching ? 'Đang tìm...' : 'Tra cứu ngay'}
          </button>
        </div>

      </div>

    </section>
  );
}
