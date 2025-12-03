# Mortgage Calculator

This project is a minimally viable product (MVP) built as a learning exercise to solidify my understanding of modern React development, Vite, and custom financial calculations.

## Tools

* **Framework:** React
* **Bundler/Tooling:** Vite
* **Styling:** Tailwind CSS

## Lessons Learned & Modern Development Practices

This project involved migrating from older tooling and learning the modern, efficient ways to structure a React application:

1.  **Modern React Compilation:**
    * The application utilizes React v19's Compiler, which automatically handles memoization and optimization.
    * This eliminates the need for manual caching with hooks like [`useMemo`](https://react.dev/reference/react/useMemo), allowing the compiler to manage caching of expensive calculation results between renders more efficiently.
2.  **Migrating to Vite:**
    * The initial architecture used Create React App (CRA), which relies on Webpack for bundling.
    * I migrated the project to **Vite**, the modern standard for fast development and bundling, after noting that [CRA has been sunset](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) as of February 2025.
3.  **Integrating Modern Tailwind CSS (v4):**
    * This was a major learning point. The traditional Tailwind setup that relied on generating `tailwind.config.js` and `postcss.config.js` files is no longer the recommended practice.
    * **New Implementation:** Tailwind CSS was successfully integrated into the Vite project using the dedicated `@tailwindcss/vite` plugin.
    * **Configuration:** The setup was finalized by adding the core directives to the global CSS file, which allows the Vite plugin to generate and inject all necessary classes during build.


This project is still a work in progress and serves as a continuous platform for me to learn how to build modern web applications using React, Vite, Tailwind, and other essential front-end tools and frameworks.

See my work here: [johnlilly.dev](johnlilly.dev)