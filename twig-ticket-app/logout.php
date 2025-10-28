<?php
require_once __DIR__ . '/src/loader.php';

// Clear session and redirect to landing
session_unset();
session_destroy();

header('Location: landing.php');
exit();
?>