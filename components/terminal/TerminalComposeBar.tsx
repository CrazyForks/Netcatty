/**
 * Terminal Compose Bar
 * A modern text input bar for composing commands before sending them.
 * Supports pre-reviewing passwords/commands and broadcasting to multiple sessions.
 */
import { Radio, Send, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useI18n } from '../../application/i18n/I18nProvider';
import { cn } from '../../lib/utils';

export interface TerminalComposeBarProps {
    onSend: (text: string) => void;
    onClose: () => void;
    isBroadcastEnabled?: boolean;
    themeColors?: {
        background: string;
        foreground: string;
    };
}

export const TerminalComposeBar: React.FC<TerminalComposeBarProps> = ({
    onSend,
    onClose,
    isBroadcastEnabled,
    themeColors,
}) => {
    const { t } = useI18n();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        // Small delay to ensure the element is rendered
        const timer = setTimeout(() => textareaRef.current?.focus(), 50);
        return () => clearTimeout(timer);
    }, []);

    // Auto-resize textarea
    const handleInput = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, []);

    const handleSend = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        const text = el.value;
        if (!text) return;
        onSend(text);
        el.value = '';
        el.style.height = 'auto';
        el.focus();
    }, [onSend]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    }, [handleSend, onClose]);

    const bg = themeColors?.background ?? '#0a0a0a';
    const fg = themeColors?.foreground ?? '#d4d4d4';

    return (
        <div
            className="flex-shrink-0"
            style={{
                background: `linear-gradient(to top, ${bg}, color-mix(in srgb, ${fg} 4%, ${bg} 96%))`,
                borderTop: `1px solid color-mix(in srgb, ${fg} 10%, ${bg} 90%)`,
                borderRadius: '0 0 8px 8px',
                padding: '6px 10px',
            }}
        >
            <div className="flex items-end gap-2">
                {/* Broadcast indicator */}
                {isBroadcastEnabled && (
                    <div
                        className="flex items-center pb-[7px]"
                        title={t("terminal.composeBar.broadcasting")}
                    >
                        <Radio size={14} className="text-amber-400 animate-pulse" />
                    </div>
                )}

                {/* Input field */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        className={cn(
                            "w-full resize-none rounded-md px-3 py-1.5 text-xs font-mono leading-relaxed",
                            "outline-none transition-all duration-200",
                            "placeholder:opacity-40",
                        )}
                        style={{
                            backgroundColor: `color-mix(in srgb, ${fg} 6%, ${bg} 94%)`,
                            color: fg,
                            border: `1px solid color-mix(in srgb, ${fg} 12%, ${bg} 88%)`,
                            minHeight: '28px',
                            maxHeight: '120px',
                            boxShadow: `inset 0 1px 3px color-mix(in srgb, ${bg} 80%, transparent)`,
                        }}
                        rows={1}
                        placeholder={t("terminal.composeBar.placeholder")}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = `color-mix(in srgb, ${fg} 25%, ${bg} 75%)`;
                            e.currentTarget.style.boxShadow = `inset 0 1px 3px color-mix(in srgb, ${bg} 80%, transparent), 0 0 0 1px color-mix(in srgb, ${fg} 8%, transparent)`;
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = `color-mix(in srgb, ${fg} 12%, ${bg} 88%)`;
                            e.currentTarget.style.boxShadow = `inset 0 1px 3px color-mix(in srgb, ${bg} 80%, transparent)`;
                        }}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 pb-[3px]">
                    <button
                        className="h-7 w-7 flex items-center justify-center rounded-md transition-colors duration-150"
                        style={{
                            color: fg,
                            background: `color-mix(in srgb, ${fg} 8%, transparent)`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `color-mix(in srgb, ${fg} 16%, transparent)`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = `color-mix(in srgb, ${fg} 8%, transparent)`;
                        }}
                        onClick={handleSend}
                        title={t("terminal.composeBar.send")}
                    >
                        <Send size={13} />
                    </button>
                    <button
                        className="h-7 w-7 flex items-center justify-center rounded-md transition-colors duration-150"
                        style={{
                            color: `color-mix(in srgb, ${fg} 50%, transparent)`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = `color-mix(in srgb, ${fg} 10%, transparent)`;
                            e.currentTarget.style.color = fg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = `color-mix(in srgb, ${fg} 50%, transparent)`;
                        }}
                        onClick={onClose}
                        title={t("terminal.composeBar.close")}
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TerminalComposeBar;
