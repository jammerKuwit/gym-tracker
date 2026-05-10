import { render, screen } from '@testing-library/react';
import App from './App';

test('renders personalized greeting on Home', () => {
  render(<App />);
  expect(screen.getByText(/jamin/i)).toBeInTheDocument();
  expect(screen.getByText(/morning|evening/i)).toBeInTheDocument();
});
