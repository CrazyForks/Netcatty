import { useCallback, useMemo } from "react";
import type { SftpBookmark } from "../../../domain/models";
import { useSftpHosts, useSftpUpdateHosts } from "../index";

interface UseSftpBookmarksParams {
    hostId: string | undefined;
    currentPath: string | undefined;
}

interface UseSftpBookmarksResult {
    bookmarks: SftpBookmark[];
    isCurrentPathBookmarked: boolean;
    toggleBookmark: () => void;
    deleteBookmark: (id: string) => void;
}

export const useSftpBookmarks = ({
    hostId,
    currentPath,
}: UseSftpBookmarksParams): UseSftpBookmarksResult => {
    const hosts = useSftpHosts();
    const updateHosts = useSftpUpdateHosts();

    const host = useMemo(
        () => (hostId ? hosts.find((h) => h.id === hostId) : undefined),
        [hosts, hostId],
    );

    const bookmarks = useMemo(() => host?.sftpBookmarks ?? [], [host]);

    const isCurrentPathBookmarked = useMemo(
        () =>
            !!currentPath && bookmarks.some((b) => b.path === currentPath),
        [currentPath, bookmarks],
    );

    const updateHostBookmarks = useCallback(
        (newBookmarks: SftpBookmark[]) => {
            if (!hostId) return;
            const updated = hosts.map((h) =>
                h.id === hostId ? { ...h, sftpBookmarks: newBookmarks } : h,
            );
            updateHosts(updated);
        },
        [hostId, hosts, updateHosts],
    );

    const toggleBookmark = useCallback(() => {
        if (!currentPath || !hostId) return;
        if (isCurrentPathBookmarked) {
            updateHostBookmarks(bookmarks.filter((b) => b.path !== currentPath));
        } else {
            const label =
                currentPath === "/"
                    ? "/"
                    : currentPath.split("/").filter(Boolean).pop() || currentPath;
            const newBookmark: SftpBookmark = {
                id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                path: currentPath,
                label,
            };
            updateHostBookmarks([...bookmarks, newBookmark]);
        }
    }, [currentPath, hostId, isCurrentPathBookmarked, bookmarks, updateHostBookmarks]);

    const deleteBookmark = useCallback(
        (id: string) => {
            updateHostBookmarks(bookmarks.filter((b) => b.id !== id));
        },
        [bookmarks, updateHostBookmarks],
    );

    return {
        bookmarks,
        isCurrentPathBookmarked,
        toggleBookmark,
        deleteBookmark,
    };
};
