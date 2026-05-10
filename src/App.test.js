import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Home heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /home/i })).toBeInTheDocument();
});
