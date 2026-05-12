# Weather Loading Dashboard Design

## Goal

Replace the current single-card loading treatment with a full weather-dashboard skeleton that matches the existing page layout more closely and appears whenever the weather forecast query is fetching after location or unit changes.

## Scope

This design only changes the weather-content loading experience on the home route.

Included:
- Loading treatment for the weather dashboard area
- Initial weather fetch after location is known
- Refetches caused by location changes
- Refetches caused by unit changes

Excluded:
- Search suggestions loading state
- Error-state redesign
- Non-home-route UI changes

## User Experience

The header, page title, search bar, and units menu remain visible and usable while weather data is loading.

When the weather query is pending or refetching, the forecast content area below the search section switches to a dashboard skeleton that mirrors the final layout:

- Large current-weather card with centered loading indicator
- Four weather stat cards with labels and placeholder values
- Daily forecast heading with seven placeholder tiles
- Hourly forecast side panel with heading, inactive day selector shell, and stacked placeholder rows

This skeleton appears both:
- on the first weather fetch after the app has coordinates to query
- on subsequent weather refetches triggered by unit or location changes

When the query settles successfully, the skeleton is replaced by the existing live weather components.

## Architecture

The route component remains the source of truth for whether the dashboard should render loading placeholders or live weather content.

### Loading Signal

Use the weather query state from `useWeatherForecast` only.

The dashboard loading state should be derived from:
- `isPending` for the first unresolved weather request
- `isFetching` for later background refetches caused by unit or location changes

City-search query activity must not trigger the dashboard skeleton.

### Rendering Structure

Introduce a dedicated loading-only component for the dashboard area rather than spreading loading markup across data components.

Recommended structure:
- `WeatherDashboardSkeleton`
- existing live components remain focused on rendering real weather data

The home route renders one of two branches for the forecast area:
- skeleton dashboard when weather is loading
- live dashboard when weather data is available and not actively being replaced by the loading treatment

This keeps the loading layout centralized and prevents individual components from needing partial placeholder logic.

## Component Design

### `WeatherDashboardSkeleton`

Responsible for rendering the full placeholder layout that matches the mockup and current page structure.

Suggested sections:
- current weather placeholder card
- stats placeholder row
- daily forecast placeholder section
- hourly forecast placeholder panel

This component should reuse the same major spacing and responsive breakpoints as the loaded dashboard to minimize layout shift.

### `CurrentWeather`

`CurrentWeather` should return to rendering only resolved weather content. It no longer needs to own the dashboard loading UI if the route is handling the full skeleton branch.

### Route Integration

The home route should compute a single `showWeatherSkeleton` boolean from weather query state and use it to switch the weather dashboard area between:
- `WeatherDashboardSkeleton`
- the current weather/stats/daily/hourly component group

## Responsive Behavior

The skeleton should preserve the current mobile-first layout and desktop split layout:

- stacked layout on smaller screens
- left main column plus right hourly panel on larger screens

Placeholder card sizes should follow the same width and spacing constraints as the live components so the page does not jump when data arrives.

## Visual Direction

Match the supplied reference image closely within the existing design system:

- same dark surface colors already used in the app
- rounded placeholder blocks that echo the live cards
- subtle loading indicator centered in the large hero card
- placeholder content should look intentionally designed, not generic grey bars

Avoid adding motion-heavy shimmer unless the codebase already uses that pattern; static or lightly animated placeholders are acceptable.

## Testing

Add coverage for route-level loading behavior.

Minimum tests:
- renders the dashboard skeleton when weather query is pending
- renders the dashboard skeleton when weather query is refetching
- renders the live dashboard when weather data is available and not fetching
- does not let city-search query activity alone trigger the dashboard skeleton

Component tests for the skeleton are optional if the route-level tests already verify the intended branch behavior.

## Risks And Mitigations

### Risk: skeleton appears for unrelated queries

Mitigation:
- derive loading only from `useWeatherForecast`

### Risk: layout shifts when data resolves

Mitigation:
- match live component dimensions and breakpoint behavior in the skeleton layout

### Risk: duplicated layout markup becomes hard to maintain

Mitigation:
- keep all placeholder-specific structure in one dedicated skeleton component
- keep real-weather components free of loading placeholders where possible

## Success Criteria

- Weather dashboard area matches the supplied mockup closely during loading
- Skeleton appears on initial weather fetch and on location/unit-triggered refetches
- Search typing alone does not trigger the dashboard skeleton
- Layout remains stable as loading resolves into real weather content
