<?php
include('../database/connection.php');

$action = $_GET['action'];
$json = [];

switch ($action) {
	case 'selectAllApproved':
		$json = $pdo->query("SELECT * FROM provider WHERE approved = 1")->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'selectAllWaiting':
		$json = $pdo->query("SELECT * FROM provider WHERE approved = 0")->fetchAll(PDO::FETCH_ASSOC);
	break;

	case 'select':
		$id = $_GET['id'];
		$json = $pdo->query("SELECT * FROM provider WHERE id={$id}")->fetch(PDO::FETCH_ASSOC);
		break;

	case 'create':
		$query = '';
		$value = '';

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$query .= (empty($query) ? '' : ', ') . $name;
			$value .= (empty($value) ? '' : ', ') . $val;
		}

		$sql = "INSERT INTO provider({$query}) VALUES({$value})";

		$json = $pdo->query($sql);
		$json = $json ? true : false;

		if ($json) {
			$sql = "UPDATE control a
			INNER JOIN control b ON b.id = 1
			SET a.amountproviderwait = b.amountproviderwait +1;";

			$pdo->query($sql);
		};
		break;

	case 'update':
		$id = $_GET['id'];
		$queryU = '';

		$sql = "SELECT approved FROM provider WHERE id = {$id}";
		$query = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

		foreach ($_POST as $name => $val) {
			$val = (!isset($val) ? 'NULL' : "'{$val}'");
			$queryU .= (empty($queryU) ? '' : ', ') . "{$name} = {$val}";
		}

		$sql = "UPDATE provider SET {$queryU} WHERE id = ${id}";
		$json = $pdo->query($sql);
		$json = $json ? true : false;

		if (true) {
			if ($query['approved'] != $_POST['approved']) {
				$sql = '';

				if ($_POST['approved']) {
					$sql = "UPDATE control a
					INNER JOIN control b ON b.id = 1
					SET a.amountproviderapproved = b.amountproviderapproved +1,
					a.amountproviderwait = b.amountproviderwait -1;";
				} else {
					$sql = "UPDATE control a
					INNER JOIN control b ON b.id = 1
					SET a.amountproviderapproved = b.amountproviderapproved -1,
					a.amountproviderwait = b.amountproviderwait +1;";
				}

				$pdo->query($sql);
			}
		}
		break;

	case 'delete':
		$id = $_GET['id'];

		$sql = "SELECT approved FROM provider WHERE id = {$id}";
		$query = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

		$sql = "DELETE FROM provider WHERE id = ${id}";
		$json = $pdo->query($sql);
		$json = $json ? true : false;


		if ($json) {
			$sql = '';

			if ($query['approved']) {
				$sql = "UPDATE control a
				INNER JOIN control b ON b.id = 1
				SET a.amountproviderapproved = b.amountproviderapproved -1;";
			} else {
				$sql = "UPDATE control a
				INNER JOIN control b ON b.id = 1
				SET a.amountproviderwait = b.amountproviderwait -1;";
			}

			$pdo->query($sql);
		};
		break;

	default:
		# code...
		break;
}

echo (json_encode($json));
