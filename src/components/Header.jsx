import React from 'react';
import { GraduationCap, Moon, Sun, Settings, Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Header({ theme, onToggleTheme, onOpenSettings, isMock, scriptUrl }) {
  return (
    <header className="glass-card no-print" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '46px', 
            height: '46px', 
            borderRadius: '14px', 
            background: 'var(--accent-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: 'var(--shadow-accent)'
          }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Student<span className="gradient-text">Progress</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Cổng Tra Cứu Tiến Độ Học Viên
            </p>
          </div>
        </div>

        {/* Database Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Connection Indicator */}
          <div 
            onClick={onOpenSettings}
            title={scriptUrl ? `Kết nối Google Sheets: ${scriptUrl}` : 'Chưa nhập Web App URL (Đang dùng dữ liệu Demo)'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '6px 14px', 
              borderRadius: 'var(--radius-full)', 
              background: isMock ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${isMock ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              cursor: 'pointer',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: isMock ? 'var(--status-warning)' : 'var(--status-success)',
              transition: 'all 0.2s ease'
            }}
          >
            <Database size={15} />
            <span>{isMock ? 'Dữ liệu Demo' : 'Google Sheets Connected'}</span>
            {isMock ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          </div>

          {/* Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
          </button>

          {/* Settings Button */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenSettings}
            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
          >
            <Settings size={18} />
            <span>Cấu hình API</span>
          </button>

        </div>

      </div>
    </header>
  );
}
