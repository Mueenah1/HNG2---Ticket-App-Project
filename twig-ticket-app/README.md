# Ticket App - Twig (PHP) Version

This is the Twig implementation of the ticket management web app. This version runs on a **PHP server** and uses PHP sessions for authentication.

## Frameworks & Libraries
* **PHP** (Server Language)
* **Twig** (Templating Engine)
* **Composer** (PHP Package Manager)

## Setup and Execution
1.  **IMPORTANT:** This project must be run from a PHP server (like XAMPP or MAMP).
2.  Place the entire `TicketApp_Project` folder inside your server's root directory (e.g., `htdocs` for XAMPP).
3.  Navigate to this directory in your terminal: `cd twig-ticket-app`
4.  Install Twig: `composer install`
5.  Make sure your Apache server is running.
6.  Open your browser and navigate to: `http://localhost/TicketApp_Project/twig-ticket-app/landing.php`

## UI Components & State
* **State:** Authentication state is managed using **PHP Sessions** (`$_SESSION['ticketapp_session']`).
* **Logic:** Each `.php` file acts as a "controller." It handles form submissions, manages session data, and then renders a Twig template.
* **Templates:** All UI is in the `/templates/` folder.
    * `_layout.twig` is the master template (header, footer).
    * Other templates (`landing.twig`, `tickets.twig`) extend the layout.
* **Data:** Tickets are stored in the PHP session (`$_SESSION['tickets']`) to mock a database, similar to how the JS apps use `localStorage`.

## Accessibility
* Semantic HTML is used.
* Forms include `<label>` elements.
* Focus states are visible.

## Test User
* **Username:** admin@test.com
* **Password:** password123