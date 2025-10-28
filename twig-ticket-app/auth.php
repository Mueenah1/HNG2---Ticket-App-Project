<?php
require_once __DIR__ . '/src/loader.php';

$mockUser = ['email' => 'admin@test.com', 'password' => 'password123'];
$mode = $_GET['mode'] ?? 'login';
$errors = [];
$toast_error = null;

if (isset($_GET['error']) && $_GET['error'] === 'unauthorized') {
    $toast_error = 'Your session has expired — please log in again.';
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $isLogin = $_POST['form_mode'] === 'login';

    // --- Validation ---
    if (empty($email)) $errors['email'] = 'Email is required.';
    if (empty($password)) $errors['password'] = 'Password is required.';
    
    if ($isLogin) {
        // --- Login Logic ---
        if (empty($errors)) {
            if ($email === $mockUser['email'] && $password === $mockUser['password']) {
                // SUCCESS
                $_SESSION['ticketapp_session'] = ['id' => 1, 'name' => 'Admin User', 'email' => $email];
                header('Location: dashboard.php');
                exit();
            } else {
                $toast_error = 'Invalid credentials. Please try again.';
            }
        }
    } else {
        // --- Signup Logic ---
        $confirmPassword = $_POST['confirmPassword'] ?? '';
        if ($password !== $confirmPassword) $errors['confirmPassword'] = 'Passwords do not match.';
        
        if (empty($errors)) {
            // SUCCESS (auto-login)
            $_SESSION['ticketapp_session'] = ['id' => 2, 'name' => 'New User', 'email' => $email];
            header('Location: dashboard.php');
            exit();
        }
    }
}

echo $twig->render('auth.twig', [
    'page_title' => $mode === 'login' ? 'Login' : 'Sign Up',
    'mode' => $mode,
    'errors' => $errors,
    'toast_error' => $toast_error,
    'form_data' => $_POST, // Re-populate form on error
    'hide_footer' => true // Don't show footer on this page
]);
?>