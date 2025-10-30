# Form Editor - AI Coding Instructions

## Project Overview
This is a **visual form builder** built with React, TypeScript, and Vite. Users drag form controls from a toolbox onto a canvas to create forms with dynamic column-based layouts and inline resizing.

## Core Architecture

### State Management (Jotai + Immer)
- **`src/store/formStore.ts`**: Central form state using `atomWithImmer<FormRow[]>`
- **`src/store/debugAtom.ts`**: Development debugging system with activity tracking
- Pattern: Use `getDefaultStore().set(formAtom, (prev) => { /* mutate prev */ })` for updates

### Form Data Structure
```typescript
FormRow[] -> FormRow { elements: FormElement[] }
FormElement {
  id: string,           // "text-abc123" format  
  type: FormControlType, // from formElementTemplates
  colSpan: [number, number], // [colStart, colEnd] for CSS Grid
  resized: boolean      // tracks manual column adjustments
}
```

### Drag & Drop System (@dnd-kit/core)
- **`src/FormEditor/useDragState.ts`**: Handles two drag types:
  1. **Template dragging**: From toolbox to form surface
  2. **Resize dragging**: Column boundary adjustments with live preview
- **`DraggableEventData`** type discriminates drag sources
- **Resize grid**: 12-column system with `ResizeAnchor` components

## Key Development Patterns

### Component Renderers
- **`src/FormEditor/components/FormElement/renderers.tsx`**: Maps form types to React components
- Add new form controls: Update `formElementTemplates` + add renderer
- All renderers receive `{ element: FormElement; isResizing: boolean }`

### Grid Layout System
- Uses CSS Grid with 12 columns for responsive layout
- **`redistributeCols()`** automatically divides space equally
- **Manual resize** sets `element.resized = true` and preserves custom `colSpan`

### Debug Infrastructure (Development Mode)
- **`src/components/DebugOverlay.tsx`**: Real-time state inspection overlay
- **Activity system**: Track temporary operations (drag, resize) with automatic cleanup
- Use `createActivity()` for operations that need debug context

## Development Commands
```bash
pnpm dev          # Start development server with debug overlay
pnpm build        # TypeScript compilation + Vite build
pnpm lint         # ESLint with TypeScript-aware rules
pnpm format       # Prettier formatting
```

## File Organization
```
src/FormEditor/           # Main form editor module
├── FormEditor.tsx        # Root component with DndContext
├── FormEditor.types.ts   # Core type definitions
├── FormEditor.constants.ts # formElementTemplates registry
├── useDragState.ts       # Drag & drop state management
└── components/
    ├── Toolbox.tsx       # Draggable form controls
    ├── Properties.tsx    # Selected element properties panel
    └── FormElement/      # Form element rendering & interactions

src/store/               # Global state (Jotai atoms)
src/components/ui/       # Shadcn/ui components
```

## Critical Integration Points
- **Radix UI**: All form controls use `@radix-ui/react-*` primitives
- **Tailwind CSS v4**: Uses new CSS-first approach with `@tailwindcss/vite`
- **Path alias**: `@/` maps to `src/` (configured in `vite.config.ts`)

## Adding New Form Elements
1. Add type to `FormControlType` in `FormEditor.types.ts`
2. Add template to `formElementTemplates` in `FormEditor.constants.ts`
3. Add renderer to `renderers` object in `renderers.tsx`
4. Add properties handling in `Properties.tsx` if needed

## Testing Elements
- Use the **debug overlay** (development mode) to inspect form state
- Drag elements from toolbox to test placement
- Click elements to test property panel integration
- Drag resize anchors to test column adjustments