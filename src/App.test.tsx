import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders splash screen initially', () => {
        const { getByText } = render(<App />);
        expect(getByText(/Jot It Down/i)).toBeInTheDocument();
    });
});
