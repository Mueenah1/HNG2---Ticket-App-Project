# Ticket App - Vue.js Version

This is the Vue.js 3 implementation of the ticket management web app, using the Composition API.

## Frameworks & Libraries
* **Vue.js 3** (with Composition API `<script setup>`)
* **Vite** (Build Tool)
* **Vue Router 4** (Routing)

## Setup and Execution
1.  Navigate to this directory: `cd vue-ticket-app`
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## UI Components & State
* **State:** Global auth state (`isAuthenticated`) is managed in `App.vue` and passed as props or managed via the auth service. Local page state is managed in each View component using `ref` and `reactive`.
* **Services:**
    * The same `authService.js` and `ticketService.js` from the React build are reused here, as they are plain JavaScript.
* **Routing:**
    * `main.js` sets up the router plugin.
    * `router/index.js` defines all routes and the `beforeEach` navigation guard to protect routes by checking `authService.isAuthenticated()`.
* **Views:**
    * `App.vue` provides the main layout (`<header>`, `<footer>`, `<router-view>`).
    * Other `.vue` files are in `/views/` and represent pages.

## Accessibility
* Semantic HTML is used.
* Forms include `<label>` elements.
* Focus states are visible.

## Test User
* **Username:** admin@test.com
* **Password:** password123