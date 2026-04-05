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
  assets/styles/          # Global SCSS variables and shared styles
  components/             # Reusable form fields and UI components
    layouts/              # Global structural wrapper components
      app_layout/         # Main authenticated shell (Sidebar, Header, Content)
        app_layout.tsx
        styles.module.scss
      auth_layout/        # Login/Register structural wrapper
        auth_layout.tsx
        styles.module.scss
  constants/              # App-wide constants (e.g., ROUTES)
  hooks/                  # Common and shared global hooks
  pages/                  # One folder per route/module
    module_name/
      hooks.ts            # Complex business logic and shared module state (if needed)
      [module_name].tsx   # Main page wrapper (Layout, Page Header, composes Table/Form)
      table.tsx           # Ant Design Table component (receives data via props)
      form.tsx            # Form component (react-hook-form + mutations)
      styles.module.scss
      index.ts            # Barrel export
  services/               # API calls and react-query hooks
  types/                  # TypeScript interfaces
  utils/                  # Pure utility functions
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
* **Smart Containers vs. Dumb Presentational Components:** * Page wrappers (e.g., `module.tsx`) act as "Smart Containers." They are responsible for calling `useQuery` hooks to fetch list data and passing it down.
* UI components like `table.tsx` must be "Dumb Presentational Components." They should never fetch their own data; they must accept `data` and `isLoading` states purely via props.
* **Maximize Ant Design Components:** You MUST prioritize Ant Design's native components over custom HTML/CSS. 
  * Use `<Flex>`, `<Space>`, or `<Grid>` for layouts instead of custom `display: flex` CSS.
  * Use `<Typography.Text>` and `<Typography.Title>` for text. Use `type="secondary"` instead of custom muted classes. Use `code` prop for monospace text.
  * Use `<Alert>` or `<Message>` for warnings and notifications instead of custom warning boxes.
  * **Zero-CSS Policy:** Only write custom SCSS in the `styles.module.scss` file if it is mathematically impossible to achieve the layout using Ant Design's built-in props and spacing components.
* **No Native HTML Elements:** You are strictly forbidden from using raw HTML interactive or typography tags. 
  * Never use `<button>`; use Ant Design's `<Button>`.
  * Never use `<a>`; use Ant Design's `<Typography.Link>` for external links, or our custom `<NavButton>` for internal routing.
  * Never use `<p>`, `<span>`, or `<h1>`-`<h6>`; use Ant Design's `<Typography.Paragraph>`, `<Typography.Text>`, and `<Typography.Title>`.
  * **Standalone Table Action Cells:** Table columns that contain interactive actions (e.g., Edit, Delete, Revoke) MUST handle their own logic and API mutations. Do not pass action handlers (like `onDelete`) down from the parent wrapper through props. Instead, create a dedicated, isolated component (e.g., `<ActionCell record={record} />`), render it directly from the column's `render` property in your `constants.ts` file, and let that cell component handle its own React Query mutations.
  * **Layout Components:** Global structural wrappers MUST be placed in `src/components/layouts/`. Each layout (e.g., `app_layout`, `auth_layout`) must have its own isolated folder containing its `.tsx` file and its own `styles.module.scss` file. Use Ant Design's `<Layout>`, `<Layout.Header>`, and `<Layout.Sider>` components as the foundation before writing custom SCSS.

---

## 4. Hooks & Business Logic
* **Strict Separation:** UI components must remain "dumb." All business logic, state management, and complex data formatting must be extracted into custom hooks.
* **Hook Placement:**
  * **Global/Shared:** Place hooks used across multiple modules in `src/hooks/`.
  * **Module-Specific:** Place logic specific to a single page/feature in `src/pages/[module_name]/hooks.ts`.
* **Single Responsibility:** If a custom hook becomes too large or handles multiple disparate concerns, break it down into smaller, composable hooks.
* **The Form Exception:** Simple form wiring (initializing `useForm`, defining `defaultValues`, and calling a React Query mutation on submit) is considered UI/API glue, not business logic. This code should live directly inside `form.tsx`.
* **When to use `hooks.ts`:** Extract logic to `hooks.ts` only when dealing with complex derived state, multi-step wizards, heavy data transformations before/after API calls, or shared state needed by multiple components on the page.
* **Hooks vs. Utilities:** A custom hook (`useSomething`) MUST use React primitives (e.g., `useState`, `useEffect`, `useContext`, or other hooks). If a function merely takes inputs and returns formatted outputs without relying on React state (e.g., color mappers, string formatters), it is a pure utility. **Never** wrap pure functions in a custom hook.

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
* **Encapsulation & Naming:** Raw API request functions must be named based on their action and subject (e.g., `getLogs`, `createApiKey`, `deleteUser`) and must remain **private** to the service file.
* **React Query Naming Conventions:** You MUST explicitly name all exported React Query hooks to match their underlying private request function, prefixed with `use`:
  * **Queries (GET):** A private request function named `getLogs` MUST be exported as the custom hook `useGetLogs`.
  * **Mutations (POST/PUT/DELETE):** A private request function named `createApiKey` MUST be exported as the custom hook `useCreateApiKey` (apply this same pattern for `useUpdate...`, `useDelete...`, etc.).
