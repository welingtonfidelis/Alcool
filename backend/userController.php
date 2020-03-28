<?php
include('../database/connection.php');

$action = $_GET['action'];
$json = [];

switch ($action) {
	case 'selectAll':
		$json = $pdo->query("SELECT * FROM user")->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'select':
		$id = $_GET['id'];
		$json = $pdo->query("SELECT * FROM user WHERE id={$id}")->fetch(PDO::FETCH_ASSOC);
		break;

	case 'create':
		$query = '';
		$value = '';

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$query .= (empty($query) ? '' : ', ') . $name;
			$value .= (empty($value) ? '' : ', ') . $val;
		}

		$sql = "INSERT INTO user({$query}) VALUES({$value})";

		$json = $pdo->query($sql);
		$json = $json ? true : false;

		if ($json && $_POST['type'] == 'user') {
			$sql = "UPDATE control a
			INNER JOIN control b ON b.id = 1
			SET a.amountclient = b.amountclient +1;";

			$pdo->query($sql);
		};
		break;

	case 'update':
		$id = $_GET['id'];
		$query = '';

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$query .= (empty($query) ? '' : ', ') . "{$name} = {$val}";
		}

		$sql = "UPDATE user SET {$query} WHERE id = ${id}";

		$json = $pdo->query($sql);
		$json = $json ? true : false;
		break;

	case 'delete':
		$id = $_GET['id'];

		$sql = "SELECT type FROM user WHERE id = {$id}";
		$query = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

		$sql = "DELETE FROM user WHERE id = ${id}";
		$json = $pdo->query($sql);
		$json = $json ? true : false;

		if ($json && $query['type'] == 'user') {
			$sql = "UPDATE control a
			INNER JOIN control b ON b.id = 1
			SET a.amountclient = b.amountclient -1;";

			$pdo->query($sql);
		};
		break;

	default:
		# code...
		break;
}

echo (json_encode($json));
