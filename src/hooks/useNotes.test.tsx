import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNotes } from './useNotes';
import { supabase } from '../supabase';
import * as db from '../db';

// Mock Supabase
vi.mock('../supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            upsert: vi.fn().mockResolvedValue({ error: null }),
            delete: vi.fn().mockReturnValue({ eq: vi.fn() })
        })),
        channel: vi.fn(() => ({
            on: vi.fn().mockReturnThis(),
            subscribe: vi.fn()
        })),
        removeChannel: vi.fn()
    }
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'test-user-id' }
    })
}));

// Mock IDB
vi.mock('../db', () => ({
    getNotes: vi.fn().mockResolvedValue([]),
    saveNote: vi.fn(),
    deleteNote: vi.fn(),
    importNotes: vi.fn()
}));

describe('useNotes Sync Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches notes from cloud on mount if user is logged in', async () => {
        const mockCloudNotes = [
            { id: 1, title: 'Cloud Note', updated_at: new Date().toISOString() }
        ];

        // Setup Supabase Mock Return
        const selectMock = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: mockCloudNotes, error: null })
        });
        (supabase.from as any).mockReturnValue({ select: selectMock });

        renderHook(() => useNotes());

        await waitFor(() => {
            expect(supabase.from).toHaveBeenCalledWith('notes');
            // Check if it saved to local DB
            expect(db.saveNote).toHaveBeenCalled();
        });
    });

    it('upserts to cloud when adding a note', async () => {
        const upsertMock = vi.fn().mockResolvedValue({ error: null });
        (supabase.from as any).mockReturnValue({ upsert: upsertMock });

        const { result } = renderHook(() => useNotes());

        // Wait for initial load
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await result.current.addNote({ title: 'New Note' });

        expect(supabase.from).toHaveBeenCalledWith('notes');
        expect(upsertMock).toHaveBeenCalled();
    });
});
