import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, ExternalLink, Save, RefreshCw } from 'lucide-react';
import { getScriptUrl } from '../services/googleSheetService';

export default function ApiSettingsModal({ isOpen, onClose, onSaveSuccess }) {
  const [urlInput, setUrlInput] = useState(getScriptUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanUrl = urlInput.trim();
    localStorage.setItem('VITE_GOOGLE_SCRIPT_URL', cleanUrl);
    setTestResult({
      success: true,
      message: 'Đã lưu cấu hình Google Apps Script Web App URL!'
    });
    setTimeout(() => {
      onSaveSuccess();
      onClose();
    }, 1000);
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập URL trước khi kiểm tra kết nối.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const testEndpoint = `${urlInput.trim()}?sheet=tracuu`;
      const res = await fetch(testEndpoint, { method: 'GET', mode: 'cors' });
      const json = await res.json();

      if (json.status === 'success') {
        const count = Array.isArray(json.data) ? json.data.length : 0;
        setTestResult({
          success: true,
          message: `Kết nối thành công! Đọc được ${count} dòng dữ liệu từ sheet "tracuu".`
        });
      } else {
        setTestResult({
          success: false,
          message: `Phản hồi lỗi từ Google Apps Script: ${json.message || 'Lỗi không xác định'}`
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Không thể kết nối đến Web App URL (${err.message}). Kiểm tra lại quyền "Anyone" (Mọi người) khi triển khai Apps Script.`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleUseDemo = () => {
    localStorage.removeItem('VITE_GOOGLE_SCRIPT_URL');
    setUrlInput('');
    setTestResult({
      success: true,
      message: 'Đã chuyển về chế độ Dữ Liệu Demo Mẫu!'
    });
    setTimeout(() => {
      onSaveSuccess();
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{ maxWidth: '640px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={24} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cấu Hình Kết Nối Google Sheets</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Info Guide */}
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.875rem', lineHeight: 1.5 }}>
          <p style={{ fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px' }}>
            💡 Hướng dẫn lấy Web App URL từ Google Apps Script:
          </p>
          <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>Trong Google Sheet, chọn <strong>Tiện ích mở rộng &gt; Apps Script</strong>.</li>
            <li>Dán mã <code>code.gs</code> của bạn vào và bấm <strong>Lưu</strong>.</li>
            <li>Bấm <strong>Triển khai (Deploy) &gt; Triển khai mới (New deployment)</strong>.</li>
            <li>Chọn loại <strong>Ứng dụng web (Web app)</strong>. Thực thi: <em>Tôi</em>, Quyền truy cập: <strong>Mọi người (Anyone)</strong>.</li>
            <li>Sao chép <strong>URL ứng dụng web</strong> thu được và dán vào ô dưới đây!</li>
          </ol>
        </div>

        {/* Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Google Apps Script Web App URL:
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ paddingLeft: '16px', fontSize: '0.9rem' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Lưu ý trên Vercel: Bạn có thể đặt tên biến môi trường là <code>VITE_GOOGLE_SCRIPT_URL</code> trong mục Project Settings &gt; Environment Variables.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '20px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: testResult.success ? 'var(--status-success-bg)' : 'rgba(239, 68, 68, 0.15)',
            color: testResult.success ? 'var(--status-success)' : '#ef4444',
            border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {testResult.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleUseDemo} style={{ fontSize: '0.85rem' }}>
            Dùng dữ liệu Demo
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleTestConnection} 
              disabled={testing}
              style={{ fontSize: '0.875rem' }}
            >
              <RefreshCw size={16} className={testing ? 'spin' : ''} />
              <span>{testing ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
            </button>

            <button className="btn btn-primary" onClick={handleSave} style={{ fontSize: '0.875rem' }}>
              <Save size={16} />
              <span>Lưu cấu hình</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
