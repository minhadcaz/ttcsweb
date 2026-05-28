const productModel = require('../models/productModel');
const inventoryModel = require('../models/inventoryModel');

const resolveProductId = (...candidates) => {
    for (const candidate of candidates) {
        if (candidate === undefined || candidate === null) continue;
        const value = String(candidate).trim();
        if (value) return value;
    }
    return null;
};

const productController = {
    // 1. GET /api/products
    getAll: async (req, res) => {
        try {
            const {
                category,
                search,
                status,
                minPrice,
                maxPrice,
                keywords,
                sort = 'name',
                order = 'asc'
            } = req.query;

            let products = await productModel.getAllProducts();

            // Filter by category if specified
            if (category && category !== 'all') {
                products = products.filter(product => {
                    const productCategory = (product.category_name || product.nameCate || '').toLowerCase().trim();
                    const searchCategory = category.toLowerCase().trim();
                    // Exact match on category name
                    return productCategory === searchCategory;
                });
            }

            // Filter by search term
            if (search && search.trim()) {
                const searchTerm = search.trim().toLowerCase();
                products = products.filter(product => {
                    const searchableText = [
                        product.tensp || product.tenSP,
                        product.category_name || product.nameCate,
                        product.manufacturer_name || product.TenNSX,
                        product.thongsokythuat
                    ].filter(Boolean).join(' ').toLowerCase();
                    return searchableText.includes(searchTerm);
                });
            }

            // Filter by status
            if (status && status !== 'all') {
                const isActive = status === 'Sẵn hàng';
                products = products.filter(product => {
                    const quantity = Number(product.quantity || product.soLuong || 0);
                    return isActive ? quantity > 0 : quantity <= 0;
                });
            }

            // Filter by price range
            if (minPrice || maxPrice) {
                const min = parseFloat(minPrice) || 0;
                const max = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
                products = products.filter(product => {
                    const price = parseFloat(product.gianiemyet || product.price || 0) || 0;
                    return price >= min && price <= max;
                });
            }

            // Filter by keywords
            if (keywords) {
                const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                if (keywordList.length > 0) {
                    products = products.filter(product => {
                        const searchableText = [
                            product.tensp || product.tenSP,
                            product.category_name || product.nameCate,
                            product.manufacturer_name || product.TenNSX,
                            product.thongsokythuat
                        ].filter(Boolean).join(' ').toLowerCase();
                        return keywordList.some(keyword => searchableText.includes(keyword));
                    });
                }
            }

            // Sort products
            if (sort && sort !== 'featured') {
                products.sort((a, b) => {
                    let aValue, bValue;

                    if (sort === 'price') {
                        aValue = parseFloat(a.gianiemyet || a.price || 0) || 0;
                        bValue = parseFloat(b.gianiemyet || b.price || 0) || 0;
                    } else if (sort === 'name') {
                        aValue = (a.tensp || a.tenSP || '').toLowerCase();
                        bValue = (b.tensp || b.tenSP || '').toLowerCase();
                    } else {
                        return 0;
                    }

                    if (order === 'desc') {
                        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
                    } else {
                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                    }
                });
            }

            res.status(200).json({ success: true, data: products });
        } catch (error) {
            console.error('Lỗi lấy danh sách sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 2. GET /api/products/:id
    getById: async (req, res) => {
        try {
            const product = await productModel.getProductById(req.params.id);
            if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 3. POST /api/products
    create: async (req, res) => {
        try {
            const quantity = Number(req.body.soLuong ?? req.body.quantity ?? 0) || 0;
            const newProduct = await productModel.createProduct(req.body);
            const createdProductId = resolveProductId(newProduct?.idSP, newProduct?.idsp, req.body?.idSP, req.body?.idsp);

            if (!createdProductId) {
                throw new Error('Không lấy được mã sản phẩm sau khi tạo mới');
            }

            await inventoryModel.updateInventory(createdProductId, {
                soLuong: quantity,
                donVi: req.body.donVi || 'cái'
            });

            newProduct.quantity = quantity;
            res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: newProduct
            });
        } catch (error) {
            console.error('Lỗi tạo sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo sản phẩm' });
        }
    },

    // 4. PUT /api/products/:id
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const quantity = Number(req.body.soLuong ?? req.body.quantity ?? 0) || 0;
            const updatedProduct = await productModel.updateProduct(id, req.body);

            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại để sửa' });
            }

            await inventoryModel.updateInventory(id, {
                soLuong: quantity,
                donVi: req.body.donVi || 'cái'
            });

            updatedProduct.quantity = quantity;

            res.status(200).json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
                data: updatedProduct
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi cập nhật sản phẩm' });
        }
    },

    // 5. DELETE /api/products/:id
    delete: async (req, res) => {
        try {
            const deletedProduct = await productModel.deleteProduct(req.params.id);

            if (!deletedProduct) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
            }

            res.status(200).json({ success: true, message: 'Đã chuyển sản phẩm sang trạng thái ngừng kinh doanh' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm' });
        }
    },

    // 6. GET /api/products/category/:categoryId
    getByCategory: async (req, res) => {
        try {
            const products = await productModel.getProductsByCategory(req.params.categoryId);
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 7. GET /api/products/search?q=searchTerm
    search: async (req, res) => {
        try {
            const searchTerm = req.query.q;
            if (!searchTerm) {
                return res.status(400).json({ success: false, message: 'Thiếu từ khóa tìm kiếm' });
            }

            const products = await productModel.searchProducts(searchTerm);
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 8. GET /api/products/stats
    getStats: async (req, res) => {
        try {
            const stats = await productModel.getProductStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    // 9. POST /api/products/import-bulk
    importBulk: async (req, res) => {
        try {
            const { products } = req.body;

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ success: false, message: 'Dữ liệu sản phẩm không hợp lệ' });
            }

            const results = {
                success: [],
                failed: []
            };

            for (let i = 0; i < products.length; i++) {
                try {
                    const product = products[i];
                    const quantity = Number(product.soluong || product.soLuong || product.quantity || 0) || 0;
                    const importProductId = resolveProductId(product.idSP, product.idsp);

                    if (!importProductId) {
                        results.failed.push({
                            row: i + 2,
                            reason: 'Thiếu mã sản phẩm'
                        });
                        continue;
                    }

                    const existingProduct = await productModel.getProductById(importProductId);
                    if (existingProduct) {
                        if (quantity > 0) {
                            await inventoryModel.addStock(importProductId, quantity);
                        }

                        results.success.push({
                            row: i + 2,
                            idSP: importProductId,
                            tenSP: existingProduct.tenSP || existingProduct.tensp || ''
                        });
                        continue;
                    }

                    if (!product.tenSP) {
                        results.failed.push({
                            row: i + 2,
                            reason: 'Thiếu tên sản phẩm cho sản phẩm mới'
                        });
                        continue;
                    }

                    const newProduct = await productModel.createProduct(product);
                    const createdProductId = resolveProductId(newProduct?.idSP, newProduct?.idsp, importProductId);
                    if (quantity > 0) {
                        await inventoryModel.addStock(createdProductId, quantity);
                    }

                    results.success.push({
                        row: i + 2,
                        idSP: createdProductId,
                        tenSP: product.tenSP
                    });
                } catch (err) {
                    results.failed.push({
                        row: i + 2,
                        reason: err.message || 'Lỗi khi tạo sản phẩm'
                    });
                }
            }

            res.status(201).json({
                success: true,
                message: `Nhập thành công ${results.success.length} sản phẩm, thất bại ${results.failed.length}`,
                data: results
            });
        } catch (error) {
            console.error('Lỗi nhập bulk sản phẩm:', error);
            res.status(500).json({ success: false, message: 'Lỗi khi nhập sản phẩm' });
        }
    }
};

module.exports = productController;