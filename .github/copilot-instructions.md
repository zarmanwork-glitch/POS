# Point of Sale Application - AI Agent Instructions

## Architecture Overview

This is a **Next.js 16 Point of Sale (POS) dashboard** using the App Router pattern with TypeScript. The application manages business operations including profiles, documents (invoices, credit/debit notes), and item inventory.

### Core Structure

- **App Router** (`app/` directory): Route-based page components with nested layouts for admin dashboard
- **UI Components** (`components/ui/`): Radix UI primitives + Tailwind CSS (class-variance-authority for variants)
- **Layout System** (`components/layout/`, `components/base-components/`): ClientShell wraps authenticated routes with Navbar + resizable Sidebar
- **Navigation**: JSON-driven sidebar (`json/sidebar-items.json`) with hierarchical menu structure using icon mapping

### Key Design Patterns

1. **Client-Side State in Layout**: `ClientShell` manages sidebar width/collapse state persisted to `localStorage`. Uses ref-based mouse event handling for drag-to-resize functionality.

2. **Route-Based Authentication**: Auth pages (sign-in, sign-up) detected via pathname check; non-auth routes wrapped in navbar + sidebar layout.

3. **JSON-Driven Navigation**: Sidebar items defined in JSON with icon string keys mapped to Lucide React icons in the Sidebar component.

4. **Tailwind + CVA Pattern**: All components use `class-variance-authority` for composable style variants (see `components/ui/button.tsx` for pattern).

## Critical Developer Workflows

### Development

```bash
bun run dev    # Next.js dev server on localhost:3000
bun run build  # Production build
bun run lint   # ESLint with eslint-config-next
```

### TypeScript Path Alias

Use `@/` for absolute imports (configured in `tsconfig.json`):

```tsx
import { Button } from '@/components/ui/button';
import { SIDEBAR } from '@/components/layout.constants';
```

## Project-Specific Conventions

### Sidebar Navigation Updates

When modifying navigation:

1. Update `json/sidebar-items.json` with new routes + icon names
2. Ensure icon name exists in `iconMap` in `components/base-components/Sidebar.tsx`
3. Available icons from `lucide-react`: LayoutGrid, User, FileText, Users, Mail, UserPlus, BarChart2, ChevronDown, ChevronLeft

### Component Hierarchy

- **Page Components** (`app/*/page.tsx`): 'use client' if interactive, route-based
- **Layout Components** (`components/layout/`, `components/base-components/`): Often 'use client' for state management
- **UI Components** (`components/ui/`): Composition of Radix UI + Tailwind, reusable across pages

### Resizable Sidebar State

The sidebar persists to localStorage with structure:

```typescript
{ width: number, collapsed: boolean }
```

Access in ClientShell via `useRef(resizing)` and mouse event listeners for smooth dragging.

## Integration Points

### External Dependencies

- **Radix UI**: Primitives for dialog, dropdown, select, tabs (`@radix-ui/*`)
- **Lucide React**: Icon library (18px sizing convention)
- **Next.js 16**: Image optimization, font loading (Geist font), ESLint
- **Tailwind CSS v4**: PostCSS-based, with tw-animate-css for animations

### Cross-Component Communication

- Sidebar opens/closes via `ClientShell` state → passed as props to `Sidebar` component
- Page content adapts to sidebar width via CSS variables (managed in ClientShell)
- Authentication routing determined by pathname in ClientShell

## File Reference Guide

| File                                     | Purpose                                                        |
| ---------------------------------------- | -------------------------------------------------------------- |
| `components/layout/ClientShell.tsx`      | Root layout manager; sidebar resize logic, auth page detection |
| `components/base-components/Sidebar.tsx` | Navigation rendering + icon mapping                            |
| `json/sidebar-items.json`                | Navigation structure definition                                |
| `components/ui/button.tsx`               | CVA-based button example (pattern for all UI components)       |
| `types/sidebarTypes.ts`                  | Sidebar-related TypeScript types                               |
| `components/layout.constants.ts`         | Sidebar width constants (MIN/DEFAULT/MAX/XXL_MAX)              |

## Testing & Validation

- **Lint**: `bun run lint` uses ESLint with Next.js config
- **Type Safety**: Strict TypeScript mode enabled; check for `@types/` packages
- **UI Testing**: No test framework detected; focus on storybook or manual testing in dev mode
