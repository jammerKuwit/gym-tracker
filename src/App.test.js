import { render, screen } from '@testing-library/react';
import App from './App';

test('renders My Exercises on Home', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /my exercises/i })
  ).toBeInTheDocument();
});
