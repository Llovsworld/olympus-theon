"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

interface AccessibleModalProps {
    label: string;
    onClose: () => void;
    children: ReactNode;
    overlayClassName?: string;
    contentClassName?: string;
    overlayStyle?: CSSProperties;
    contentStyle?: CSSProperties;
}

export default function AccessibleModal({
    label,
    onClose,
    children,
    overlayClassName = 'admin-modal-overlay',
    contentClassName,
    overlayStyle,
    contentStyle,
}: AccessibleModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const previouslyFocused = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const previousOverflow = document.body.style.overflow;

        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(',');

        const focusFirstControl = () => {
            const firstControl = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
            (firstControl ?? dialogRef.current)?.focus();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== 'Tab' || !dialogRef.current) return;
            const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
            if (controls.length === 0) {
                event.preventDefault();
                dialogRef.current.focus();
                return;
            }

            const first = controls[0];
            const last = controls.at(-1);
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
        const focusFrame = window.requestAnimationFrame(focusFirstControl);

        return () => {
            window.cancelAnimationFrame(focusFrame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused?.focus();
        };
    }, []);

    return (
        <div
            className={overlayClassName}
            style={overlayStyle}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                className={contentClassName}
                style={contentStyle}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                tabIndex={-1}
            >
                {children}
            </div>
        </div>
    );
}
