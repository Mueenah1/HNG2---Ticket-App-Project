<?php
require_once __DIR__ . '/src/loader.php';
requireAuth(); // Protect this page

$action = $_GET['action'] ?? 'list'; // 'list', 'edit', 'create'
$id = $_GET['id'] ?? null;
$errors = [];
$toast = null; // ['message', 'type']

// --- Handle POST Actions (Create, Update, Delete) ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_action = $_POST['action'] ?? '';
    
    // --- Validation ---
    $title = $_POST['title'] ?? '';
    $status = $_POST['status'] ?? '';
    $description = $_POST['description'] ?? '';
    $priority = $_POST['priority'] ?? '';

    if (empty($title)) $errors['title'] = "Title is required.";
    if (empty($status)) $errors['status'] = "Status is required.";
    if (!in_array($status, ['open', 'in_progress', 'closed'])) $errors['status'] = "Invalid status.";
    
    if (empty($errors)) {
        if ($post_action === 'create') {
            $newId = max(array_keys($_SESSION['tickets'])) + 1;
            $_SESSION['tickets'][$newId] = [
                'id' => $newId,
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'priority' => $priority
            ];
            $toast = ['message' => 'Ticket created successfully!', 'type' => 'success'];
            $action = 'list'; // Go back to list
            
        } elseif ($post_action === 'update') {
            $id = $_POST['id'];
            $_SESSION['tickets'][$id] = [
                'id' => (int)$id,
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'priority' => $priority
            ];
            $toast = ['message' => 'Ticket updated successfully!', 'type' => 'success'];
            $action = 'list'; // Go back to list
        }
    } else {
        // Errors found, stay on the form
        $action = $post_action; // 'create' or 'update'
        $toast = ['message' => 'Please fix the errors below.', 'type' => 'error'];
    }
}

// --- Handle DELETE Action ---
if ($action === 'delete' && $id) {
    if (isset($_SESSION['tickets'][$id])) {
        // Confirmation step
        if (isset($_GET['confirm'])) {
            unset($_SESSION['tickets'][$id]);
            // We must add toast to session to survive redirect
            $_SESSION['toast'] = ['message' => 'Ticket deleted.', 'type' => 'success'];
            header('Location: tickets.php');
            exit();
        }
    } else {
        header('Location: tickets.php');
        exit();
    }
}

// --- Prepare Data for Twig Template ---
$tickets = $_SESSION['tickets'] ?? [];
$current_ticket = null;

if ($action === 'edit' && $id) {
    $current_ticket = $_SESSION['tickets'][$id] ?? null;
}
if ($action === 'create') {
    $current_ticket = $_POST; // Re-populate from failed POST
}
if ($action === 'update') {
     $current_ticket = $_POST; // Re-populate from failed POST
}

// Check for toast from session (after a redirect)
if (isset($_SESSION['toast'])) {
    $toast = $_SESSION['toast'];
    unset($_SESSION['toast']);
}

echo $twig->render('tickets.twig', [
    'page_title' => 'Ticket Management',
    'tickets' => $tickets,
    'action' => $action,
    'current_ticket' => $current_ticket,
    'errors' => $errors,
    'toast' => $toast
]);
?>