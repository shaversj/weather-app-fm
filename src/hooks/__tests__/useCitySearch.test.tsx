import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCitySearch } from '../useCitySearch'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCitySearch', () => {
  it('returns empty when query < 2 chars', async () => {
    const { result } = renderHook(() => useCitySearch('a'), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
  })

  it('fetches cities when query >= 2 chars', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [{ id: 1, name: 'Springfield', latitude: 37.2, longitude: -93.3, country: 'US', timezone: 'America/Chicago' }] }),
    })

    const { result } = renderHook(() => useCitySearch('Spring'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toHaveLength(1)
  })
})
