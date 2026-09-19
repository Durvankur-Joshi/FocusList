import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../src/components/layout/Header';

describe('Header Component', () => {
  it('renders application title, tagline, and current date', () => {
    render(<Header />);

    expect(screen.getByRole('heading', { name: 'FocusList', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Focus on what matters.')).toBeInTheDocument();

    const dateContainer = screen.getByLabelText(/today is/i);
    expect(dateContainer).toBeInTheDocument();
  });
});
