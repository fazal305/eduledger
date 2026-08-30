export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize, 10) || 20))
  return { page, pageSize, offset: (page - 1) * pageSize }
}

export function buildMeta(page, pageSize, total) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}
