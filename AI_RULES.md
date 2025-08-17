# AI Development Rules

This document provides guidelines for the AI assistant to follow when developing and modifying this application. The goal is to maintain code quality, consistency, and adherence to the established architecture.

## 1. Core Tech Stack

The application is built on a modern, lightweight tech stack. Adhere to these technologies:

-   **Framework**: React 18 with TypeScript for building a type-safe, component-based UI.
-   **Build Tool**: Vite is used for its fast development server and optimized production builds.
-   **Styling**: All styling is done with Tailwind CSS. Use utility classes directly in JSX.
-   **Routing**: `react-router-dom` is the sole library for handling client-side routing.
-   **Icons**: `lucide-react` provides the icon set for the entire application.
-   **Drag & Drop**: `react-dnd` is used for all drag-and-drop functionality, particularly in the Calendar view.
-   **Date & Time**: `date-fns` is the standard for all date parsing, formatting, and manipulation.
-   **Testing**: End-to-end tests are written using Playwright.

## 2. Library Usage Rules

To ensure consistency, use the specified libraries for their intended purposes. Do not introduce new libraries that provide overlapping functionality.

-   **UI Components**:
    -   **DO**: Build all components using React, TypeScript, and Tailwind CSS.
    -   **DO NOT**: Introduce other UI libraries like Material UI, Ant Design, or Bootstrap.

-   **Styling**:
    -   **DO**: Use Tailwind CSS utility classes for all styling.
    -   **DO NOT**: Write custom CSS files or use CSS-in-JS libraries like Emotion or Styled Components.

-   **State Management**:
    -   **DO**: Use React's built-in hooks (`useState`, `useReducer`, `useContext`) for state management.
    -   **DO NOT**: Add external state management libraries like Redux, Zustand, or MobX.

-   **Routing**:
    -   **DO**: Manage all routes within `src/App.tsx` using `react-router-dom`.
    -   **DO NOT**: Use any other routing library.

-   **Icons**:
    -   **DO**: Use icons exclusively from the `lucide-react` package.
    -   **DO NOT**: Add other icon libraries like Font Awesome or Material Icons.

-   **Date & Time**:
    -   **DO**: Use `date-fns` for all date-related operations.
    -   **DO NOT**: Use Moment.js, Day.js, or the native `Date` object for complex manipulations.

-   **Data Fetching**:
    -   **DO**: Use the browser's native `fetch` API for making network requests.
    -   **DO NOT**: Add data-fetching libraries like Axios, React Query, or SWR unless explicitly required for a complex feature.

-   **Forms**:
    -   **DO**: Create forms as controlled components using React's `useState` hook.
    -   **DO NOT**: Add form management libraries like Formik or React Hook Form.