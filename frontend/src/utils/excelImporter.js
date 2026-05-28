import * as XLSX from 'xlsx';

/**
 * Xuất template Excel cho nhập sản phẩm
 */
export const generateExcelTemplate = () => {
  const headers = [
    'idsp',
    'id cate',
    'idnsx',
    'tensp',
    'chitietsp',
    'gianiemyet',
    'baohanh',
    'soluong',
    'hinhAnh (JSON)',
    'thongsokythuat (JSON)'
  ];

  const sampleData = [
    [
      'SP001',
      '1',
      '1',
      'Bàn phím cơ',
      'Bàn phím cơ chuyên gaming',
      '1500000',
      '12',
      '50',
      '["https://example.com/img1.jpg", "https://example.com/img2.jpg"]',
      '{"Hãng":"Corsair","Switch":"Cherry MX","RGB":"Có"}'
    ]
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
  ws['!cols'] = [
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 40 },
    { wch: 40 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sản phẩm');
  XLSX.writeFile(wb, 'template_nhap_sanpham.xlsx');
};

/**
 * Đọc file Excel và parse dữ liệu sản phẩm
 * @param {File} file - File Excel được chọn
 * @returns {Promise<Array>} - Mảng các sản phẩm được parse
 */
export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        const products = rawData
          .map((row, index) => {
            try {
              // Normalize column names (lowercase with no spaces)
              const normalizedRow = {};
              for (const key in row) {
                const normalizedKey = key
                  .toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/[^a-z0-9]/g, '');

                if (normalizedKey.includes('hinhanh')) {
                  normalizedRow.hinhanh = row[key];
                } else if (normalizedKey.includes('thongsokythuat')) {
                  normalizedRow.thongsokythuat = row[key];
                } else {
                  normalizedRow[normalizedKey] = row[key];
                }
              }

              // Parse image array
              let imageLinks = [];
              if (normalizedRow.hinhanh) {
                if (typeof normalizedRow.hinhanh === 'string') {
                  try {
                    imageLinks = JSON.parse(normalizedRow.hinhanh);
                    if (!Array.isArray(imageLinks)) {
                      imageLinks = [normalizedRow.hinhanh];
                    }
                  } catch {
                    imageLinks = [normalizedRow.hinhanh];
                  }
                } else if (Array.isArray(normalizedRow.hinhanh)) {
                  imageLinks = normalizedRow.hinhanh;
                }
              }

              // Parse technical specs
              let specs = [];
              if (normalizedRow.thongsokythuat) {
                if (typeof normalizedRow.thongsokythuat === 'string') {
                  try {
                    const specsObj = JSON.parse(normalizedRow.thongsokythuat);
                    specs = Object.entries(specsObj).map(([key, value]) => ({
                      key,
                      value: String(value)
                    }));
                  } catch {
                    console.warn(`Row ${index + 2}: Không thể parse thông số kỹ thuật`);
                  }
                } else if (typeof normalizedRow.thongsokythuat === 'object') {
                  specs = Object.entries(normalizedRow.thongsokythuat).map(([key, value]) => ({
                    key,
                    value: String(value)
                  }));
                }
              }

              return {
                idSP: normalizedRow.idsp?.toString().trim() || '',
                IdCate: normalizedRow.idcate?.toString().trim() || '',
                IdNSX: normalizedRow.idnsx?.toString().trim() || '',
                tenSP: normalizedRow.tensp?.toString().trim() || '',
                chiTietSP: normalizedRow.chitietsp?.toString().trim() || '',
                gianiemyet: parseFloat(normalizedRow.gianiemyet) || 0,
                baoHanh: normalizedRow.baohanh?.toString().trim() || '12 tháng',
                soLuong: parseInt(normalizedRow.soluong) || 0,
                giaKM: 0,
                tinhTrang: 'Mới',
                hinhAnh: imageLinks.filter(link => link && typeof link === 'string'),
                thongsokythuat: specs,
                rowIndex: index + 2
              };
            } catch (err) {
              console.error(`Lỗi parse row ${index + 2}:`, err);
              reject(new Error(`Lỗi ở hàng ${index + 2}: ${err.message}`));
            }
          })
          .filter(product => product.idSP);

        resolve(products);
      } catch (err) {
        reject(new Error(`Lỗi đọc file Excel: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Lỗi đọc file'));
    };

    reader.readAsArrayBuffer(file);
  });
};
