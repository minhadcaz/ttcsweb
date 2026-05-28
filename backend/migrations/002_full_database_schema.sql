-- Tạo database cho hệ thống linh kiện máy tính
CREATE DATABASE linhkienmaytinh;
\c linhkienmaytinh;

-- Bảng Loại Sản Phẩm
CREATE TABLE LoaiSanPham (
    IdCate VARCHAR(50) PRIMARY KEY,
    nameCate VARCHAR(100) NOT NULL UNIQUE
);

-- Bảng Nhà Sản Xuất
CREATE TABLE NhaSanXuat (
    IdNSX VARCHAR(50) PRIMARY KEY,
    TenNSX VARCHAR(150) NOT NULL,
    QuocGia TEXT,
    Website VARCHAR(100)
);

-- Bảng Nhà Cung Cấp
CREATE TABLE NhaCungCap (
    IdNCC VARCHAR(50) PRIMARY KEY,
    TenNCC VARCHAR(150) NOT NULL,
    SDT VARCHAR(20),
    DiaChi TEXT
);

-- Bảng Users
CREATE TABLE Users (
    idUsers VARCHAR(50) PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    tinhTrang VARCHAR(50) DEFAULT 'Hoat dong',
    roles VARCHAR(20) DEFAULT 'customer',
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Hoatdonggannhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role_hop_le CHECK (roles IN ('customer', 'admin', 'employee')),
    CONSTRAINT check_tinh_trang_hop_le CHECK (tinhTrang IN ('Khong hoat dong','Hoat dong'))
);

-- Bảng Sản Phẩm
CREATE TABLE SanPham (
    idSP VARCHAR(50) PRIMARY KEY,
    IdCate VARCHAR(50) REFERENCES LoaiSanPham(IdCate),
    IdNSX VARCHAR(50) REFERENCES NhaSanXuat(IdNSX),
    tenSP VARCHAR(255) NOT NULL,
    chiTietSP TEXT,
    gianiemyet DECIMAL(12,2) NOT NULL CHECK (gianiemyet >= 0),
    tinhTrang VARCHAR(50),
    baoHanh VARCHAR(50),
    soLuong INT DEFAULT 0 CHECK (soLuong >= 0),
    giaKM DECIMAL(12,2),
    hinhAnh JSONB,
    thongsokythuat JSONB
);

-- Bảng Tồn Kho
CREATE TABLE TonKho (
    idTK VARCHAR(50) PRIMARY KEY,
    idSP VARCHAR(50) REFERENCES SanPham(idSP),
    donVi VARCHAR(50),
    SoLuong INT
);

-- Bảng Chi Tiết Tồn Kho
CREATE TABLE ChiTietTonKho (
    idTK VARCHAR(50) REFERENCES TonKho(idTK),
    maLinhKien VARCHAR(50) PRIMARY KEY,
    GhiChu TEXT
);

-- Bảng Nhân Viên
CREATE TABLE NhanVien (
    IdNV VARCHAR(50) PRIMARY KEY,
    idUsers VARCHAR(50) UNIQUE REFERENCES Users(idUsers),
    TenNV VARCHAR(100) NOT NULL,
    gioiTinh VARCHAR(10),
    ngaySinh DATE,
    diaChi TEXT,
    PhoneNum VARCHAR(50)
);

-- Bảng Khách Hàng
CREATE TABLE KhachHang (
    IdKH VARCHAR(50) PRIMARY KEY,
    idUsers VARCHAR(50) UNIQUE REFERENCES Users(idUsers),
    TenKH VARCHAR(100) NOT NULL,
    DiaChi jsonb,
    SDT VARCHAR(20) UNIQUE NOT NULL
);

-- Bảng Hóa Đơn Bán Hàng
CREATE TABLE HoaDonBanHang (
    IdHDBH VARCHAR(50) PRIMARY KEY,
    IdKH VARCHAR(50) REFERENCES KhachHang(IdKH),
    IdNV VARCHAR(50) REFERENCES NhanVien(IdNV),
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thanhToan DECIMAL(12,2) DEFAULT 0
);

