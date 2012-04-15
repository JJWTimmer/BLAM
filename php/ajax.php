<?php
error_reporting(E_ALL ^ E_NOTICE);

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(dirname(__FILE__)));

require_once "config.include.php";
require_once "util.include.php";

require_once "classes/DB.class.php";
require_once "classes/BLAM.class.php";
require_once "classes/BLAMBase.class.php";
require_once "classes/Message.class.php";
require_once "classes/Ticket.class.php";
require_once "classes/ChatLine.class.php";
require_once "classes/User.class.php";
require_once "classes/Handle.class.php";
require_once "classes/Group.class.php";
require_once "classes/Update.class.php";
require_once "classes/Autotext.class.php";
require_once "classes/Reminder.class.php";

session_name('BLAM');
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
			$response = BLAM::login($_POST['username'], $_POST['password']);
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'checkLogged':
			$response = BLAM::checkLogged();
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'logout':
			$response = BLAM::logout();
            // return null or exception
            break;
		
		case 'addMessage':
            BLAM::checkLogged();
			$response = BLAM::addMessage($_POST['text'], $_POST['ticket']);
            // returns MessageId or exception
            break;
		//*
		case 'updateMessage':
            BLAM::checkLogged();
			$response = BLAM::updateMessage($_POST['id'], $_POST['text'], $_POST['ticket']);
            // returns MessageId or exception
            break;
		    
		case 'getMessages':
            BLAM::checkLogged();//date_time string format: '2011-02-23 09:03:01'
				$response = BLAM::getMessages($_POST['first_id'],$_POST['timestamp_last_update']); 
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
            
		case 'searchMessages':
            BLAM::checkLogged();
			$response = BLAM::searchMessages($_POST['keyword']);
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'getUsers':
            BLAM::checkLogged();
			$response = BLAM::getUsers($_POST['options']); // accepts 'all' or 'logged'
            // returns array users(integer Id, string Role, string Username, string Avatar) or exception
            break;
		
		case 'getGroups':
            BLAM::checkLogged();
			$response = BLAM::getGroups($_POST['recursive']);//true or false: true gives all handles also
            // returns array(int groupid, string groupname, array(integer Id, integer HandleNumber, string HandleName, string Description) handles) groups or exception
            break;
		
		case 'getHandles':
            BLAM::checkLogged();
			$response = BLAM::getHandles($_POST['group_id']); // null for all or int group_id
            // returns array(integer Id, integer HandleNumber, string HandleName, string Description) handles or exception
            break;
		
		case 'getTicketList':
            BLAM::checkLogged();//date_time string format: '2011-02-23 09:03:01'
			$response = BLAM::getTicketList($_POST['recursive'], $_POST['first_id'], $_POST['timestamp_last_update'], $_POST['status']);//boolean recursive: false for only parents, int $last_id, date-string $last_modified, array of string $status for filtering ($status only for parent!).
            // returns array(integer Id, string Title, string Text, string Status, string user, datetime created, datetime modified) tickets or exception
            break;
		//!*
		case 'getUpdateList':
            BLAM::checkLogged();
			$response = BLAM::getUpdateList($_POST['type'],$_POST['called'], $_POST['first_id'],$_POST['timestamp_last_update']);
            // returns array (integer id,	integer ticket_id, string Title, Datetime called, Datetime created, Datetime modified) updates or exception
            break;
		
		case 'closeFeedback':
            BLAM::checkLogged();
			$response = BLAM::closeFeedback($_POST['id'], $_SESSION['user']['id']);
            // returns null or exception
            break;
		
		case 'addChat':
            BLAM::checkLogged();
			$response = BLAM::addChat($_POST['text'], $_SESSION['user']['id']);
            // returns ChatId or exception
            break;
		
		case 'getChats':
            BLAM::checkLogged();
			$response = BLAM::getChats($_POST['first_id'], $_POST['timestamp_last_update']);//last_id is mandatory, id or 'all'
            // returns array(int MessageID, string Text, string Username, string Avatar, Datetime created) chats or exception
            break;
		
		case 'getTicketDetail':
            BLAM::checkLogged();
			$response = BLAM::getTicketDetail($_POST['id']);
            // returns integer Id, string Status, string Titel, string UserId, string Text, string Locatie, array time(Hours,Minutes), integer MessageId, string MessageUserId, string MessageText or exception
            break;

		case 'searchTickets':
            BLAM::checkLogged();
			$response = BLAM::searchTickets($_POST['keyword']);
            //returns array () tickets or exception
            break;
            
		case 'getUpdates':
            BLAM::checkLogged();
			$response = BLAM::getUpdates($_POST['id'], $_POST['ticket_id'], $_POST['type']);
            // returns returns array (id, type, ticket_id, title, message, handlename, called, called_by, created)
            break;
            
		case 'closeTicket':
            BLAM::checkLogged();
			$response = BLAM::closeTicket($_POST['id']);
            // returns null or exception
            break;
		
		case 'setTicketOwner':
            BLAM::checkLogged();
			$response = BLAM::setTicketOwner($_POST['id']);
            // returns null or exception
            break;
		
		case 'changeTicketOwner':
            BLAM::checkLogged();
			$response = BLAM::changeTicketOwner($_POST['id'], $_POST['user_id']);
            // returns null or exception
            break;
		//*
		case 'changeTicketDetails':
            BLAM::checkLogged();
			$response = BLAM::changeTicketDetails($_POST['id'], $_POST['title'], $_POST['text'], $_POST['location'], $_POST['solution'], $_POST['reference'], $_POST['handle_id']);
            // returns null or exception
            break;
		//*
		case 'createUpdate':
            BLAM::checkLogged();
			$response = BLAM::createUpdate($_POST['ticket_id'], $_POST['message']);
            // returns integer UpdateId or exception
            break;
		//*
		case 'createFeedback':
            BLAM::checkLogged();
			$response = BLAM::createFeedback($_POST['ticket_id'], $_POST['message']);
            // returns integer FeedbackId or exception
            break;
		
		case 'createAddition':
            BLAM::checkLogged();
			$response = BLAM::createAddition($_POST['ticket_id'], $_POST['message']);
            // returns integer UpdateId or exception
            break;
		
		case 'createAnswer':
            BLAM::checkLogged();
			$response = BLAM::createAnswer($_POST['ticket_id'], $_POST['message']);
            // returns integer UpdateId or exception
            break;
		
		
		case 'becomeChildTicket':
            BLAM::checkLogged();
			$response = BLAM::becomeChildTicket($_POST['id'], $_POST['parent_id']);
            // returns null or exception
            break;
		
		case 'becomeParentTicket':
            BLAM::checkLogged();
			$response = BLAM::becomeParentTicket($_POST['id']);
            // returns null or exception
            break;
		
		case 'getAutotext':
            BLAM::checkLogged();
			$response = BLAM::getAutotext();
            // returns null or exception
            break;
		
		case 'getReminders':
            BLAM::checkLogged();
			$response = BLAM::getReminders($_POST['timestamp_day']);
            // returns null or exception
            break;
    
    case 'getTaskDetail':
            BLAM::checkLogged();
			$response = BLAM::getTaskDetail($_POST['id']);
    break;
    
    case 'confirmNotification':
            BLAM::checkLogged();
			$response = BLAM::confirmNotification($_POST['ticket_id'], $_POST['update_id'], $_POST['type']);
    break;  
		
		default:
			throw new Exception('Wrong action');
	}
	
	echo json_encode($response);
}
catch(Exception $e){
	die(json_encode(array('error' => $e->getMessage())));
}
