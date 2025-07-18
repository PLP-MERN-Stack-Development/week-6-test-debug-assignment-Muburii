import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../../App';

const server = setupServer(
  rest.get('/api/bugs', (req, res, ctx) => {
    return res(ctx.json([
      { _id: '1', title: 'Bug 1', description: 'First bug', severity: 'high' },
      { _id: '2', title: 'Bug 2', description: 'Second bug', severity: 'medium' }
    ]));
  }),
  rest.post('/api/bugs', (req, res, ctx) => {
    return res(ctx.json({
      _id: '3',
      ...req.body
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Bug Management Flow', () => {
  test('displays bugs and allows adding new ones', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for bugs to load
    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Bug 2')).toBeInTheDocument();
    });

    // Add a new bug
    await user.type(screen.getByLabelText(/title/i), 'New Bug');
    await user.type(screen.getByLabelText(/description/i), 'New bug description');
    await user.selectOptions(screen.getByLabelText(/severity/i), 'critical');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify new bug appears
    await waitFor(() => {
      expect(screen.getByText('New Bug')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/bugs', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/error loading bugs/i)).toBeInTheDocument();
    });
  });
});