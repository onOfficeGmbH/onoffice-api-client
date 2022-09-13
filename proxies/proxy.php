<?php

function output_header(string $name, string $value): string {
    return $name . ": " . $value;
}

$rawHeaders = apache_request_headers();
$headers = array_map('output_header', array_keys($headers), array_values($headers));

$context = array(
   'http' => array(
       'method' => $_SERVER['REQUEST_METHOD'],
       'header' => $headers,
       'content' => file_get_contents('php://input'),
       ),
   );

$context = stream_context_create($context);

echo file_get_contents("https://api.onoffice.de/api/latest/api.php", false, $context);

?>