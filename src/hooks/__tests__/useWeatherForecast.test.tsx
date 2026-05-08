import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

import { fetchWeather, useWeatherForecast } from '../useWeatherForecast'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useWeatherForecast', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('does not fetch when lat/lon are null', () => {
    const spy = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useWeatherForecast(null, null), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
    expect(spy).not.toHaveBeenCalled()
  })

  it('throws error when response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    })

    await expect(fetchWeather(37.2, -93.3)).rejects.toThrow('Weather fetch failed')
  })

  it('fetches weather when lat/lon provided', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        current: { precipitation: 0, relative_humidity_2m: 92, temperature_2m: 65.9, time: '2025-11-18T15:00', weather_code: 3, wind_speed_10m: 19.5 },
        daily: { precipitation_probability_max: [25], temperature_2m_max: [72.9], temperature_2m_min: [56.6], time: ['2025-11-18'], weather_code: [3] },
        hourly: { temperature_2m: [65.9], time: ['2025-11-18T15:00'], weather_code: [3] },
        latitude: 37.2,
        longitude: -93.3,
      }),
      ok: true,
    })

    const { result } = renderHook(() => useWeatherForecast(37.2, -93.3), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data?.current.temperature_2m).toBe(65.9)
  })
})