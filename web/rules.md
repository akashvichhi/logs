# Development Rules & Guidelines

## 1. Tech Stack
* **Core:** React 19, TypeScript (strict mode), Vite
* **Routing:** react-router v7
* **UI Framework:** Ant Design v6
* **State & Data Fetching:** @tanstack/react-query v5
* **Forms:** react-hook-form + yup
* **HTTP Client:** axios
* **Styling:** SCSS modules

---

## 2. Project Structure
```text
src/
  assets/styles/     # Global SCSS variables and shared styles
  components/        # Reusable form fields and UI components (e.g., TextField, NavButton)
  constants/         # App-wide constants (e.g., ROUTES)
  hooks/             # Common and shared global hooks
  pages/             # One folder per route/module
    module_name/
      hooks.ts       # Module-level business logic hooks
      module.tsx     # Pure UI / Layout logic
      form.tsx       # Form-specific UI
      styles.module.scss
      index.ts       # Barrel export
  services/          # API calls and react-query hooks
  types/             # TypeScript interfaces
  utils/             # Pure utility functions
```

---

## 3. Components & UI
* **Arrow Functions:** All components must be written as arrow functions. Do **not** use `React.FC` or `React.FunctionalComponent`.
* **Memoization:** Every component must be wrapped in `memo()` upon export.
* **Inline Exports:** Use inline default exports for the memoized component.
  ```tsx
  // ✅ Correct
  const MyComponent = ({ title }: MyComponentProps) => {
    return <div>{title}</div>
  }
  export default memo(MyComponent)
  ```
* **React 19 Refs:** Do **not** use `forwardRef`. In React 19, pass `ref` as a standard prop to function components.
* **Navigation:** Always use the custom `NavButton` component for internal links. Never use `<a>` or react-router's `<Link>` directly. Use `ROUTES.*` constants for paths.

---

## 4. Hooks & Business Logic
* **Strict Separation:** UI components must remain "dumb." All business logic, state management, and complex data formatting must be extracted into custom hooks.
* **Hook Placement:**
  * **Global/Shared:** Place hooks used across multiple modules in `src/hooks/`.
  * **Module-Specific:** Place logic specific to a single page/feature in `src/pages/[module_name]/hooks.ts`.
* **Single Responsibility:** If a custom hook becomes too large or handles multiple disparate concerns, break it down into smaller, composable hooks.

```tsx
// Example: src/pages/dashboard/dashboard.tsx
import { useDashboardLogic } from './hooks'

const Dashboard = () => {
  const { userStats, isLoading, handleRefresh } = useDashboardLogic()

  if (isLoading) return <Loader />
  return <div onClick={handleRefresh}>{userStats}</div>
}
export default memo(Dashboard)
```

---

## 5. Forms & Validation
* **Libraries:** Exclusively use `react-hook-form` paired with `yup` resolvers.
* **Validation Schemas:** Define `yup` schemas outside the component scope as constants.
* **Custom Inputs:** Always use custom wrappers from `@src/components/form` (e.g., `TextField`, `SelectField`). **Never** use raw Ant Design `Input` or `Select` components inside a form.
* **Default Values:** Always provide `defaultValues` when initializing `useForm`.

---

## 6. Services & API
* **Encapsulation:** Raw API functions (e.g., `apiPost('/login', data)`) must remain **private** to the service file.
* **Exports:** Only export React Query custom hooks (e.g., `useLoginMutation`, `useUserProfile`).
* **Error Handling:** Handle API errors globally or within the mutation's `onError` callback using the custom message utility: `getMessageApi().error(error.message)`.
* **Data Transformation:** Rely on the configured axios instance to automatically handle camelCase (frontend) to snake_case (backend) conversions.

---

## 7. Styling
* **SCSS Modules:** Use SCSS modules (`styles.module.scss`) for all component styling. Avoid inline styles for layout or positioning.
* **Naming:** Use **kebab-case** for class names in the SCSS file (e.g., `.form-container`).
* **Usage:** Access classes in TSX using bracket notation: `className={styles['form-container']}`.
* **Global Overrides:** Use `ThemeConfig` in `antd_config.ts` to globally override Ant Design component styles instead of forcing styles with `!important`.

---

## 8. Naming Conventions & Imports
* **File Naming:** All files must use **snake_case** (e.g., `user_profile.tsx`, `auth_service.ts`).
* **Interfaces:** Prefix interfaces with `I` (e.g., `IUser`, `ILoginRequest`), except for component props which should be `[ComponentName]Props`.
* **Path Aliases:** Always use the `@src/*` path alias. **Never** use relative parent imports (`../`).
* **Import Order:** Maintain a strict import order with a blank line between groups:
  1. React and React Router
  2. External libraries (antd, axios, etc.)
  3. Internal `@src/*` imports
  4. Sibling imports (`./`)
  5. SCSS module styles