<?php
require_once __DIR__ . '/src/loader.php';
requireAuth(); // Protect this page

// Calculate stats from session
$tickets = $_SESSION['tickets'] ?? [];
$stats = [
    'total' => count($tickets),
    'open' => count(array_filter($tickets, fn($t) => $t['status'] === 'open')),
    'closed' => count(array_filter($tickets, fn($t) => $t['status'] === 'closed')),
];

echo $twig->render('dashboard.twig', [
    'page_title' => 'Dashboard',
    'stats' => $stats
]);
?>