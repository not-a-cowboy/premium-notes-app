import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders splash screen initially', () => {
        render(<App />);
        expect(screen.getByText(/Jot It Down/i)).toBeInTheDocument();
    });
});