-- Bảng Chi Tiết Hóa Đơn
CREATE TABLE ChiTietHoaDon (
    IdHDBH VARCHAR(50) REFERENCES HoaDonBanHang(IdHDBH),
    idSP VARCHAR(50) REFERENCES SanPham(idSP),
    soLuongBan INT NOT NULL CHECK (soLuongBan > 0),
    donGia DECIMAL(12,2) NOT NULL,
    tienThanhToan DECIMAL(12,2),
    PRIMARY KEY (IdHDBH, idSP)
);

-- Bảng Hóa Đơn Nhập
CREATE TABLE HoaDonNhap (
    IdHDN VARCHAR(50) PRIMARY KEY,
    IdNCC VARCHAR(50) REFERENCES NhaCungCap(IdNCC),
    IdNV VARCHAR(50) REFERENCES NhanVien(IdNV),
    ngayLap TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Chi Tiết Nhập
CREATE TABLE ChiTietNhap (
    IdHDN VARCHAR(50) REFERENCES HoaDonNhap(IdHDN),
    idSP VARCHAR(50) REFERENCES SanPham(idSP),
    SLNhap INT NOT NULL CHECK (SLNhap > 0),
    donGia DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (IdHDN, idSP)
);

-- Bảng Khuyến Mãi
CREATE TABLE KhuyenMai (
    idKM VARCHAR(50) PRIMARY KEY,
    tenCTKM VARCHAR(200) NOT NULL,
    loaiGiamgia VARCHAR(50) NOT NULL,
    giaTriGiam DECIMAL(12,2) NOT NULL,
    giamToiDa DECIMAL(12,2),
    donHangToiThieu DECIMAL(12,2) DEFAULT 0,
    soLuong INT DEFAULT 0,
    ngayBatDau TIMESTAMPTZ,
    ngayKetThuc TIMESTAMPTZ,
    SanPhamApDung JSONB
);

-- Bảng Mã Giảm Giá
CREATE TABLE MaGiamGia (
    idMaGiam SERIAL PRIMARY KEY,
    idKM VARCHAR(50) REFERENCES KhuyenMai(idKM),
    code VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng Loại Giao Hàng
CREATE TABLE LoaiGiaoHang (
    idLoaiGH VARCHAR(50) PRIMARY KEY,
    tenLoaiGH VARCHAR(100) NOT NULL,
    donHangToiThieu DECIMAL(12,2) DEFAULT 0,
    phiGiaoHang DECIMAL(12,2) DEFAULT 0
);

-- Bảng Phiếu Giao Hàng
CREATE TABLE PhieuGiaoHang (
    idPhieuGH VARCHAR(50) PRIMARY KEY,
    IdHDBH VARCHAR(50) UNIQUE REFERENCES HoaDonBanHang(IdHDBH),
    idLoaiGH VARCHAR(50) REFERENCES LoaiGiaoHang(idLoaiGH),
    ngayGiao TIMESTAMP,
    nvGiaoHang VARCHAR(100),
    nguoiNhan VARCHAR(100),
    sdtNhan VARCHAR(20),
    diaChiNhan TEXT
);

-- Bảng Đánh Giá Sản Phẩm
CREATE TABLE DanhGiaSP (
    idDanhGia VARCHAR(50) PRIMARY KEY,
    idSP VARCHAR(50) REFERENCES SanPham(idSP),
    IdKH VARCHAR(50) REFERENCES KhachHang(IdKH),
    review TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5)
);

-- Bảng Bảo Hành
CREATE TABLE BaoHanh (
    IdPhieuBH VARCHAR(50) PRIMARY KEY,
    SerialNumber VARCHAR(100) NOT NULL,
    IdHDBH VARCHAR(50) REFERENCES HoaDonBanHang(IdHDBH),
    ngayKichHoat TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ngayHetHan TIMESTAMPTZ NOT NULL,
    tinhTrang VARCHAR(50) DEFAULT 'Dang bao hanh',
    ghiChu TEXT,
    CONSTRAINT check_tinh_trang CHECK(tinhTrang IN ('Con han', 'Het han', 'Dang sua chua'))
);

-- Bảng Phiếu Xuất Kho
CREATE TABLE PhieuXuatKho (
    IdXuatKho VARCHAR(50) PRIMARY KEY,
    ngayXuatKho DATE,
    IdNV VARCHAR(50) REFERENCES NhanVien(IdNV)
);

-- Bảng Chi Tiết Xuất Kho
CREATE TABLE ChiTietXuatKho (
    IdXuatKho VARCHAR(50) REFERENCES PhieuXuatKho(IdXuatKho),
    idSP VARCHAR(50) REFERENCES SanPham(idSP),
    soLuong INT DEFAULT 0,
    PRIMARY KEY (IdXuatKho, idSP)
);

-- Bảng Cấu Hình PC
CREATE TABLE CauHinhPC (
    idCauHinh VARCHAR(50) PRIMARY KEY,
    idKH VARCHAR(50) REFERENCES KhachHang(idKH),
    CauHinh JSONB
);

-- Bảng Sổ Địa Chỉ
CREATE TABLE SoDiaChi (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES Users(idUsers) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo indexes để tối ưu performance
CREATE INDEX idx_sanpham_category ON SanPham(IdCate);
CREATE INDEX idx_sanpham_nsx ON SanPham(IdNSX);
CREATE INDEX idx_hoadon_ngaytao ON HoaDonBanHang(ngayTao);
CREATE INDEX idx_hoadon_khachhang ON HoaDonBanHang(IdKH);
CREATE INDEX idx_chitiethoadon_hoadon ON ChiTietHoaDon(IdHDBH);
CREATE INDEX idx_khuyenmai_ngaybatdau ON KhuyenMai(ngayBatDau);
CREATE INDEX idx_khuyenmai_ngayketthuc ON KhuyenMai(ngayKetThuc);
CREATE INDEX idx_baohanh_serial ON BaoHanh(SerialNumber);
CREATE INDEX idx_baohanh_tinhtrang ON BaoHanh(tinhTrang);

-- Insert dữ liệu mẫu
INSERT INTO LoaiSanPham (IdCate, nameCate) VALUES
('CPU', 'CPU - Bộ vi xử lý'),
('MAIN', 'Mainboard - Bo mạch chủ'),
('RAM', 'RAM - Bộ nhớ trong'),
('VGA', 'VGA - Card màn hình'),
('SSD', 'SSD - Ổ cứng'),
('PSU', 'PSU - Nguồn máy tính'),
('CASE', 'Case - Vỏ máy tính');

INSERT INTO NhaSanXuat (IdNSX, TenNSX, QuocGia, Website) VALUES
('INTEL', 'Intel Corporation', 'USA', 'https://www.intel.com'),
('AMD', 'Advanced Micro Devices', 'USA', 'https://www.amd.com'),
('ASUS', 'ASUSTeK Computer Inc.', 'Taiwan', 'https://www.asus.com'),
('MSI', 'Micro-Star International', 'Taiwan', 'https://www.msi.com');

INSERT INTO NhaCungCap (IdNCC, TenNCC, SDT, DiaChi) VALUES
('NCC001', 'Công ty TNHH Linh Kiện ABC', '0123456789', '123 Đường ABC, Quận 1, TP.HCM'),
('NCC002', 'Công ty CP Công nghệ XYZ', '0987654321', '456 Đường XYZ, Quận 2, TP.HCM');

-- Tạo admin user
INSERT INTO Users (idUsers, userName, pass, Email, roles) VALUES
('admin001', 'admin', '$2b$10$example.hash.here', 'admin@trumlinhkien.com', 'admin');

-- Tạo nhân viên admin
INSERT INTO NhanVien (IdNV, idUsers, TenNV, gioiTinh, PhoneNum) VALUES
('NV001', 'admin001', 'Administrator', 'Nam', '0123456789');