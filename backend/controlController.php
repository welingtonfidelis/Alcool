<?php
include('../database/connection.php');

$action = $_GET['action'];
$json = [];

switch ($action) {
	case 'selectAll':
		$json = $pdo->query("SELECT * FROM control")->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'select':
		$id = 1;
		$json = $pdo->query("SELECT * FROM control WHERE id={$id}")->fetch(PDO::FETCH_ASSOC);
		break;

	case 'create':
		$query = '';
		$value = '';

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$query .= (empty($query) ? '' : ', ') . $name;
			$value .= (empty($value) ? '' : ', ') . $val;
		}

		$sql = "INSERT INTO control({$query}) VALUES({$value})";

		$json = $pdo->query($sql);
		$json = $json ? true : false;
		break;

	case 'update':
		$id = 1;
		$query = '';

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$query .= (empty($query) ? '' : ', ') . "{$name} = {$val}";
		}

		$sql = "UPDATE control SET {$query} WHERE id = ${id}";

		$json = $pdo->query($sql);
		$json = $json ? true : false;
		break;

	case 'delete':
		$id = $_GET['id'];

		$sql = "DELETE FROM control WHERE id = ${id}";
		$json = $pdo->query($sql);
		$json = $json ? true : false;
		break;

	default:
		# code...
		break;
}

echo (json_encode($json));
