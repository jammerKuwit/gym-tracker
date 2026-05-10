import { render, screen } from '@testing-library/react';
import App from './App';

test('renders My Exercises section', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /my exercises/i })
  ).toBeInTheDocument();
});
