<?php
require_once __DIR__ . '/src/loader.php';

echo $twig->render('landing.twig', [
    'page_title' => 'Welcome'
]);
?>