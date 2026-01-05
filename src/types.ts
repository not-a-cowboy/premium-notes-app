export interface Note {
    id: number;
    title: string;
    content: string;
    category?: string;
    isPinned?: boolean;
    tags?: string[];
    audioRecordings?: Blob[];
    sketchData?: string;
    isLocked?: boolean;
    date?: string;
    updatedAt: string;
}

export type Theme = 'default' | 'sakura' | 'midnight' | 'soft-paper' | 'toxic' | 'nuclear' | 'entropy';
