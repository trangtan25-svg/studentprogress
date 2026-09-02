import React from 'react';
import { GraduationCap, Moon, Sun } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="glass-card no-print" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
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
              Tra Cứu <span className="gradient-text">Học Viên</span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Cổng Thông Tin Tiến Độ Học Tập
            </p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-icon" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
          </button>

        </div>

      </div>
    </header>
  );
}