* **Exports:** Only export the formatted React Query custom hooks. Never export the raw Axios API calls.
* **Error Handling:** Handle API errors globally or within the mutation's `onError` callback using the custom message utility.
* **Data Transformation:** Rely on the configured axios instance to automatically handle camelCase (frontend) to snake_case (backend) conversions.
* **Query Invalidation:** Always invalidate the relevant useQuery cache inside the onSuccess callback of a mutation.

---

## 7. Styling
* **SCSS Modules:** Use SCSS modules (`styles.module.scss`) for all component styling. Avoid inline styles for layout or positioning.
* **Naming:** Use **kebab-case** for class names in the SCSS file (e.g., `.form-container`).
* **Usage:** Access classes in TSX using bracket notation: `className={styles['form-container']}`.
* **Global Overrides:** Use `ThemeConfig` in `antd_config.ts` to globally override Ant Design component styles instead of forcing styles with `!important`.

---

## 8. Naming Conventions & Imports
* **File Naming:** All files must use **snake_case** (e.g., `user_profile.tsx`, `auth_service.ts`).
* **Interfaces:** Prefix interfaces with `I` (e.g., `IUser`, `ILoginRequest`).
* **Types:** Prefix types with `T` (e.g., `TUser`, `TLoginRequest`).
* **Path Aliases:** Always use the `@src/*` path alias. **Never** use relative parent imports (`../`).
* **Import Order:** Maintain a strict import order with a blank line between groups:
  1. React and React Router
  2. External libraries (antd, axios, etc.)
  3. Internal `@src/*` imports
  4. Sibling imports (`./`)
  5. SCSS module styles

## 9. Performance & Memoization (`memo`, `useMemo`, `useCallback`)

To prevent unnecessary re-renders, especially in our Smart/Dumb component architecture, we strictly adhere to the following memoization rules:

* **Component Exports (`React.memo`):** All "Dumb" (presentational) components MUST be wrapped in `React.memo` inline at the export level. 
  *✅ Correct:* `export const Table = memo(({ data }) => { ... });`
* **Function Props (`useCallback`):** Any function created inside a Smart component that is passed down as a prop to a memoized Dumb component MUST be wrapped in `useCallback`.
  *✅ Correct:* `const handleRevoke = useCallback((id) => { revoke(id); }, [revoke]);`
* **Object/Array Props (`useMemo`):** Any derived object or array created inside a component that is passed down as a prop MUST be wrapped in `useMemo` to preserve referential equality.
  *✅ Correct:* `const tableColumns = useMemo(() => [ ... ], []);`
* **Avoid Premature Optimization:** Do not use `useMemo` or `useCallback` for primitives (strings, booleans, numbers) or if the component is an absolute leaf node with no props.

---

## 10. TypeScript Standards
* **No `any` Type:** You are strictly forbidden from using the `any` type. If the data shape is truly unknown, use `unknown` and perform type narrowing, or define a precise generic type/interface.
* **Verbatim Module Syntax:** Our `tsconfig.json` enforces `verbatimModuleSyntax: true`. You MUST use the `type` keyword when importing TypeScript interfaces or types (e.g., `import type { IApiKey } from './types';`).

**Rule: You MUST use the `type` keyword when importing TypeScript interfaces or types.**

**Option A: Type-only imports (Preferred for strictly type files)**
When importing only types from a file, place the `type` keyword before the curly braces:
* ❌ *Incorrect:* `import { IApiKey, LogEntry } from '@src/types/api_key';`
* ✅ *Correct:* `import type { IApiKey, LogEntry } from '@src/types/api_key';`

**Option B: Mixed imports**
If you are importing a value (like a constant or function) alongside a type from the same file, place the `type` keyword directly next to the type name inside the braces:
* ❌ *Incorrect:* `import { IApiKey, defaultPrefix } from '@src/types/api_key';`
* ✅ *Correct:* `import { type IApiKey, defaultPrefix } from '@src/types/api_key';`

## 11. Co-location & File Scope (Constants, Utils, Types)
To prevent bloated components and maintain a feature-driven architecture, strictly adhere to the following co-location rules:
* **Types:** TypeScript interfaces and types specific to a module MUST be defined inside a `types.ts` file within that module's folder (e.g., `src/pages/module_name/types.ts`). Global `src/types/` should only be used for app-wide interfaces.
* **Constants:** Never define static objects, dropdown options, table columns configurations, or magic strings directly inside a `.tsx` file. Extract them to a `constants.ts` (or `constant.ts`) file within the module folder.
* **Utilities:** Pure functions that do not rely on React state or lifecycle (e.g., color mapping, date formatting, data parsing) MUST be placed in `utils.ts`. Do not define them inside `.tsx` components and do not wrap them in custom hooks. Import them directly where needed.
