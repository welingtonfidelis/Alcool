<?php
include('../database/connection.php');

$user = $_POST['user'];
$password = $_POST['password'];
$type = $_POST['type'];
$json = [];

$sql = '';
if ($type == 'user') {
    $sql = "SELECT name, id, type 
    FROM user 
    WHERE (cpf='{$user}' OR email='{$user}') AND password = '{$password}'";
}
else {
    $sql = "SELECT name, id, type 
    FROM provider 
    WHERE (cnpj='{$user}' OR email='{$user}') AND password = '{$password}'";
}

$json = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

echo (json_encode($json));
