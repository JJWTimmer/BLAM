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

//session_name('BLAM');
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
	if(isset($_SESSION['last_id']))
    {}
    else
    {$_SESSION['last_id']=0;}

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
			//$response = BLAM::addMessage($_POST['text'], $_POST['ticket']);
            $_SESSION['last_id']=$_SESSION['last_id']+1;
            $response = array(
                    'messageid'  => $_SESSION['last_id']
                    );
            

            // returns MessageId or exception
            break;
		
		case 'getMessages':
            $rand=rand(1,50);
            if($rand<10)
                {
                switch($rand){
                case 1:
                $text="Knock, knock, Neo";
                break;
                
                case 2:
                $text="Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.";
                break;
                
                case 3:
                $text="Don't think you are, know you are";
                break;
                
                case 4:
                $text="Come on. Stop trying to hit me and hit me.";
                break;                

                case 5:
                $text="There is no spoon";
                break;

                case 5:
                $text="Do you hear that, Mr. Anderson? That is the sound of inevitability.";
                break;

                default:
                $text="test";
                }
                $_SESSION['last_id']=(int)$_SESSION['last_id']+1;
                $messages[] = array(
                    'messageid'        => (int)$_SESSION['last_id'],
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
			$response = BLAM::searchMessages($_POST['keyword']);
            //returns array (int MessageID, string Text, string Username, string Avatar, string created)  messages or exception
            break;
		
		case 'getUsers':
			
            $users[] = array(
                    'id'        => 1,
                    'role'  => "RVD",
                    'username'  => "Femke",
                    'avatar' => ""
                    );
            $users[] = array(
                    'id'        => 2,
                    'role'  => "RVD",
                    'username'  => "Anne",
                    'avatar' => "img/anne.jpg"
                    );
            for ($i=1;$i<=30;$i++)
            {
            $users[] = array(
                    'id'        => $i+2,
                    'role'  => "WL",
                    'username'  => "Chinees ".$i,
                    'avatar' => ""
                    );
            }
            $response = array('users' => $users, 'total' => 2);
            // returns array users(integer Id, string Role, string Username, integer Totaal) or exception
            break;
		
		case 'getHandles':
			$response = BLAM::getHandles();
            // returns array(int groupid, string groupname, array(integer Id, integer HandleNumber, string HandleName) handles) groups or exception
            break;
		
		case 'getTicketList':
			$response = BLAM::getTicketList();
            // returns array tickets(integer Id, string Text, string Status, string userWL, array time(Hours,Minutes)) or exception
            break;
		
		case 'getFeedback':
			$response = BLAM::getFeedback();
            // returns array feedback (integer Id, string Titel, string HandleName, string Message, string userWL, array time (Hours, Minutes)) or exception
            break;
		
		case 'closeFeedback':
			$response = BLAM::closeFeedback($_POST['id']);
            // returns null or exception
            break;
		
		case 'addChat':
			$response = BLAM::addChat($_POST['text']);
            // returns ChatId or exception
            break;
		
		case 'getChats':
			$response = BLAM::getChats($_POST['last_id'], $_POST['date']);
            // returns array chat(int MessageID, string Text, string Username, string Avatar, array time(hours, minutes)) or exception
            break;
		
		case 'getTicketTreeNew':
			$response = BLAM::getTicketTreeNew();
            // returns array tickets(integer Id, string Titel,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketTreeOpen':
			$response = BLAM::getTicketTreeOpen();
            // returns array tickets(integer Id, string Titel, string UserId,,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketTreeClosed':
			$response = BLAM::getTicketTreeClosed();
            // returns array tickets(integer Id, string Titel, string UserId,,array time(Hours,Minutes)) or exception
            break;
		
		case 'getTicketDetail':
			$response = array('id' => $_POST['id'], 'title' => "Test titel", 'text' => "Een raar bericht, maar wel heel lang en vervelend en nog veel veeel veeeeeel meeer",'status' => "Geen idee",'user' => "Anne",'created' => "2011-01-01 01:02:03",'modified' => "2011-02-02 04:05:06",'children' => null);
            // returns integer Id, string Status, string Titel, string UserId, string Text, string Locatie, array time(Hours,Minutes), integer MessageId, string MessageUserId, string MessageText or exception
            break;
		
		case 'closeTicket':
			$response = BLAM::closeTicket($_POST['id']);
            // returns null or exception
            break;
		
		case 'setTicketOwner':
			$response = BLAM::setTicketOwner($_POST['id']);
            // returns null or exception
            break;
		
		case 'changeTicketOwner':
			$response = BLAM::changeTicketOwner($_POST['id'], $_POST['user_id']);
            // returns null or exception
            break;
		
		case 'changeTicketDetails':
			$response = BLAM::changeTicketDetails($_POST['id'], $_POST['title'], $_POST['text'], $_POST['location'], $_POST['handle_id']);
            // returns null or exception
            break;
		
		case 'createSubTicket':
			$response = BLAM::createSubTicket($_POST['parent_id'], $_POST['text'], $_POST['location'], $_POST['handle_id'] );
            // returns integer SubTicketId or exception
            break;
		
		case 'becomeChildTicket':
			$response = BLAM::becomeChildTicket($_POST['id'], $_POST['parent_id']);
            // returns null or exception
            break;
		
		case 'becomeParentTicket':
			$response = BLAM::becomeParentTicket($_POST['id']);
            // returns array users(integer Id, string Role, string Username, integer Totaal) or exception
            break;
		
		case 'createFeedback':
			$response = BLAM::createFeedback($_POST['ticket_id'], $_POST['text'], $_POST['handle_id']);
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
