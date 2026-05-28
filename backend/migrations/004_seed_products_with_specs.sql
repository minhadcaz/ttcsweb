-- Seed products with detailed specifications

-- CPU: Intel Core i5 Gen 12
INSERT INTO SanPham (idsp, idcate, idnsx, tensp, chitietsp, gianiemyet, tinhtrang, baohanh, hinhanh, thongsokythuat)
VALUES (
    'cpu-intel-i5-12gen',
    '1',
    'intel1',
    'Intel Core i5-12th Gen',
    'Bộ xử lý Intel Core i5 thế hệ 12 (Alder Lake) socket LGA 1700',
    8500000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=Intel+Core+i5"]'::jsonb,
    '{"dòng_cpu": "Core i5", "thế_hệ": "Intel Core thế hệ 12", "kiến_trúc": "Alder Lake", "socket": "LGA 1700"}'::jsonb
), (
    'main-intel-z890',
    '2',
    'asus1',
    'ASUS ROG STRIX Z890',
    'Bo mạch chủ ASUS ROG STRIX Z890, ATX, LGA 1851 socket',
    12000000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=ASUS+Z890"]'::jsonb,
    '{"chipset": "Intel Z890", "socket": "LGA 1851", "kích_thước": "ATX", "wifi": "Wi-Fi 7"}'::jsonb
), (
    'ram-corsair-ddr5-64gb',
    '3',
    'corsair1',
    'Corsair Vengeance DDR5 64GB',
    'Corsair Vengeance DDR5 2x32GB 6000MHz, CL40',
    5400000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=Corsair+DDR5"]'::jsonb,
    '{"loại_ram": "DDR5", "bus_ram": "6000 MHz", "dung_lượng": "64 GB", "cas_latency": "CL40"}'::jsonb
), (
    'ssd-kingston-1tb',
    '4',
    'kingston1',
    'Kingston NVMe PCIe Gen 4.0 1TB',
    'Kingston A3000 1TB NVMe SSD, PCIe Gen 4.0 x4',
    3200000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=Kingston+SSD"]'::jsonb,
    '{"form_factor": "M.2 2280", "giao_tiếp": "NVMe PCIe Gen 4.0 x4", "tốc_độ_đọc": "6000 MB/s"}'::jsonb
), (
    'vga-msi-rtx4060',
    '7',
    'nvidia1',
    'MSI RTX 4060 Ventus 8GB',
    'MSI RTX 4060 Ventus 2X, 8GB GDDR6',
    8900000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=MSI+RTX4060"]'::jsonb,
    '{"dòng_vga": "RTX 40 Series", "vram": "8 GB", "memory_type": "GDDR6", "tdp": "120 W"}'::jsonb
), (
    'psu-msi-650w',
    '6',
    'coolermaster1',
    'MSI MAG A650B 650W',
    'MSI MAG A650B 650W 80+ Bronze, ATX',
    2800000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=MSI+PSU+650W"]'::jsonb,
    '{"công_suất": "650 W", "chứng_nhận": "80 Plus Bronze", "hiệu_suất": "85%"}'::jsonb
), (
    'monitor-acer-24',
    '9',
    'asus1',
    'ACER 24-inch IPS Gaming Monitor',
    'ACER 24 inch IPS panel, Full HD 1920x1080',
    4500000.00,
    'Mới',
    '36 tháng',
    '["https://via.placeholder.com/300?text=ACER+Monitor"]'::jsonb,
    '{"tấm_nền": "IPS", "độ_phân_giải": "Full HD (1920 x 1080)", "thời_gian_phản_hồi": "1 ms"}'::jsonb
), (
    'case-mid-tower',
    '8',
    'coolermaster1',
    'Mid-Tower ATX Computer Case',
    'Vỏ máy tính ATX mid-tower',
    1800000.00,
    'Mới',
    '24 tháng',
    '["https://via.placeholder.com/300?text=Mid-Tower+Case"]'::jsonb,
    '{"loại": "Mid-Tower", "form_factor": "ATX", "dung_tích": "~200L"}'::jsonb
)
ON CONFLICT DO NOTHING;
