# FRONTEND_V2_STYLE

## meta

- scope: `frontend/` only
- stack:
  - React + Vite + TypeScript
  - Tailwind CSS (utility-first styling)
  - Radix UI primitives (headless components, especially for buttons, dialogs, toasts)
- goal:
  - Transform the current frontend into a **dark, minimal, infra-grade UI**:
    - Black / near-black surfaces
    - Card-based layout
    - Clean typography
    - Monospace for commands and IDs
    - Copyable code snippets
    - Modern status badges

---

## 1. Tailwind CSS Integration

### 1.1 Install Tailwind

In `frontend/`:

- Install:

  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- Configure `tailwind.config.js`:

  - `content` must include all React files:

    ```js
    content: ["./index.html", "./src/**/*.{ts,tsx}"]
    ```

  - Enable dark palette by default (no need for `darkMode: "class"` yet).

### 1.2 Base Styles

Update `src/index.css` to:

- Import Tailwind layers:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- Set dark global body:

  ```css
  body {
    @apply bg-[#050509] text-slate-100 antialiased;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
  }

  a {
    @apply text-sky-400 hover:text-sky-300;
  }
  ```

Remove old global typography/body styles that conflict.

---

## 2. Radix UI Integration

Use Radix primitives for better base components without heavy styling.

### 2.1 Install core

```bash
npm install @radix-ui/react-slot
```

> Note: full Radix library is optional. For now, you can keep usage minimal: just `Slot` to build a reusable Button.

### 2.2 Shared UI Components

Create `src/components/ui/Button.tsx` (or similar) implementing a basic styled button:

- Props:
  - `variant` (`primary`, `outline`, `ghost`)
  - `size` (`sm`, `md`)
- Styling:
  - Tailwind classes only
  - Dark theme friendly

This Button will be used across pages instead of ad-hoc `<button style={...}>` elements.

---

## 3. Layout Shell (Global Chrome)

### 3.1 `Layout.tsx` redesign

File: `src/components/Layout.tsx`

Replace inline styles with:

- A full-height dark shell.
- A top header bar with:
  - Logo / name on the left (“ALFA DELFA”).
  - Navigation (Projects, Labs) and logout on the right for authenticated users.
- Main content region centered with max width.

Example structure (not exact code, but target shape):

```tsx
export default function Layout() {
  const { loggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#050509] text-slate-100">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-black/60 backdrop-blur">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            ALFA DELFA
          </Link>
          {loggedIn && (
            <nav className="flex items-center gap-4 text-sm">
              <Link to="/projects" className="text-slate-300 hover:text-white">
                Projects
              </Link>
              <Link to="/labs" className="text-slate-300 hover:text-white">
                Labs
              </Link>
              <button
                onClick={logout}
                className="border border-slate-600 rounded-md px-3 py-1 text-slate-200 hover:bg-slate-800"
              >
                Log out
              </button>
            </nav>
          )}
        </header>
        <main className="flex-1 px-6 py-6 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Constraints:

- No inline styles in Layout.
- Only Tailwind classes.

---

## 4. Core Page Patterns

All main pages should transition to **card-based layouts** with Tailwind, replacing inline styles.

### 4.1 Card Component Pattern

You may define a simple Card component (optional) or just keep a pattern:

```tsx
<div className="rounded-xl border border-slate-800 bg-black/60 p-5 shadow-sm">
  {/* content */}
