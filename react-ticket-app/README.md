# Ticket App - React Version

This is the React implementation of the ticket management web app.

## Frameworks & Libraries
* **React 18**
* **Vite** (Build Tool)
* **React Router DOM** (Routing)

## Setup and Execution
1.  Navigate to this directory: `cd react-ticket-app`
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## UI Components & State
* **State:** App-level state (auth) is managed in `App.jsx`. Local page state (forms, tickets) is managed in the respective page components.
* **Services:**
    * `authService.js`: Handles mock login/logout/signup and `localStorage` token (`ticketapp_session`).
    * `ticketService.js`: Handles mock CRUD operations for tickets, storing them in `localStorage`.
* **Routing:**
    * `main.jsx` sets up `BrowserRouter`.
    * `App.jsx` defines all routes (`/`, `/auth`, `/dashboard`, `/tickets`).
    * `ProtectedRoute.jsx` checks for the session token and redirects to `/auth` if not found.

## Accessibility
* Semantic HTML (`<header>`, `<footer>`, `<main>`, `<nav>`) is used.
* Forms include `<label>` elements.
* Focus states are visible (default browser).
* Status colors have been designed to be clear.

## Test User
* **Username:** admin@test.com
* **Password:** password123