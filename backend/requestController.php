<?php
include('../database/connection.php');

$action = $_GET['action'];
$json = [];

switch ($action) {
	case 'selectall':
		$sql = "SELECT req.*, prod.id AS productid, provid.id AS providerid
		FROM request req
		LEFT JOIN requestproduct reqprod ON reqprod.requestid = req.id
		LEFT JOIN product prod ON prod.id = reqprod.productid
		LEFT JOIN provider provid ON provid.id = prod.providerid";

		$json = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'select':
		$id = $_GET['id'];

		$sql = "SELECT req.*, prod.id AS productid, provid.id AS providerid
		FROM request req
		LEFT JOIN requestproduct reqprod ON reqprod.requestid = req.id
		LEFT JOIN product prod ON prod.id = reqprod.productid
		LEFT JOIN provider provid ON provid.id = prod.providerid
		WHERE req.id = {$id}";

		$json = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
		break;

	case 'selectbyuser':
		$id = $_GET['id'];

		$sql = "SELECT req.*, 
		prod.id AS productid, prod.name AS prodname, prod.stock, prod.price, prod.approved,
		provid.id AS providerid, provid.name AS providername, provid.cnpj, provid.phone, 
		provid.email, provid.city, provid.state, provid.address
		FROM request req
		LEFT JOIN requestproduct reqprod ON reqprod.requestid = req.id
		LEFT JOIN product prod ON prod.id = reqprod.productid
		LEFT JOIN provider provid ON provid.id = prod.providerid
		WHERE req.userid = {$id}";

		$json = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'selectbyprovider':
		$id = $_GET['id'];

		$sql = "SELECT req.*, 
		usr.id AS userid, usr.name AS username, usr.cpf, usr.phone, 
		usr.email, usr.city, usr.state, usr.address,
		prod.id AS productid, prod.name AS prodname, prod.stock, prod.price, prod.approved
		FROM product prod
		INNER JOIN requestproduct reqprod ON reqprod.productid = prod.id
		INNER JOIN request req ON req.id = reqprod.requestid
		INNER JOIN user usr ON usr.id = req.userid
		WHERE prod.providerid = {$id}";

		$json = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		break;

	case 'create':
		$userid = $_POST['userid'];
		$productid = $_POST['productid'];
		$amount = $_POST['amount'];
		
		$sql = "INSERT INTO request(userid, amount) VALUES({$userid}, {$amount})";
		$json = $pdo->query($sql);
		$requestid = $pdo->lastInsertId();

		$sql = "INSERT INTO requestproduct(requestid, productid) VALUES({$requestid}, {$productid})";
		$json = $pdo->query($sql);

		$json = $json ? true : false;
		break;

	case 'update':
		$id = $_GET['id'];
		$userid = $_POST['userid'];
		$productid = $_POST['productid'];
		$amount = $_POST['amount'];

		$sql = "UPDATE request SET userid = {$userid}, amount = {$amount} WHERE id = {$id}";
		$json = $pdo->query($sql);
		
		$sql = "UPDATE requestproduct SET productid = {$productid} WHERE requestid = {$id}";
		$json = $pdo->query($sql);

		$json = $json ? true : false;
		break;

	case 'aproverequest':
		$id = $_GET['id'];
		$approved = $_POST['approved'];

		$sql = "UPDATE request SET approved = {$approved} WHERE id = {$id}";
		$json = $pdo->query($sql);
		
		$json = $json ? true : false;
		break;

	case 'delete':
		$id = $_GET['id'];

		$sql = "DELETE FROM requestproduct WHERE requestid = ${id}";
		$json = $pdo->query($sql);

		$sql = "DELETE FROM request WHERE id = ${id}";
		$json = $pdo->query($sql);

		$json = $json ? true : false;
		break;

	default:
		# code...
		break;
}

echo (json_encode($json));
