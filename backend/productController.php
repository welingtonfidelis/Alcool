<?php
include('../database/connection.php');

$action = $_GET['action'];
$json = [];

switch ($action) {
	case 'selectAllApproved':
		$json = $pdo->query("SELECT * FROM product WHERE approved = 1 AND stock > 0")->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'selectAllWaiting':
		$json = $pdo->query("SELECT * FROM product WHERE approved = 0 AND stock > 0")->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'select':
		$id = $_GET['id'];
		$json = $pdo->query("SELECT * FROM product WHERE id={$id}")->fetch(PDO::FETCH_ASSOC);
		break;

	case 'create':
		$queryU = '';
		$value = '';

		$sql = "SELECT maxprice FROM control WHERE id = 1";
		$query = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

		if ($_POST['price'] <= $query['maxprice']) {
			foreach ($_POST as $name => $val) {
				$val = (!isset($val) ? 'NULL' : "'{$val}'");
				$queryU .= (empty($queryU) ? '' : ', ') . $name;
				$value .= (empty($value) ? '' : ', ') . $val;
			}

			$sql = "INSERT INTO product({$queryU}) VALUES({$value})";
			$json = $pdo->query($sql);
			$json = $json ? true : false;
		} else $json = false;

		break;

	case 'update':
		$id = $_GET['id'];
		$queryU = '';

		$sql = "SELECT maxprice FROM control WHERE id = 1";
		$query = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

		if ($_POST['price'] <= $query['maxprice']) {
			foreach ($_POST as $name => $val) {
				$val = (!isset($val) ? 'NULL' : "'{$val}'");
				$queryU .= (empty($queryU) ? '' : ', ') . "{$name} = {$val}";
			}

			$sql = "UPDATE product SET {$queryU} WHERE id = ${id}";

			$json = $pdo->query($sql);
			$json = $json ? true : false;
		} else $json = false;

		break;

	case 'delete':
		$id = $_GET['id'];

		$sql = "DELETE FROM product WHERE id = ${id}";

		$json = $pdo->query($sql);
		$json = $json ? true : false;
		break;

	default:
		# code...
		break;
}

echo (json_encode($json));
