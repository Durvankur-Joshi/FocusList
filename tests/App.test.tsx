import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('Smoke Test - FocusList App', () => {
  it('renders the application header and tagline', () => {
    render(<App />);

    expect(screen.getByText('FocusList')).toBeInTheDocument();
    expect(screen.getByText('Focus on what matters.')).toBeInTheDocument();
  });
});
