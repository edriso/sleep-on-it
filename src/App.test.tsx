import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useSoiStore } from './store/soi-store';

function reset() {
  localStorage.clear();
  const d = createDefaultState();
  useSoiStore.setState({ settings: d.settings, items: d.items, kept: d.kept });
}
beforeEach(reset);
afterEach(() => vi.useRealTimers());

describe('Sleep On It', () => {
  it('renders the form and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Sleep On It' })).toBeVisible();
    expect(screen.getByText(/Nothing on hold/)).toBeInTheDocument();
  });

  it('adds an item to the on-hold list with a countdown', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('What do you want to buy?'), {
      target: { value: 'Headphones' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sleep on it' }));
    expect(screen.getByText('Headphones')).toBeInTheDocument();
    expect(screen.getByText(/sit with it/)).toBeInTheDocument();
  });

  it('lets a ripe item go and adds its price to the not-spent total', () => {
    vi.useFakeTimers();
    // An item added 25h ago is already ripe at a 24h hold.
    const past = Date.now() - 25 * 3600_000;
    useSoiStore.setState({ items: [{ id: 'a', name: 'Sneakers', price: 120, why: '', at: past }] });
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Let it go' }));
    expect(useSoiStore.getState().kept).toBe(120);
    expect(useSoiStore.getState().items).toHaveLength(0);
  });
});
