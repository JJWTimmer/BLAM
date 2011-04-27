<?php
error_reporting(E_ALL ^ E_NOTICE);

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(dirname(__FILE__)));

require_once "config.include.php";
require_once "util.include.php";

require_once "classes/DB.class.php";
require_once "classes/RVDLog.class.php";
require_once "classes/RVDLogBase.class.php";
require_once "classes/Message.class.php";
require_once "classes/Ticket.class.php";
require_once "classes/ChatLine.class.php";
require_once "classes/User.class.php";
require_once "classes/Handle.class.php";
require_once "classes/Group.class.php";
require_once "classes/Update.class.php";

session_name('RVDLog');
session_start();

if ( get_magic_quotes_gpc() ) {
	
	// If magic quotes is enabled, strip the extra slashes
	array_walk_recursive($_GET,create_function('&$v,$k','$v = stripslashes($v);'));
	array_walk_recursive($_POST,create_function('&$v,$k','$v = stripslashes($v);'));
}

try {
	
	// Connecting to the database
	DB::init($dbOptions);
	//response is an empty array
	$response = array();
	
	// Handling the supported actions:
	
	switch($_GET['action']){
		
		case 'login':
			$response = RVDLog::login($_POST['username'], $_POST['password']);
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'checkLogged':
			$response = RVDLog::checkLogged();
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'logout':
			$response = RVDLog::logout();
            // return null or exception
            break;
		
		case 'addMessage':
            RVDLog::checkLogged();
			$response = RVDLog::addMessage($_POST['text'], $_POST['ticket']);
            // returns MessageId or exception
            break;
		//*
		case 'updateMessage':
            RVDLog::checkLogged();
			$response = RVDLog::updateMessage($_POST['id'], $_POST['text']);
            // returns MessageId or exception
            break;
		
		case 'getMessages':
            RVDLog::checkLogged();//date_time string format: '2011-02-23 09:03:01'
			$response = RVDLog::getMessages($_POST['last_id'], $_POST['date_and_time']); 
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'searchMessages':
            RVDLog::checkLogged();
			$response = RVDLog::searchMessages($_POST['keyword']);
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'getUsers':
            RVDLog::checkLogged();
			$response = RVDLog::getUsers($_POST['options']); // accepts 'all' or 'logged'
            // returns array users(integer Id, string Role, string Username, string Avatar) or exception
            break;
		
		case 'getGroups':
            RVDLog::checkLogged();
			$response = RVDLog::getGroups($_POST['recursive']);//true or false: true gives all handles also
            // returns array(int groupid, string groupname, array(integer Id, integer HandleNumber, string HandleName, string Description) handles) groups or exception
            break;
		
		case 'getHandles':
            RVDLog::checkLogged();
			$response = RVDLog::getHandles($_POST['group_id']); // null for all or int group_id
            // returns array(integer Id, integer HandleNumber, string HandleName, string Description) handles or exception
            break;
		
		case 'getTicketList':
            RVDLog::checkLogged();//date_time string format: '2011-02-23 09:03:01'
			$response = RVDLog::getTicketList($_POST['recursive'], $_POST['last_id'], $_POST['last_modified'], $_POST['status']);//boolean recursive: false for only parents, int $last_id, date-string $last_modified, array of string $status for filtering ($status only for parent!).
            // returns array(integer Id, string Title, string Text, string Status, string user, datetime created, datetime modified) tickets or exception
            break;
		//!*
		case 'getFeedback':
            RVDLog::checkLogged();
			$response = RVDLog::getFeedback($_POST['id'], $_POST['called']);
            // returns array (integer Id, string Title, string HandleName, string Message, string userWL, Datetime called, Datetime created)feedback or exception
            break;
		
		case 'closeFeedback':
            RVDLog::checkLogged();
			$response = RVDLog::closeFeedback($_POST['id'], $_SESSION['user']['id']);
            // returns null or exception
            break;
		
		case 'addChat':
            RVDLog::checkLogged();
			$response = RVDLog::addChat($_POST['text'], $_SESSION['user']['id']);
            // returns ChatId or exception
            break;
		
		case 'getChats':
            RVDLog::checkLogged();
			$response = RVDLog::getChats($_POST['last_id'], $_POST['since']);//last_id is mandatory, id or 'all'
            // returns array(int MessageID, string Text, string Username, string Avatar, Datetime created) chats or exception
            break;
		
		case 'getTicketDetail':
            RVDLog::checkLogged();
			$response = RVDLog::getTicketDetail($_POST['id']);
            // returns integer Id, string Status, string Titel, string UserId, string Text, string Locatie, array time(Hours,Minutes), integer MessageId, string MessageUserId, string MessageText or exception
            break;
            
		case 'getUpdates':
            RVDLog::checkLogged();
			$response = RVDLog::getUpdates($_POST['ticket_id'], $_POST['type']);
            // returns returns array (id, type, ticket_id, title, message, handlename, called, called_by, created)
            break;
            
		case 'closeTicket':
            RVDLog::checkLogged();
			$response = RVDLog::closeTicket($_POST['id']);
            // returns null or exception
            break;
		
		case 'setTicketOwner':
            RVDLog::checkLogged();
			$response = RVDLog::setTicketOwner($_POST['id']);
            // returns null or exception
            break;
		
		case 'changeTicketOwner':
            RVDLog::checkLogged();
			$response = RVDLog::changeTicketOwner($_POST['id'], $_POST['user_id']);
            // returns null or exception
            break;
		//*
		case 'changeTicketDetails':
            RVDLog::checkLogged();
			$response = RVDLog::changeTicketDetails($_POST['id'], $_POST['title'], $_POST['text'], $_POST['location'], $_POST['solution'], $_POST['reference'], $_POST['handle_id']);
            // returns null or exception
            break;
		//*
		case 'createUpdate':
            RVDLog::checkLogged();
			$response = RVDLog::createUpdate($_POST['ticket_id'], $_POST['title'], $_POST['message']);
            // returns integer UpdateId or exception
            break;
		//*
		case 'createFeedback':
            RVDLog::checkLogged();
			$response = RVDLog::createFeedback($_POST['ticket_id'], $_POST['title'], $_POST['message'], $_POST['handle_id']);
            // returns integer FeedbackId or exception
            break;
		
		case 'becomeChildTicket':
            RVDLog::checkLogged();
			$response = RVDLog::becomeChildTicket($_POST['id'], $_POST['parent_id']);
            // returns null or exception
            break;
		
		case 'becomeParentTicket':
            RVDLog::checkLogged();
			$response = RVDLog::becomeParentTicket($_POST['id']);
            // returns null or exception
            break;
		
		default:
			throw new Exception('Wrong action');
	}
	
	echo json_encode($response);
}
catch(Exception $e){
	die(json_encode(array('error' => $e->getMessage())));
}
