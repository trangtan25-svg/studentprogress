import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Student Card Skeleton */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '20px' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '220px', height: '28px', marginBottom: '10px' }} />
            <div className="skeleton" style={{ width: '320px', height: '18px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: '70px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div className="skeleton" style={{ width: '260px', height: '24px', marginBottom: '24px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }} />
          <div className="skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>

    </div>
  );
}
