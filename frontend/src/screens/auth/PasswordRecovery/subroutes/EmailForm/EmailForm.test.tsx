import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmailForm } from './EmailForm';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../../../../themes/defaultTheme';

describe('EmailForm', () => {
  it('Renders correctly', () => {
    // ARRANGE
    render(
    <ThemeProvider theme={defaultTheme}>
      <MemoryRouter>
        <EmailForm />
      </MemoryRouter>
    </ThemeProvider>
    );
    // ACT

    // EXPECT
    expect(screen.getByRole('heading', {
      level: 1
    })).toHaveTextContent('Recover Password');

    expect(screen.getByPlaceholderText('email@example.com')).toBeInstanceOf(HTMLInputElement);
  });
});