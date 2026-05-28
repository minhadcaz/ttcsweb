const db = require('../config/db');

const columnCache = new Map();

const quoteIdentifier = (identifier) => `"${String(identifier).replace(/"/g, '""')}"`;

const resolveQuantityColumn = async (tableName, preferredNames = ['soluong', 'soLuong', 'SoLuong']) => {
    const cacheKey = `${String(tableName).toLowerCase()}:quantity`;
    if (columnCache.has(cacheKey)) {
        return columnCache.get(cacheKey);
    }

    const normalizedPreferred = preferredNames.map((name) => String(name).toLowerCase());
    const { rows } = await db.query(
        `SELECT column_name
         FROM information_schema.columns
         WHERE lower(table_name) = lower($1)
           AND lower(column_name) = ANY($2::text[])`,
        [tableName, normalizedPreferred]
    );

    if (rows.length === 0) {
        throw new Error(`Không tìm thấy cột số lượng cho bảng ${tableName}`);
    }

    const preferred = preferredNames.find((name) => rows.some((row) => row.column_name === name));
    const resolvedName = preferred || rows[0].column_name;
    const resolvedColumn = quoteIdentifier(resolvedName);

    columnCache.set(cacheKey, resolvedColumn);
    return resolvedColumn;
};

module.exports = {
    resolveQuantityColumn,
};