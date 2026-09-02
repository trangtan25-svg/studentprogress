import React from 'react';
import { User, Phone, MapPin, BookOpen, Calendar, Award, Printer, Share2 } from 'lucide-react';

export default function StudentCard({ student }) {
  if (!student) return null;

  const totalSessions = student.sessions.length;
  const latestSession = student.sessions[0];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Tiến độ học tập: ${student.studentName}`,
        text: `Tra cứu tiến độ học tập học viên ${student.studentName} - Mã HV: ${student.studentId}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết trang tra cứu vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '28px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Background Accent Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'var(--accent-gradient)',
        opacity: 0.12,
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        
        <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
          {/* Avatar Icon */}
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            background: 'var(--accent-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: 'var(--shadow-accent)',
            flexShrink: 0
          }}>
            {student.studentName.charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{student.studentName}</h3>
              <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>
                Mã HV: {student.studentId}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="var(--accent-primary)" />
                {student.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--status-warning)" />
                {student.branch}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleShare} title="Chia sẻ thông tin tra cứu">
            <Share2 size={16} />
            <span>Chia sẻ</span>
          </button>
          <button className="btn btn-primary" onClick={handlePrint} title="In báo cáo tiến độ học viên">
            <Printer size={16} />
            <span>In kết quả</span>
          </button>
        </div>

      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }} />

      {/* Course & Progress Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
            <BookOpen size={16} color="var(--accent-primary)" />
            <span>Môn học / Loại hình</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {student.course}
          </p>
        </div>

        <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
            <Award size={16} color="var(--status-success)" />
            <span>Số buổi đã học</span>
          </div>
          <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--status-success)' }}>
            {totalSessions} Buổi
          </p>
        </div>

        <div style={{ padding: '14px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
            <Calendar size={16} color="var(--status-warning)" />
            <span>Buổi học mới nhất</span>
          </div>
          <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            {latestSession ? latestSession.date : 'Chưa cập nhật'}
          </p>
        </div>

      </div>

    </div>
  );
}
