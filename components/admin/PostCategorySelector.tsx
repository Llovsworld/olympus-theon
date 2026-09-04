import { POST_CATEGORIES } from '@/lib/post-categories';
import type { PostCategory } from '@/lib/post-categories';

interface PostCategorySelectorProps {
    value: PostCategory[];
    onChange: (categories: PostCategory[]) => void;
    compact?: boolean;
}

export default function PostCategorySelector({
    value,
    onChange,
    compact = false,
}: PostCategorySelectorProps) {
    function toggleCategory(category: PostCategory) {
        onChange(
            value.includes(category)
                ? value.filter((item) => item !== category)
                : [...value, category],
        );
    }

    return (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="admin-label" style={{ marginBottom: '0.7rem' }}>
                Categorías
            </legend>
            <div style={{ display: 'grid', gap: compact ? '0.45rem' : '0.6rem' }}>
                {POST_CATEGORIES.map(({ label, description }) => {
                    const selected = value.includes(label);

                    return (
                        <label
                            key={label}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.7rem',
                                padding: compact ? '0.65rem 0.75rem' : '0.8rem 0.9rem',
                                borderRadius: '8px',
                                border: selected
                                    ? '1px solid rgba(255, 215, 0, 0.55)'
                                    : '1px solid #2b2b2b',
                                background: selected
                                    ? 'rgba(255, 215, 0, 0.08)'
                                    : 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleCategory(label)}
                                style={{ marginTop: '0.2rem', accentColor: '#FFD700' }}
                            />
                            <span>
                                <span style={{ display: 'block', color: selected ? '#FFD700' : '#ededed', fontWeight: 700 }}>
                                    {label}
                                </span>
                                {!compact && (
                                    <span style={{ display: 'block', color: '#777', fontSize: '0.76rem', lineHeight: 1.45, marginTop: '0.15rem' }}>
                                        {description}
                                    </span>
                                )}
                            </span>
                        </label>
                    );
                })}
            </div>
            <p className="admin-helper-text" style={{ marginTop: '0.7rem' }}>
                Selecciona una o varias categorías fijas. El artículo aparecerá en cada filtro elegido.
            </p>
        </fieldset>
    );
}
