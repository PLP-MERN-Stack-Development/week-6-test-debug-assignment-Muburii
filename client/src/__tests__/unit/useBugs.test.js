import { renderHook, waitFor } from '@testing-library/react';
import { useBugs } from '../../hooks/useBugs';

// Mock fetch
global.fetch = jest.fn();

describe('useBugs Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetches bugs successfully', async () => {
    const mockBugs = [
      { id: 1, title: 'Bug 1', severity: 'high' },
      { id: 2, title: 'Bug 2', severity: 'medium' }
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBugs
    });

    const { result } = renderHook(() => useBugs());

    expect(result.current.loading).toBe(true);
    expect(result.current.bugs).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.bugs).toEqual(mockBugs);
      expect(result.current.error).toBe(null);
    });
  });

  test('handles fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useBugs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Network error');
      expect(result.current.bugs).toEqual([]);
    });
  });
});