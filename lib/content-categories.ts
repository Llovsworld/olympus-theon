import { normalizeSearchText } from '@/lib/search';

export const CONTENT_CATEGORIES = [
    {
        label: 'Psicología',
        description: 'Emociones, patrones mentales y herramientas psicológicas.',
    },
    {
        label: 'Mentalidad',
        description: 'Disciplina, hábitos, enfoque y crecimiento personal.',
    },
    {
        label: 'Relaciones',
        description: 'Pareja, comunicación y vínculos personales.',
    },
    {
        label: 'Espiritualidad',
        description: 'Meditación, consciencia y práctica contemplativa.',
    },
    {
        label: 'Rendimiento físico',
        description: 'Entrenamiento, recuperación y hábitos físicos.',
    },
    {
        label: 'Filosofía',
        description: 'Ideas, estoicismo, criterio y sentido vital.',
    },
] as const;

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number]['label'];

const categoryByKey = new Map<string, ContentCategory>(
    CONTENT_CATEGORIES.map(({ label }) => [normalizeSearchText(label), label]),
);

const legacyCategoryAliases = new Map<string, ContentCategory>([
    ['mindset', 'Mentalidad'],
    ['pareja', 'Relaciones'],
    ['espiritual', 'Espiritualidad'],
    ['entrenamiento', 'Rendimiento físico'],
    ['fitness', 'Rendimiento físico'],
]);

export function getCanonicalContentCategory(value: unknown): ContentCategory | null {
    if (typeof value !== 'string') return null;

    const key = normalizeSearchText(value);
    if (!key) return null;

    return categoryByKey.get(key) ?? legacyCategoryAliases.get(key) ?? null;
}

export function getContentCategoryDefinition(value: unknown) {
    const category = getCanonicalContentCategory(value);
    return category
        ? CONTENT_CATEGORIES.find(({ label }) => label === category) ?? null
        : null;
}

export function getContentCategoryKey(value: unknown) {
    const category = getCanonicalContentCategory(value);
    return category ? normalizeSearchText(category) : '';
}
