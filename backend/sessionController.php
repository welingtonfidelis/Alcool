<?php
include('../database/connection.php');

$user = $_POST['user'];
$password = $_POST['password'];
$type = $_POST['type'];
$json = [];

$sql = '';
if ($type == 'user') {
    $sql = "SELECT name, id, type, approved
    FROM user 
    WHERE (cpf='{$user}' OR email='{$user}') AND password = '{$password}'";
}
else {
    $sql = "SELECT prov.name, prov.id, prov.type, prov.approved, ctrl.maxprice
    FROM provider prov
    LEFT JOIN control ctrl ON ctrl.id = 1
    WHERE (cnpj='{$user}' OR email='{$user}') AND password = '{$password}'";
}

$json = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

echo (json_encode($json));
