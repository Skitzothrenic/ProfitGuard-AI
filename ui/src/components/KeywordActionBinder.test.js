import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KeywordActionBinder from './KeywordActionBinder';

// Mock the CSS import to prevent Jest from throwing an error
jest.mock('./KeywordActionBinder.css', () => {});

test('renders KeywordActionBinder and checks for presence of elements', () => {
  render(<KeywordActionBinder />);

  // Check if Keyword Action Binder is rendered
  const headerElement = screen.getByText(/Keyword Action Binder/i);
  expect(headerElement).toBeInTheDocument();

  // Check if button elements exist
  const exportButton = screen.getByText(/Export Bindings/i);
  expect(exportButton).toBeInTheDocument();

  // Simulate user interaction
  fireEvent.change(screen.getByPlaceholderText(/Keyword\(s, comma-separated\)/), {
    target: { value: 'test' },
  });

  const inputElement = screen.getByPlaceholderText(/Keyword\(s, comma-separated\)/);
  expect(inputElement.value).toBe('test');
});
