import { render, screen } from '@testing-library/react';
import { GraphView } from './GraphView';
import { Note } from '../types';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock react-force-graph-2d because it uses Canvas which is hard to test in jsdom
vi.mock('react-force-graph-2d', () => ({
    default: ({ graphData }: any) => (
        <div data-testid="force-graph">
            {graphData.nodes.map((node: any) => (
                <div key={node.id} data-testid="graph-node">{node.name}</div>
            ))}
        </div>
    )
}));

describe('GraphView', () => {
    const mockNotes: Note[] = [
        {
            id: 1,
            title: 'Note 1',
            content: 'Content 1',
            updatedAt: new Date().toISOString(),
            tags: ['tag1'],
            category: 'General',
            isPinned: false
        },
        {
            id: 2,
            title: 'Note 2',
            content: 'Reference to [[Note 1]]',
            updatedAt: new Date().toISOString(),
            tags: ['tag1', 'tag2'],
            category: 'General',
            isPinned: false
        }
    ];

    it('renders nodes for notes and tags', () => {
        render(
            <BrowserRouter>
                <GraphView notes={mockNotes} />
            </BrowserRouter>
        );

        // Check for Note Nodes
        expect(screen.getByText('Note 1')).toBeInTheDocument();
        expect(screen.getByText('Note 2')).toBeInTheDocument();

        // Check for Tag Nodes
        expect(screen.getByText('#tag1')).toBeInTheDocument(); // Shared tag
        expect(screen.getByText('#tag2')).toBeInTheDocument(); // Unique tag
    });
});
