export function normalizeSearchText(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

export function getSearchTerms(query: string) {
    const normalizedQuery = normalizeSearchText(query);
    return normalizedQuery ? normalizedQuery.split(' ') : [];
}
