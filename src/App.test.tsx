import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders splash screen initially', () => {
        const { getByText } = render(
            <AuthProvider>
                <App />
            </AuthProvider>
        );
        expect(getByText(/Jot It Down/i)).toBeInTheDocument();
    });
});
