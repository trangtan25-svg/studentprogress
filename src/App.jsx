import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import StudentCard from './components/StudentCard';
import ProgressTimeline from './components/ProgressTimeline';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';
import { 
  fetchTraCuuData, 
  filterStudentRecords, 
  groupRecordsByStudent 
} from './services/googleSheetService';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Update root HTML theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Pre-fetch sheet data silently on page load for INSTANT (0ms) search experience
  useEffect(() => {
    fetchTraCuuData().catch(() => {});
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Perform search query
  const handleSearch = async (overrideQuery) => {
    const query = overrideQuery !== undefined ? overrideQuery : searchInput;
    if (!query || query.trim() === '') {
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    try {
      // Fast fetch with client cache fallback
      const result = await fetchTraCuuData();
      const rawMatchedRecords = filterStudentRecords(result.data, query);
      const groupedStudents = groupRecordsByStudent(rawMatchedRecords);

      setStudents(groupedStudents);
      setSelectedStudentIdx(0);
      setHasSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setErrorMessage(err.message || 'Có lỗi xảy ra khi tải dữ liệu từ Google Sheets. Vui lòng thử lại.');
      setStudents([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const currentStudent = students[selectedStudentIdx] || null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Background Glow Mesh */}
      <div className="bg-mesh">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
      </div>

      {/* Header Bar */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        
        {/* Search Hero Box */}
        <SearchHero
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearch}
          isSearching={isSearching}
        />

        {/* Error Notification */}
        {errorMessage && (
          <div style={{ maxWidth: '840px', margin: '0 auto 24px auto', padding: '14px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
            🚨 {errorMessage}
          </div>
        )}

        {/* Results Container */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          
          {isSearching ? (
            <LoadingSkeleton />
          ) : !hasSearched ? (
            <EmptyState isInitial={true} />
          ) : students.length === 0 ? (
            <EmptyState query={searchInput} isInitial={false} />
          ) : (
            <div>
              
              {/* Multi-Student Tab Selector (If 1 phone has multiple records/courses) */}
              {students.length > 1 && (
                <div className="no-print glass-card" style={{ padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Tìm thấy {students.length} hồ sơ cho từ khóa này:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {students.map((st, idx) => (
                      <button
                        key={st.studentId + idx}
                        onClick={() => setSelectedStudentIdx(idx)}
                        className={`btn ${selectedStudentIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      >
                        {st.studentName} ({st.studentId})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Overview Card */}
              {currentStudent && <StudentCard student={currentStudent} />}

              {/* Learning Progress Timeline */}
              {currentStudent && <ProgressTimeline sessions={currentStudent.sessions} />}

            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="no-print" style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p>© {new Date().getFullYear()} Cổng Tra Cứu Học Viên.</p>
        </div>
      </footer>

    </div>
  );
}
