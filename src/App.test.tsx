import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('lets a budget-conscious shopper generate an aisle-by-aisle cooking route', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('heading', { name: /an app that turns real ingredients into healthy meals/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /30022 stores/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /grab this\. cook that/i })).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/zip code/i));
    await user.type(screen.getByLabelText(/zip code/i), '30022');
    await user.clear(screen.getByLabelText(/weekly budget/i));
    await user.type(screen.getByLabelText(/weekly budget/i), '45');
    await user.clear(screen.getByLabelText(/household size/i));
    await user.type(screen.getByLabelText(/household size/i), '2');
    await user.click(screen.getByRole('button', { name: /tuna/i }));
    await user.click(screen.getByRole('button', { name: /build my store route/i }));

    expect(screen.getByText(/aisle-by-aisle answer/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /produce section grab/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /meat counter \/ protein grab/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /condiments \+ spices/i })).toBeInTheDocument();
    expect(screen.getByText(/30022 pilot seed data/i)).toBeInTheDocument();
    expect(screen.queryByText(/canned tuna/i)).not.toBeInTheDocument();
  });
});
