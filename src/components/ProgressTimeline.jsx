import React, { useState } from 'react';
import { Calendar, CheckCircle, MessageSquare, Lightbulb, Search, Filter } from 'lucide-react';

export default function ProgressTimeline({ sessions }) {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredSessions = sessions.filter(session => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      (session.date && session.date.toLowerCase().includes(q)) ||
      (session.result && session.result.toLowerCase().includes(q)) ||
      (session.teacherComment && session.teacherComment.toLowerCase().includes(q)) ||
      (session.teacherSuggestion && session.teacherSuggestion.toLowerCase().includes(q)) ||
      (session.progressId && session.progressId.toLowerCase().includes(q))
    );
  });

  const getResultBadgeClass = (resultText) => {
    if (!resultText) return 'badge-neutral';
    const text = resultText.toLowerCase();
    if (text.includes('xuất sắc') || text.includes('giỏi') || text.includes('10') || text.includes('9')) {
      return 'badge-success';
    }
    if (text.includes('đạt') || text.includes('khá') || text.includes('8') || text.includes('7')) {
      return 'badge-info';
    }
    if (text.includes('cố gắng') || text.includes('chưa đạt') || text.includes('yếu') || text.includes('lưu ý')) {
      return 'badge-warning';
    }
    return 'badge-neutral';
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      
      {/* Title Bar & Inner Search Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            Nhật Ký & Tiến Độ Học Tập <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>({sessions.length} buổi)</span>
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Chi tiết các buổi học, kết quả đánh giá và nhận xét từ giáo viên hướng dẫn
          </p>
        </div>

        {/* Filter Input */}
        <div className="no-print" style={{ minWidth: '240px' }}>
          <div className="input-group">
            <Filter className="input-icon" size={16} />
            <input
              type="text"
              className="input-field"
              placeholder="Lọc ngày / kết quả..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{ height: '38px', fontSize: '0.875rem', paddingLeft: '38px' }}
            />
          </div>
        </div>
      </div>

      {/* Timeline List */}
      {filteredSessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Search size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontWeight: 600 }}>Không tìm thấy buổi học nào phù hợp với từ khóa lọc "{filterQuery}".</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          
          {/* Vertical Timeline Line */}
          <div style={{
            position: 'absolute',
            top: '12px',
            bottom: '12px',
            left: '7px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), rgba(255,255,255,0.05))',
            borderRadius: '2px'
          }} />

          {filteredSessions.map((session, index) => {
            const badgeClass = getResultBadgeClass(session.result);
            return (
              <div 
                key={session.progressId || index} 
                style={{ 
                  position: 'relative', 
                  marginBottom: index === filteredSessions.length - 1 ? 0 : '32px' 
                }}
              >
                {/* Timeline Dot Node */}
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '4px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '3px solid var(--accent-primary)',
                  boxShadow: '0 0 10px var(--accent-glow)'
                }} />

                {/* Session Card Box */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  transition: 'all 0.2s ease'
                }}>
                  
                  {/* Card Header: Date, ID, Grade Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        fontWeight: 700, 
                        fontSize: '1rem', 
                        color: 'var(--text-primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <Calendar size={16} color="var(--accent-primary)" />
                        Ngày học: {session.date}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                        Mã: {session.progressId}
                      </span>
                    </div>

                    <span className={`badge ${badgeClass}`}>
                      <CheckCircle size={14} />
                      {session.result}
                    </span>
                  </div>

                  {/* Teacher Feedback Section */}
                  <div style={{ marginBottom: '12px', background: 'rgba(0, 0, 0, 0.15)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>
                      <MessageSquare size={15} />
                      <span>Nhận xét giáo viên:</span>
                    </div>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {session.teacherComment || 'Chưa có ghi nhận'}
                    </p>
                  </div>

                  {/* Teacher Recommendation Section */}
                  {session.teacherSuggestion && (
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--status-warning)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--status-warning)', marginBottom: '4px' }}>
                        <Lightbulb size={15} />
                        <span>Đề xuất & Bài tập luyện thêm:</span>
                      </div>
                      <p style={{ fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {session.teacherSuggestion}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
