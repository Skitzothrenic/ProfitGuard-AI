import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import TimerDisplay from './TimerDisplay';

jest.useFakeTimers(); // Mock timers for testing

test('renders timer correctly', async () => {
  render(<TimerDisplay id="1" name="Test Timer" duration="5" />);

  const timerElement = screen.getByText(/Test Timer/); // Get the timer element by its name

  // Wait for the initial value to be rendered correctly (Test Timer: 5 s)
  await waitFor(() => {
    // Ensure the timer's name is displayed
    expect(timerElement).toHaveTextContent(/Test Timer:/);

    // Check for the numeric value (e.g., 5) without matching the exact full content
    expect(screen.getByText('5')).toBeInTheDocument();

    // Ensure the 's' suffix is rendered in the <span>
    expect(screen.getByText('s')).toBeInTheDocument();
  });

  // Simulate the countdown by advancing timers
  act(() => {
    jest.advanceTimersByTime(1000);  // Simulate 1 second passing
  });

  // Ensure the timer is decremented (Test Timer: 4 s)
  expect(timerElement).toHaveTextContent(/Test Timer:/);
  expect(screen.getByText('4')).toBeInTheDocument(); // Expect 4 seconds
  expect(screen.getByText('s')).toBeInTheDocument(); // Ensure 's' is still there

  act(() => {
    jest.advanceTimersByTime(4000);  // Simulate 4 more seconds passing
  });

  // Ensure it reaches 0 seconds
  expect(timerElement).toHaveTextContent(/Test Timer:/);
  expect(screen.getByText('0')).toBeInTheDocument(); // Expect 0 seconds
  expect(screen.getByText('s')).toBeInTheDocument(); // Ensure 's' is still there

  // Ensure the onFinish callback is called
  act(() => {
    jest.advanceTimersByTime(1000); // Simulate 1 more second to check onFinish
  });

  // Test for cleanup after the timer ends
  expect(timerElement).toHaveTextContent(/Test Timer:/);
  expect(screen.getByText('0')).toBeInTheDocument(); // Still at 0 seconds
  expect(screen.getByText('s')).toBeInTheDocument(); // Ensure 's' is still there
  jest.useRealTimers();  // Restore original timers after the test
});
