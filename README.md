# carshenas-front-end

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
pnpm test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
pnpm build
pnpm test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## VSCODE

For an improved development experience, we recommend using the following extensions:

- **Vue language feature (Volar)**: Enhances Vue.js development by providing advanced language features and improved performance.
- **ESLint**: Helps maintain code quality by identifying and fixing common programming errors and enforcing code style.
- **Prettier**: Automatically formats your code to ensure a consistent and readable style across your project.
- **Better Comments**: Allows you to create more informative and visually distinct comments in your code for better readability.
- **Code Spell Checker**: Identifies and highlights spelling errors in your code, reducing typos and improving code quality.
- **Vue 3 VS Code Snippets**: Vue 3 snippets for VS Code.
- **Vitest**: Run and debug Vitest test cases.
- **Cody**: Free AI coding assistant that can write, understand, fix, and find your code.

**Ensure your workspace doesn't include these extensions:**

- **Vetur**: As it might conflict with or duplicate functionality provided by Volar for Vue.js development.
- **TODO Highlight**: As it might not be necessary when using ESLint and other code analysis tools.
- **Typescript Vue Plugin (Volar)**: A plugin that augments TypeScript support for Vue.js, offering better code intelligence and tooling.

**Do not change .vscode folder settings**

## Main Dependencies

- **[Vue.js](https://github.com/vuejs/vue) (v3.2.0):**
  The progressive JavaScript framework.

- **[Vuetify](https://github.com/vuetifyjs/vuetify) (v3.0.0):**
  Material Design component framework.

- **[Pinia](https://github.com/posva/pinia) (^2.0.23):**
  State management for Vue.js.

- **[Vue Router](https://github.com/vuejs/vue-router) (^4.0.0):**
  Official router for Vue.js.

- **[Vite](https://github.com/vitejs/vite) (v4.2.0):**
  Fast, modern, lightweight build tool.
