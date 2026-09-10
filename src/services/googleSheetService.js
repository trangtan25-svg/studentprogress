/**
 * Google Sheet API Integration Service for Student Progress Lookup
 * Ultra-Fast Single Request Architecture + 100% Robust Multi-Field Search (SĐT, Mã HV, Họ và tên)
 */

export const DEFAULT_SCRIPT_URL = '';

const CACHE_KEY = 'TRACUU_SINGLE_CACHE_V5';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute fast client cache

// Global in-memory cache
let memoryCache = null;
let memoryCacheTimestamp = 0;
let inFlightPromise = null;

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
  if (str === undefined || str === null) return '';
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
 * Fetch records from sheet 'tracuu' in 1 single fast HTTP request with client caching
 */
export async function fetchTraCuuData(forceRefresh = false) {
  const url = getScriptUrl();

  if (!url) {
    return { isMock: true, data: MOCK_TRACUU_DATA };
  }

  const now = Date.now();

  // 1. Check in-memory cache (0ms instant response)
  if (!forceRefresh && memoryCache && (now - memoryCacheTimestamp < CACHE_TTL_MS)) {
    return { isMock: false, data: memoryCache, cached: true };
  }

  // 2. Check Session Storage Cache
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (now - timestamp < CACHE_TTL_MS) {
          memoryCache = data;
          memoryCacheTimestamp = timestamp;
          return { isMock: false, data, cached: true };
        }
      }
    } catch (e) {}
  }

  // 3. Deduplicate in-flight requests
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    const fetchUrl = `${url}?sheet=tracuu`;

    try {
      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      let extractedData = null;

      if (json.status === 'success' && Array.isArray(json.data)) {
        extractedData = json.data;
      } else if (json.data && json.data.traCuuItems) {
        extractedData = json.data.traCuuItems;
      }

      if (extractedData) {
        memoryCache = extractedData;
        memoryCacheTimestamp = Date.now();
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: memoryCacheTimestamp,
            data: extractedData
          }));
        } catch (e) {}

        return { isMock: false, data: extractedData };
      } else {
        throw new Error(json.message || 'Dữ liệu không hợp lệ từ Google Sheets');
      }
    } catch (err) {
      inFlightPromise = null;
      throw err;
    }
  })();

  try {
    const result = await inFlightPromise;
    inFlightPromise = null;
    return result;
  } catch (err) {
    inFlightPromise = null;
    throw err;
  }
}

/**
 * Helper to clean and format dates matching Google Sheets data in Vietnam timezone (ICT / UTC+7).
 * Converts ISO UTC timestamps (e.g., 2026-08-24T17:00:00.000Z) back to local Vietnam dates (25/08/2026)
 * and strips out any unwanted UTC / time strings.
 */
export function formatDateForDisplay(dateVal) {
  if (dateVal === undefined || dateVal === null) return 'Chưa ghi nhận';
  const str = String(dateVal).trim();
  if (!str) return 'Chưa ghi nhận';

  // 1. Check if string matches plain DD/MM/YYYY or D/M/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // 2. Check if string matches plain YYYY-MM-DD or YYYY/MM/DD without time component
  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  // 3. For ISO timestamps (e.g. 2026-08-24T17:00:00.000Z) or strings containing T/Z/GMT
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    try {
      // Force Vietnam Timezone (Asia/Ho_Chi_Minh, GMT+7)
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const parts = formatter.formatToParts(d);
      const day = parts.find(p => p.type === 'day')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const year = parts.find(p => p.type === 'year')?.value;

      if (day && month && year) {
        return `${day}/${month}/${year}`;
      }
    } catch (e) {
      // Fallback if Intl is not available
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  // 4. Fallback: Return original trimmed string
  return str;
}

/**
 * Filter student records by query (Phone, Student Code, OR Full Name)
 * Uses 100% resilient dynamic key matching for all 3 fields.
 */
export function filterStudentRecords(allData, query) {
  if (!query || query.trim() === '') return [];

  const normQuery = normalizeStr(query);

  return allData.filter(item => {
    let sdt = '';
    let mahv = '';
    let hoten = '';

    // Dynamic key matching to handle column headers regardless of accents/spaces/case
    for (const k in item) {
      const normK = normalizeStr(k);
      if (normK.includes('sodienthoai') || normK === 'sdt' || normK === 'phone') {
        sdt = normalizeStr(item[k]);
      } else if (normK.includes('mahocvien') || normK === 'mahv' || normK === 'studentid') {
        mahv = normalizeStr(item[k]);
      } else if (normK.includes('hovaten') || normK === 'hoten' || normK === 'studentname') {
        hoten = normalizeStr(item[k]);
      }
    }

    // Direct key fallback
    if (!sdt) sdt = normalizeStr(item['số điện thoại'] || item['Số điện thoại'] || item['sdt']);
    if (!mahv) mahv = normalizeStr(item['Mã học viên'] || item['Mã HV']);
    if (!hoten) hoten = normalizeStr(item['Họ và tên'] || item['Họ và tên']);

    // Check if query matches ANY of the 3 fields
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
    const rawDate = item['Ngày đi học'] || item['Ngày học'] || item['Ngày'] || '';
    const displayDate = formatDateForDisplay(rawDate);

    // Calculate numeric timestamp for accurate sorting
    let sortTimestamp = 0;
    if (rawDate) {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        sortTimestamp = parsedDate.getTime();
      } else {
        const dmyMatch = String(rawDate).match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (dmyMatch) {
          const [, d, m, y] = dmyMatch;
          sortTimestamp = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`).getTime() || 0;
        }
      }
    }
    
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
      date: displayDate,
      rawDate: rawDate,
      sortTimestamp: sortTimestamp,
      result: item['Kết quả buổi học'] || 'Chưa đánh giá',
      teacherComment: item['Nhận xét giáo viên'] || 'Không có nhận xét',
      teacherSuggestion: item['Đề xuất giáo viên'] || 'Không có đề xuất',
      rawItem: item
    });
  });

  // Sort sessions by date descending (newest first)
  Object.values(studentMap).forEach(student => {
    student.sessions.sort((a, b) => b.sortTimestamp - a.sortTimestamp);
  });

  return Object.values(studentMap);
}

