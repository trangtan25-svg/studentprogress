/**
 * Google Sheet API Integration Service for Student Progress Lookup
 * Sheet Name: 'tracuu'
 */

// Default Fallback Google Apps Script Deployment URL (User can update in Settings Modal)
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_DEMO_WEB_APP_URL/exec';

/**
 * Get active Web App URL from localStorage or environment variable
 */
export function getScriptUrl() {
  const customUrl = localStorage.getItem('VITE_GOOGLE_SCRIPT_URL');
  if (customUrl && customUrl.trim() !== '') {
    return customUrl.trim();
  }
  if (import.meta.env.VITE_GOOGLE_SCRIPT_URL) {
    return import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  }
  return '';
}

/**
 * Helper to remove Vietnamese accents and normalize string for flexible matching
 */
export function normalizeStr(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Mock Data for instant demonstration when no Google Script URL is connected
 */
const MOCK_TRACUU_DATA = [
  {
    'Mã tiến độ': 'TD1001',
    'Mã học viên': 'HV001',
    'Chi nhánh': 'Chi nhánh 1 (Quận 1)',
    'Họ và tên': 'Nguyễn Văn Anh',
    'số điện thoại': '0901234567',
    'Môn học (loại hình)': 'Nail Art Chuyên Nghiệp',
    'Ngày đi học': '2026-08-25',
    'Kết quả buổi học': 'Xuất sắc (9.5/10)',
    'Nhận xét giáo viên': 'Học viên nắm vững kỹ thuật vẽ nét mảnh, thao tác cọ mượt mà và thực hành rất tập trung.',
    'Đề xuất giáo viên': 'Thực hành thêm mẫu vẽ hoa nổi 3D nâng cao tại nhà.'
  },
  {
    'Mã tiến độ': 'TD1002',
    'Mã học viên': 'HV001',
    'Chi nhánh': 'Chi nhánh 1 (Quận 1)',
    'Họ và tên': 'Nguyễn Văn Anh',
    'số điện thoại': '0901234567',
    'Môn học (loại hình)': 'Nail Art Chuyên Nghiệp',
    'Ngày đi học': '2026-08-28',
    'Kết quả buổi học': 'Đạt (8.0/10)',
    'Nhận xét giáo viên': 'Thực hành form móng úp chuẩn, cần chú ý đều tay khi sơn gel lớp thứ 2.',
    'Đề xuất giáo viên': 'Ôn lại các bước sấy đèn UV đúng thời gian quy định.'
  },
  {
    'Mã tiến độ': 'TD1003',
    'Mã học viên': 'HV001',
    'Chi nhánh': 'Chi nhánh 1 (Quận 1)',
    'Họ và tên': 'Nguyễn Văn Anh',
    'số điện thoại': '0901234567',
    'Môn học (loại hình)': 'Nail Art Chuyên Nghiệp',
    'Ngày đi học': '2026-09-01',
    'Kết quả buổi học': 'Xuất sắc (9.0/10)',
    'Nhận xét giáo viên': 'Phối màu ombre gel hài hòa, hoàn thành sản phẩm móng mẫu đẹp đúng thời gian.',
    'Đề xuất giáo viên': 'Sẵn sàng chuyển sang bài thi tốt nghiệp phần Nail.'
  },
  {
    'Mã tiến độ': 'TD1004',
    'Mã học viên': 'HV002',
    'Chi nhánh': 'Chi nhánh 2 (Bình Thạnh)',
    'Họ và tên': 'Trần Thị Mai',
    'số điện thoại': '0987654321',
    'Môn học (loại hình)': 'Nối Mi Volume',
    'Ngày đi học': '2026-08-26',
    'Kết quả buổi học': 'Đạt (8.5/10)',
    'Nhận xét giáo viên': 'Tạo fan mi 3D-5D khá đều, khoảng cách cắm mi cách da đầu chuẩn 0.5mm.',
    'Đề xuất giáo viên': 'Rèn luyện thêm tốc độ gắp mi bằng nhíp cong.'
  },
  {
    'Mã tiến độ': 'TD1005',
    'Mã học viên': 'HV002',
    'Chi nhánh': 'Chi nhánh 2 (Bình Thạnh)',
    'Họ và tên': 'Trần Thị Mai',
    'số điện thoại': '0987654321',
    'Môn học (loại hình)': 'Nối Mi Volume',
    'Ngày đi học': '2026-08-30',
    'Kết quả buổi học': 'Cần cố gắng (7.0/10)',
    'Nhận xét giáo viên': 'Còn bị dính chân mi lân cận, lượng keo lấy hơi nhiều làm nặng mi.',
    'Đề xuất giáo viên': 'Chú ý lau bớt keo dư trên nắp keo và tách mi kỹ trước khi đặt fan.'
  },
  {
    'Mã tiến độ': 'TD1006',
    'Mã học viên': 'HV003',
    'Chi nhánh': 'Chi nhánh 3 (Tân Bình)',
    'Họ và tên': 'Lê Hoàng Nam',
    'số điện thoại': '0912345678',
    'Môn học (loại hình)': 'Makeup Trang Điểm Tiệc',
    'Ngày đi học': '2026-08-27',
    'Kết quả buổi học': 'Xuất sắc (9.2/10)',
    'Nhận xét giáo viên': 'Kỹ thuật đánh nền mỏng nhẹ tự nhiên, tạo khối khuôn mặt thon gọn xuất sắc.',
    'Đề xuất giáo viên': 'Học thêm phong cách trang điểm mắt khói Smokey Eyes.'
  }
];

/**
 * Fetch all records from sheet 'tracuu'
 */
export async function fetchTraCuuData() {
  const url = getScriptUrl();

  // If no URL is set, return demonstration mock data with a warning flag
  if (!url) {
    console.warn('Google Script URL chưa được cấu hình. Sử dụng dữ liệu demo mẫu.');
    return {
      isMock: true,
      data: MOCK_TRACUU_DATA
    };
  }

  try {
    const fetchUrl = `${url}?sheet=tracuu`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const json = await response.json();

    if (json.status === 'success' && Array.isArray(json.data)) {
      return {
        isMock: false,
        data: json.data
      };
    } else if (json.data && json.data.traCuuItems) {
      return {
        isMock: false,
        data: json.data.traCuuItems
      };
    } else {
      throw new Error(json.message || 'Không thể đọc dữ liệu từ sheet tracuu');
    }
  } catch (err) {
    console.error('Lỗi khi fetch dữ liệu Google Sheets:', err);
    throw err;
  }
}

/**
 * Filter student records by query (Phone, Student Code, or Name)
 */
export function filterStudentRecords(allData, query) {
  if (!query || query.trim() === '') return [];

  const normQuery = normalizeStr(query);

  return allData.filter(item => {
    const sdt = normalizeStr(item['số điện thoại'] || item['Số điện thoại'] || item['sdt']);
    const mahv = normalizeStr(item['Mã học viên'] || item['Mã HV']);
    const hoten = normalizeStr(item['Họ và tên'] || item['Họ và tên'] || item['Tên học viên']);

    return sdt.includes(normQuery) || mahv.includes(normQuery) || hoten.includes(normQuery);
  });
}

/**
 * Group search results by Student ID to form individual student profiles
 */
export function groupRecordsByStudent(records) {
  const studentMap = {};

  records.forEach(item => {
    const studentId = (item['Mã học viên'] || item['Mã HV'] || 'UNKNOWN').trim();
    
    if (!studentMap[studentId]) {
      studentMap[studentId] = {
        studentId: studentId,
        studentName: item['Họ và tên'] || item['Họ và tên'] || 'Chưa cập nhật',
        phone: item['số điện thoại'] || item['Số điện thoại'] || 'Chưa cập nhật',
        branch: item['Chi nhánh'] || 'Chưa phân loại',
        course: item['Môn học (loại hình)'] || 'Chưa đăng ký môn',
        sessions: []
      };
    }

    studentMap[studentId].sessions.push({
      progressId: item['Mã tiến độ'] || 'TD-' + Math.random().toString(36).substring(2, 7),
      date: item['Ngày đi học'] || item['Ngày học'] || 'Chưa ghi nhận',
      result: item['Kết quả buổi học'] || 'Chưa đánh giá',
      teacherComment: item['Nhận xét giáo viên'] || 'Không có nhận xét',
      teacherSuggestion: item['Đề xuất giáo viên'] || 'Không có đề xuất',
      rawItem: item
    });
  });

  // Sort sessions by date descending (newest first)
  Object.values(studentMap).forEach(student => {
    student.sessions.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });

  return Object.values(studentMap);
}
