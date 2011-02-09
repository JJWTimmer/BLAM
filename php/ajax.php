<?php

/* Database Configuration. Add your details below */

$dbOptions = array(
	'db_host' => 'localhost',
	'db_user' => 'root',
	'db_pass' => 'jasper',
	'db_name' => 'RVDlog'
);

/* Database Config End */


error_reporting(E_ALL ^ E_NOTICE);

require "classes/DB.class.php";
require "classes/Chat.class.php";
require "classes/ChatBase.class.php";
require "classes/ChatLine.class.php";
require "classes/ChatUser.class.php";

session_name('webchat');
session_start();

if(get_magic_quotes_gpc()){
	
	// If magic quotes is enabled, strip the extra slashes
	array_walk_recursive($_GET,create_function('&$v,$k','$v = stripslashes($v);'));
	array_walk_recursive($_POST,create_function('&$v,$k','$v = stripslashes($v);'));
}

try{
	
	// Connecting to the database
	DB::init($dbOptions);
	//response is an empty array
	$response = array();
	
	// Handling the supported actions:
	
	switch($_GET['action']){
		
		case 'login':
			$response = Chat::login($_POST['name'],$_POST['password']);
						
		break;
		
		case 'checkLogged':
			$response = Chat::checkLogged();
		break;
		
		case 'logout':
			$response = Chat::logout();
		break;
		
		case 'submitChat':
			$response = Chat::submitChat($_POST['chatText']);
		break;
		
		case 'getUsers':
			$response = Chat::getUsers();
		break;
		
		case 'getChats':
			$response = Chat::getChats($_GET['lastID'],$_GET['date']);
		break;
		
		case 'searchChats':
			$response = Chat::searchChats($_GET['keyword']);
		break;
		
		default:
			throw new Exception('Wrong action');
	}
	
	echo json_encode($response);
	//echo json_encode(array('error' => $response));
}
catch(Exception $e){
	die(json_encode(array('error' => $e->getMessage())));
}

?>
