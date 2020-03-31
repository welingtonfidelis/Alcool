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
} else {
    $sql = "SELECT prov.name, prov.id, prov.type, prov.approved, ctrl.maxprice
    FROM provider prov
    LEFT JOIN control ctrl ON ctrl.id = 1
    WHERE (cnpj='{$user}' OR email='{$user}') AND password = '{$password}'";
}

$json = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

if ($type == 'user') {
    $sql = "SELECT date, amount 
    FROM request 
    WHERE userid = {$json['id']} 
    ORDER BY date DESC LIMIT 1";

    $query = ($pdo->query($sql)->fetch(PDO::FETCH_ASSOC));

    if($query){
        $diff = abs(strtotime($query['date']) - strtotime(date('Y-m-d')));
        $years = floor($diff / (365 * 60 * 60 * 24));
        $months = floor(($diff - $years * 365 * 60 * 60 * 24) / (30 * 60 * 60 * 24));
        $days = floor(($diff - $years * 365 * 60 * 60 * 24 - $months * 30 * 60 * 60 * 24) / (60 * 60 * 24));
    
        $json['lastRequestDate'] = date_format(date_create($query['date']), 'd/m/Y');
        $json['lastRequestAmount'] = $query['amount'];
        $json['nextRequest'] = 15 - ($days +1);
    }
}

echo (json_encode($json));
