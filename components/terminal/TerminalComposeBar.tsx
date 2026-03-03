/**
 * Terminal Compose Bar
 * A text input bar at the bottom of the terminal for composing commands before sending them.
 * Useful for reviewing passwords/complex commands before sending, and for broadcasting to multiple sessions.
 */
import { Radio, Send, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useI18n } from '../../application/i18n/I18nProvider';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

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
        textareaRef.current?.focus();
    }, []);

    // Auto-resize textarea
    const handleInput = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        // Clamp between 1 line (~24px) and ~5 lines (~120px)
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

    const bgColor = themeColors?.background ?? '#0a0a0a';
    const fgColor = themeColors?.foreground ?? '#d4d4d4';
    const borderColor = `color-mix(in srgb, ${fgColor} 15%, ${bgColor} 85%)`;
    const inputBg = `color-mix(in srgb, ${fgColor} 6%, ${bgColor} 94%)`;

    return (
        <div
            className="flex items-end gap-1.5 px-2 py-1.5 border-t flex-shrink-0"
            style={{
                backgroundColor: bgColor,
                borderColor: borderColor,
            }}
        >
            {isBroadcastEnabled && (
                <div className="flex items-center pb-1" title={t("terminal.composeBar.broadcasting")}>
                    <Radio size={14} className="text-amber-400 animate-pulse" />
                </div>
            )}
            <textarea
                ref={textareaRef}
                className={cn(
                    "flex-1 resize-none rounded px-2 py-1 text-xs font-mono",
                    "outline-none border focus:ring-1 focus:ring-primary/50",
                    "placeholder:text-muted-foreground/50",
                )}
                style={{
                    backgroundColor: inputBg,
                    color: fgColor,
                    borderColor: borderColor,
                    minHeight: '24px',
                    maxHeight: '120px',
                }}
                rows={1}
                placeholder={t("terminal.composeBar.placeholder")}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
            />
            <div className="flex items-center gap-0.5 pb-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0"
                    style={{ color: fgColor }}
                    onClick={handleSend}
                    title={t("terminal.composeBar.send")}
                >
                    <Send size={12} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0"
                    style={{ color: fgColor }}
                    onClick={onClose}
                    title={t("terminal.composeBar.close")}
                >
                    <X size={11} />
                </Button>
            </div>
        </div>
    );
};

export default TerminalComposeBar;
