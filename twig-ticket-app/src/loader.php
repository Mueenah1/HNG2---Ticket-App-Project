<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader);

function isAuthenticated() {
    return isset($_SESSION['ticketapp_session']);
}

function requireAuth() {
    if (!isAuthenticated()) {
        header('Location: auth.php?mode=login&error=unauthorized');
        exit();
    }
}

function getAuthUser() {
    return $_SESSION['ticketapp_session'] ?? null;
}

$twig->addGlobal('auth', [
    'isAuthenticated' => isAuthenticated(),
    'user' => getAuthUser()
]);

if (!isset($_SESSION['tickets'])) {
    $_SESSION['tickets'] = [
        1 => ['id' => 1, 'title' => 'Server is down', 'description' => 'The main server rack is unresponsive.', 'status' => 'open', 'priority' => 'high'],
        2 => ['id' => 2, 'title' => 'Cannot login', 'description' => 'A user forgot their password and is locked out.', 'status' => 'in_progress', 'priority' => 'medium'],
        3 => ['id' => 3, 'title' => 'Need new mouse', 'description' => 'The mouse for workstation 4 is broken.', 'status' => 'closed', 'priority' => 'low'],
    ];
}
?>