'use client';

import { useMemo, useRef, useState } from 'react';
import BookCard from './BookCard';
import ScrollReveal from './ScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { getSearchTerms, normalizeSearchText } from '@/lib/search';
import {
    CONTENT_CATEGORIES,
    getContentCategoryKey,
} from '@/lib/content-categories';
import type { ContentCategory } from '@/lib/content-categories';

const ALL_CATEGORIES = 'all';

interface BookListProps {
    books: Array<{
        id: string;
        title: string;
        slug: string;
        author: string | null;
        category: ContentCategory | null;
        description: string;
        coverImage: string | null;
        createdAt: Date;
        searchText: string;
        readingTime: number | null;
    }>;
}

export default function BookList({ books }: BookListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const categories = useMemo(() => {
        const activeCategoryKeys = new Set(
            books.map((book) => getContentCategoryKey(book.category)).filter(Boolean),
        );

        return CONTENT_CATEGORIES
            .map(({ label }) => ({ key: getContentCategoryKey(label), label }))
            .filter(({ key }) => activeCategoryKeys.has(key));
    }, [books]);

    const indexedBooks = useMemo(() => books.map((book) => ({
        book,
        categoryKey: getContentCategoryKey(book.category),
        searchableText: normalizeSearchText([
            book.title,
            book.author || '',
            book.category || '',
            book.description,
            book.searchText,
        ].join(' ')),
    })), [books]);

    const searchTerms = useMemo(() => getSearchTerms(searchQuery), [searchQuery]);
    const hasSearch = searchTerms.length > 0;
    const hasActiveFilters = hasSearch || selectedCategory !== ALL_CATEGORIES;

    const filteredBooks = useMemo(() => {
        return indexedBooks
            .filter(({ categoryKey, searchableText }) => {
                const matchesCategory = selectedCategory === ALL_CATEGORIES || categoryKey === selectedCategory;
                const matchesSearch = searchTerms.every((term) => searchableText.includes(term));
                return matchesCategory && matchesSearch;
            })
            .map(({ book }) => book);
    }, [indexedBooks, searchTerms, selectedCategory]);

    const selectedCategoryLabel = categories.find(({ key }) => key === selectedCategory)?.label;
    const visibleQuery = searchQuery.trim().replace(/\s+/g, ' ');
    const resultNoun = filteredBooks.length === 1 ? 'libro' : 'libros';
    const resultSummary = hasActiveFilters
        ? `${filteredBooks.length} ${resultNoun}${hasSearch ? ` para “${visibleQuery}”` : ''}${selectedCategoryLabel ? ` en ${selectedCategoryLabel}` : ''}`
        : `${filteredBooks.length} ${resultNoun} para explorar`;

    const clearSearchQuery = () => {
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(ALL_CATEGORIES);
        searchInputRef.current?.focus();
    };

    return (
        <div>
            <section
                aria-labelledby="book-search-title"
                style={{
                    maxWidth: '780px',
                    margin: '2.5rem auto 2rem',
                    padding: 'clamp(1.25rem, 3vw, 2rem)',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.025))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.2)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <h2
                        id="book-search-title"
                        style={{
                            color: '#fff',
                            fontSize: 'clamp(1.25rem, 3vw, 1.65rem)',
                            lineHeight: 1.2,
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Encuentra tu próxima lectura
                    </h2>
                    <p style={{ color: '#9d9d9d', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        Busca por título, autor o la idea que quieres explorar.
                    </p>
                </div>

                <div role="search" aria-label="Buscar en la biblioteca">
                    <label className="sr-only" htmlFor="book-search-input">
                        Buscar libros por título, autor o contenido
                    </label>
                    <div style={{ position: 'relative' }}>
                        <Search
                            aria-hidden="true"
                            size={20}
                            style={{
                                position: 'absolute',
                                left: '1.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(255, 255, 255, 0.48)',
                                pointerEvents: 'none'
                            }}
                        />
                        <input
                            ref={searchInputRef}
                            id="book-search-input"
                            type="text"
                            role="searchbox"
                            inputMode="search"
                            enterKeyHint="search"
                            autoComplete="off"
                            aria-controls="book-results"
                            placeholder="Busca: pareja, Gottman, conflictos…"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape' && searchQuery) {
                                    setSearchQuery('');
                                }
                            }}
                            style={{
                                width: '100%',
                                minHeight: '56px',
                                padding: '0.9rem 3.75rem 0.9rem 3.25rem',
                                background: 'rgba(0, 0, 0, 0.32)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                            className="placeholder:text-white/35 focus:border-yellow-500/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-yellow-500/10"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                aria-label="Borrar búsqueda"
                                onClick={clearSearchQuery}
                                style={{
                                    position: 'absolute',
                                    right: '0.45rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '44px',
                                    height: '44px',
                                    display: 'grid',
                                    placeItems: 'center',
                                    border: 0,
                                    borderRadius: '10px',
                                    color: '#aaa',
                                    background: 'transparent',
                                    cursor: 'pointer'
                                }}
                                className="transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70"
                            >
                                <X aria-hidden="true" size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div
                    role="group"
                    aria-label="Filtrar libros por categoría"
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '0.55rem',
                        marginTop: '1rem'
                    }}
                >
                    {[{ key: ALL_CATEGORIES, label: 'Todos' }, ...categories].map(({ key, label }) => {
                        const isActive = selectedCategory === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                aria-pressed={isActive}
                                aria-controls="book-results"
                                onClick={() => setSelectedCategory(key)}
                                style={{
                                    minHeight: '44px',
                                    padding: '0.65rem 1rem',
                                    borderRadius: '999px',
                                    border: isActive
                                        ? '1px solid rgba(255, 215, 0, 0.65)'
                                        : '1px solid rgba(255, 255, 255, 0.14)',
                                    background: isActive
                                        ? 'rgba(255, 215, 0, 0.14)'
                                        : 'rgba(255, 255, 255, 0.035)',
                                    color: isActive ? '#FFD700' : '#b8b8b8',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer'
                                }}
                                className="transition-colors hover:border-yellow-500/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70"
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                    <p
                        id="book-results-status"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        style={{ color: '#aaa', fontSize: '0.85rem' }}
                    >
                        {resultSummary}
                    </p>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            style={{
                                minHeight: '44px',
                                padding: '0.55rem 0.25rem',
                                border: 0,
                                background: 'transparent',
                                color: '#FFD700',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </section>

            {/* Books Grid */}
            <div
                id="book-results"
                aria-labelledby="book-results-status"
                className="responsive-grid"
                style={{ marginTop: '0' }}
            >
                {filteredBooks.map((book, index) => {
                    // Keep the featured treatment only in the unfiltered view.
                    const isFeatured = index === 0 && !hasActiveFilters;

                    if (isFeatured) {
                        return (
                            <ScrollReveal key={book.id} variant="fade">
                                <Link href={`/books/${book.slug}`} style={{ textDecoration: 'none' }}>
                                    <article
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 215, 0, 0.3)', // Gold border for featured
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                            cursor: 'pointer',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {/* Featured Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            background: '#FFD700',
                                            color: '#000',
                                            padding: '0.4rem 0.8rem',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            zIndex: 10,
                                            borderRadius: '2px'
                                        }}>
                                            Libro Destacado
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            {book.coverImage && (
                                                <div style={{
                                                    width: '100%',
                                                    aspectRatio: '16/9',
                                                    overflow: 'hidden',
                                                    position: 'relative'
                                                }}>
                                                    <Image
                                                        src={book.coverImage}
                                                        alt={book.title}
                                                        fill
                                                        sizes="(max-width: 700px) calc(100vw - 3rem), (max-width: 1200px) 50vw, 33vw"
                                                        loading="eager"
                                                        style={{
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
                                                        opacity: 0.5
                                                    }} />
                                                </div>
                                            )}

                                            <div style={{
                                                padding: '1.75rem 1.5rem',
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                textAlign: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {book.category && (
                                                    <span style={{
                                                        color: '#FFD700',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.12em',
                                                        marginBottom: '0.75rem',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {book.category}
                                                    </span>
                                                )}
                                                <h2 style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: '700',
                                                    marginBottom: '0.75rem',
                                                    lineHeight: '1.3',
                                                    color: '#fff',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.02em'
                                                }}>
                                                    {book.title}
                                                </h2>

                                                {book.author && (
                                                    <span style={{
                                                        color: '#aaa',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.1em',
                                                        marginBottom: '0.9rem',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {book.author}
                                                    </span>
                                                )}

                                                <p style={{
                                                    color: '#aaa',
                                                    lineHeight: '1.5',
                                                    marginBottom: '1.5rem',
                                                    flex: 1,
                                                    fontSize: '0.9rem',
                                                    maxWidth: '90%'
                                                }}>
                                                    {book.description}
                                                </p>

                                                <div style={{
                                                    marginTop: 'auto',
                                                    paddingTop: '1rem',
                                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    gap: '1rem'
                                                }}>
                                                    <time style={{
                                                        color: '#666',
                                                        fontSize: '0.7rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.1em',
                                                        fontWeight: 600
                                                    }}>
                                                        {new Date(book.createdAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </time>
                                                    {book.readingTime !== null && (
                                                        <>
                                                            <span style={{ color: '#444' }}>•</span>
                                                            <span style={{
                                                                color: '#FFD700',
                                                                fontSize: '0.7rem',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.1em',
                                                                fontWeight: 600
                                                            }}>
                                                                {book.readingTime} min de lectura
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </ScrollReveal>
                        );
                    }

                    return (
                        <ScrollReveal key={book.id} variant="slideScale" delay={Math.min(index * 100, 500)}>
                            <BookCard book={book} />
                        </ScrollReveal>
                    );
                })}

                {filteredBooks.length === 0 && (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: 'clamp(3rem, 8vw, 5rem) 1.25rem',
                        color: '#aaa',
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            display: 'grid',
                            placeItems: 'center',
                            margin: '0 auto 1rem',
                            borderRadius: '50%',
                            color: '#FFD700',
                            background: 'rgba(255, 215, 0, 0.1)'
                        }}>
                            <Search aria-hidden="true" size={24} />
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>
                            {books.length === 0
                                ? 'Todavía no hay libros publicados'
                                : hasSearch
                                ? `No encontramos libros sobre “${visibleQuery}”`
                                : 'No hay libros en esta categoría'}
                        </h3>
                        <p style={{ lineHeight: 1.6, margin: '0 auto 1.25rem', maxWidth: '480px' }}>
                            {books.length === 0
                                ? 'Estamos preparando nuevas lecturas. Vuelve pronto para descubrirlas.'
                                : 'Prueba con una palabra más general, un autor o explora toda la biblioteca.'}
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                style={{
                                    minHeight: '44px',
                                    padding: '0.7rem 1.1rem',
                                    border: '1px solid rgba(255, 215, 0, 0.55)',
                                    borderRadius: '10px',
                                    background: 'rgba(255, 215, 0, 0.12)',
                                    color: '#FFD700',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                                className="transition-colors hover:bg-yellow-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70"
                            >
                                Ver todos los libros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
