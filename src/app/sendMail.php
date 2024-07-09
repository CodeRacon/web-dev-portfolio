<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $params = json_decode($json);

    $email = filter_var($params->email, FILTER_SANITIZE_EMAIL);
    $name = htmlspecialchars($params->name);
    $message = htmlspecialchars($params->message);

    $recipient = 'michael.buschmann.86@gmail.com';  
    $subject = "Hey Micha 👋🏼  I'm $name. Let's start something great!";
    $emailContent = "Name: $name\nE-Mail: $email\n\nNachricht:\n$message";

    $headers = [
        'From' => 'hey@michael-buschmann.dev',
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    if (mail($recipient, $subject, $emailContent, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to send email']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}


