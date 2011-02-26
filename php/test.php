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
			$response = array(
                    'id'        => 1,
                    'username'  => "test",
                    'role'      => "testrole",
                    'avatar'    => ""
                );
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'checkLogged':
			$response = array(
                    'id'        => 1,
                    'username'  => "test",
                    'role'      => "testrole",
                    'avatar'    => ""
                );
            // returns int Id, string Username, string Avatar, String Role or exception
            break;
		
		case 'logout':
			$response = NULL;
            // return null or exception
            break;
		
		case 'addMessage':
			$response = RVDLog::addMessage($_POST['text'], $_POST['ticket']);
            // returns MessageId or exception
            break;
		
		case 'getMessages':
            $rand=rand(1,50);
            if($rand<10)
                {
                switch($rand){
                case 1:
                $text="Hello neo!";
                break;
                
                case 2:
                $text="Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.";
                break;
                
                case 3:
                $text="The Matrix is the world that has been pulled over your eyes to blind you from the truth.";
                break;
                
                default:
                $text="test";
                }
                        
                $messages[] = array(
                    'messageid'        => (int)$_POST['last_id']+1,
                    'text'  => $text,
                    'username'      => "blaataap",
                    'avatar'    => "",
                    'created'     => $_POST['date_and_time']
                );
                }
            else
                {
                $messages = array();
                }
            $response = array('messages' => $messages);
            
//returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'searchMessages':
			$response = RVDLog::searchMessages($_POST['keyword']);
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'getUsers':
			$response = RVDLog::getUsers();
            // returns array users(integer Id, string Role, string Username, integer Totaal) or exception
            break;
		
		case 'getHandles':
			$response = RVDLog::getHandles();
            // returns array(int groupid, string groupname, array(integer Id, integer HandleNumber, string HandleName) handles) groups or exception
            break;
		
		case 'getTicketList':
			$response = RVDLog::getTicketList();
            // returns array tickets(integer Id, string Text, string Status, string userWL, array time(Hours,Minutes)) or exception
            break;
		
		case 'getFeedback':
			$response = RVDLog::getFeedback();
            // returns array feedback (integer Id, string Titel, string HandleName, string Message, string userWL, array time (Hours, Minutes)) or exception
            break;
		
		case 'closeFeedback':
			$response = RVDLog::closeFeedback($_POST['id']);
            // returns null or exception
            break;
		
		case 'addChat':
			$response = RVDLog::addChat($_POST['text']);
            // returns ChatId or exception
            break;
		
		case 'getChats':
			$response = RVDLog::getChats($_POST['last_id'], $_POST['date']);
            // returns array chat(int MessageID, string Text, string Username, string Avatar, array time(hours, minutes)) or exception
            break;
		
		case 'getTicketTreeNew':
			$response = RVDLog::getTicketTreeNew();
            // returns array tickets(integer Id, string Titel,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketTreeOpen':
			$response = RVDLog::getTicketTreeOpen();
            // returns array tickets(integer Id, string Titel, string UserId,,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketTreeClosed':
			$response = RVDLog::getTicketTreeClosed();
            // returns array tickets(integer Id, string Titel, string UserId,,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketDetail':
			$response = RVDLog::getTicketDetail($_POST['id']);
            // returns integer Id, string Status, string Titel, string UserId, string Text, string Locatie, array time(Hours,Minutes), integer MessageId, string MessageUserId, string MessageText or exception
            break;
		
		case 'closeTicket':
			$response = RVDLog::closeTicket($_POST['id']);
            // returns null or exception
            break;
		
		case 'setTicketOwner':
			$response = RVDLog::setTicketOwner($_POST['id']);
            // returns null or exception
            break;
		
		case 'changeTicketOwner':
			$response = RVDLog::changeTicketOwner($_POST['id'], $_POST['user_id']);
            // returns null or exception
            break;
		
		case 'changeTicketDetails':
			$response = RVDLog::changeTicketDetails($_POST['id'], $_POST['title'], $_POST['text'], $_POST['location'], $_POST['handle_id']);
            // returns null or exception
            break;
		
		case 'createSubTicket':
			$response = RVDLog::createSubTicket($_POST['parent_id'], $_POST['text'], $_POST['location'], $_POST['handle_id'] );
            // returns integer SubTicketId or exception
            break;
		
		case 'becomeChildTicket':
			$response = RVDLog::becomeChildTicket($_POST['id'], $_POST['parent_id']);
            // returns null or exception
            break;
		
		case 'becomeParentTicket':
			$response = RVDLog::becomeParentTicket($_POST['id']);
            // returns array users(integer Id, string Role, string Username, integer Totaal) or exception
            break;
		
		case 'createFeedback':
			$response = RVDLog::createFeedback($_POST['ticket_id'], $_POST['text'], $_POST['handle_id']);
            // returns array users(integer Id, string Role, string Username, integer Totaal) or exception
            break;
		
		default:
			throw new Exception('Wrong action');
	}
	
	echo json_encode($response);
}
catch(Exception $e){
	die(json_encode(array('error' => $e->getMessage())));
}