</div>
```

This pattern should be used for:

- Getting Started steps
- Projects list
- Runs tables
- Run detail view

---

## 5. Page-Specific Style Requirements

### 5.1 GettingStartedPage

File: `src/pages/GettingStartedPage.tsx`

Visual requirements:

- One main card with title + subtitle.
- Inside, **three step cards**, stacked vertically:
  - Each step:
    - Step number
    - Title
    - Short description
    - Dark code block with command(s)
    - Copy button

Styling:

- Use the card pattern.
- Code block:

  ```tsx
  <pre className="bg-[#050612] border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-100 overflow-x-auto">
    ...
  </pre>
  ```

- Copy button: small button (use shared Button component once created).

Functionality:

- Step 3 must show `alfa run --project <project-id> -- python train.py` with a **real project ID** (as per AGENT_TASK_ALFA_V2). Project logic is separate; here you focus on presentation (use props/state provided).

### 5.2 ProjectsPage

File: `src/pages/ProjectsPage.tsx`

Replace table with:

- A “New Project” inline form inside a card.
- A grid or stacked list of project cards:
  - Project name
  - Description
  - Created at (“X days ago” if time utility exists; otherwise keep iso as v1).
  - “View runs” link.

Visual style:

- Each project as:

  ```tsx
  <div className="rounded-lg border border-slate-800 bg-black/40 px-4 py-3 hover:border-slate-700 hover:bg-black/60 transition-colors">
    ...
  </div>
  ```

### 5.3 ProjectRunsPage

File: `src/pages/ProjectRunsPage.tsx`

Two main sections:

1. **CLI Snippet Card** (top):

   - Title: “Run this project from your terminal”
   - Code block:

     ```bash
     alfa run --project <project-id> -- python train.py
     ```

   - Copy button aligned right.

   ```tsx
   <div className="rounded-xl border border-slate-800 bg-black/60 p-4 mb-4">
     <div className="flex items-center justify-between gap-3">
       <div>
         <h2 className="text-sm font-medium text-slate-200">Run this project from your terminal</h2>
       </div>
       <button ...>Copy</button>
     </div>
     <pre className="mt-2 bg-[#050612] border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-100 overflow-x-auto">
       alfa run --project {projectId} -- python train.py
     </pre>
   </div>
   ```

2. **Runs Table Card**:

   - Card wrapper.
   - Table with dark header and subtle row borders.
   - Use monospace for IDs and commands.
   - Status badge component.

### 5.4 RunDetailPage

File: `src/pages/RunDetailPage.tsx`

Current page uses inline styles and a plain table. Upgrade to:

- A single card wrapping:
  - Back link.
  - Title: “Run abc12345”.
  - Grid/table of fields (`status`, `command`, `git commit`, dirs, timestamps).
- Metrics (if present) in a second card with:

  - Dark header row.
  - Monospace for keys and values.

---

## 6. StatusBadge Component

File: `src/components/StatusBadge.tsx` (or similar)

Implement a reusable status badge using Tailwind:

- Variants for statuses: `pending`, `running`, `success`, `failure`.
- Colors:

  - `pending`: amber
  - `running`: sky
  - `success`: emerald
  - `failure`: red

Example style:

```tsx
const COLORS: Record<string, string> = {
  pending: "bg-amber-500/80 text-black",
  running: "bg-sky-500/80 text-black",
  success: "bg-emerald-500/80 text-black",
  failure: "bg-rose-500/80 text-black",
};

export default function StatusBadge({ status }: { status: string }) {
  const color = COLORS[status] ?? "bg-slate-600 text-slate-100";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
```

Use this in `ProjectRunsPage` and `RunDetailPage`.

---

## 7. General Rules

- **No inline styles** in the v2 layout and key pages (Layout, GettingStarted, Projects, ProjectRuns, RunDetail).
- Use Tailwind classes consistently for spacing, colors, typography.
- Use `font-mono` for:
  - Run IDs
  - Commands
  - Git commit hashes
  - Code snippets
- Keep the palette restrained:
  - Backgrounds: `#050509`, `#02030a`, `#0b0b12` with subtle borders (`border-slate-800`).
  - Text: `text-slate-100`, `text-slate-300`.
  - Accent: `text-sky-400`, `border-sky-500` sparingly.

---

## 8. Validation Checklist

- [ ] Tailwind is installed and working (classes take effect).
- [ ] Layout uses dark shell with no inline styles.
- [ ] Getting Started page uses card layout, monospace code blocks, and copy buttons.
- [ ] Projects page uses cards instead of plain table.
- [ ] ProjectRuns page:
  - [ ] Has CLI snippet card with copy button.
  - [ ] Uses dark table and StatusBadge.
- [ ] RunDetail page uses a card and new StatusBadge style.
- [ ] Overall app reads as a coherent dark, minimal, infra-grade dashboard.