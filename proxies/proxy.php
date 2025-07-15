<?php
function output_header(string $name, string $value): string {
    return $name . ": " . $value;
}

$headers = [
    "Host: api.onoffice.de",
    "Content-Type: application/json",
    "Accept: application/json",
    "User-Agent: PHP-Proxy/1.0",
];

$context = array(
   'http' => array(
       'method' => $_SERVER['REQUEST_METHOD'],
       'header'  => implode("\r\n", $headers),
       'content' => file_get_contents('php://input'),
       ),
   );

$context = stream_context_create($context);

echo file_get_contents("https://api.onoffice.de/api/latest/api.php", false, $context);

?>
