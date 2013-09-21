<?php

/* The Chat class exposes public static methods, used by ajax.php */

class BLAM
{
    // returns int Id, string Username, string Avatar, String Role or exception
    public static function login($name, $password)
    {
        if (!empty($name) && !empty($password)) {
            $user = new User(array(
                'username' => $name,
                'password' => $password
            ));

            // The login method returns a user array or false
            $result = $user->login();

            if ($result !== false) {
                // user is logged in succesfully
                $_SESSION['user'] = array(
                    'id' => $result['id'],
                    'username' => $result['username'],
                    'role' => $result['role'],
                    'avatar' => $result['avatar']
                );
            } else {
                //user is not logged in, destroy existing session and logout
                $user->logout();
                session_destroy();
                throw new Exception('Database error logging in.');
            }

            return $_SESSION['user'];
        } else {
            throw new Exception('Name and Password are required.');
        }
    }

    // returns string Username, string Avatar, String Role or exception
    public static function checkLogged()
    {
        // check if user is already logged in earlier?
        if (isset($_SESSION['user'])) {
            $user = new user($_SESSION['user']);
            $user->activity();
        } else {
            throw new Exception('User not logged in.');
        }

        return $_SESSION['user'];

    }

    public static function logout()
    {
        $user = new User(isset($_SESSION['user']) ? $_SESSION['user'] : array());
        $user->Logout();

        session_destroy();
    }

    // returns MessageId or exception
    public static function addMessage($text, $ticket = false, $ticket_id = null)
    {
        if (!isset($_SESSION['user'])) {
            throw new Exception('You are not logged in');
        }

        if (empty($text)) {
            throw new Exception('You haven\'t entered a message.');
        }

        $msg = new Message(array(
            'user_id' => $_SESSION['user']['id'],
            'text' => $text,
            'created' => date('Y-m-d G:i:s')
        ));

        if (isset($ticket_id) && is_numeric($ticket_id)) {
            $msg->ticket_id = $ticket_id;
        }

        // The create method returns the new id
        $insertID = $msg->create();

        $tick_no = null;
        if ($ticket) {
            $wlticket = new Ticket(array(
                'message_id' => $insertID,
                'title' => 'NIEUW',
                'text' => $text,
                'status_id' => 1
            ));

            $tick_no = $wlticket->create();
        }

        if (isset($tick_no) && is_numeric($tick_no)) $msg->setTicket($tick_no);

        return array('id' => $insertID, 'ticket_id' => $msg->ticket_id);
    }

    // returns MessageId or exception
    public static function updateMessage($id, $text, $ticket = false)
    {
        $msg = new Message(array(
            'id' => $id,
            'text' => $text
        ));

        $msg->update();

        $tick_no = null;
        if ($ticket) {
            $wlticket = new Ticket(array(
                'message_id' => $id,
                'title' => 'NIEUW',
                'text' => $text,
                'status_id' => 1
            ));

            $tick_no = $wlticket->create();
        }

        if ($tick_no) $msg->setTicket($tick_no);

        return array('id' => $msg->id);
    }

    public static function getMessages($msg_id, $timestamp_last_update = null)
    {
        $msg = new Message(array());
        $options = array(
            'first_id' => $msg_id,
            'since' => $timestamp_last_update,
            'limit_paging' => 20
        );
        $messages = $msg->get($options);
        return $messages;
    }

    public static function getMessageDetail($msg_id)
    {
        $msg = new Message(array());
        $message = $msg->getDetail($msg_id);
        return $message;
    }

    public static function searchMessages($keyword)
    {
        if (empty($keyword)) {
            throw new Exception('No keyword given to searchMessages');
        }

        $msg = new Message(array());
        $messages = $msg->search($keyword);

        return $messages;
    }

    // returns array (integer Id, string Role, string Username, string Avatar) users or exception
    public static function getUsers($options)
    {
        $user = new User(array());
        $users = $user->get($options);
        return $users;
    }

    // returns array(int groupid, string groupname, array(integer Id, integer HandleNumber, string HandleName, string description) handles) groups or exception
    public static function getGroups($recursive)
    {
        $group = new Group(array());
        $group_handles = $group->get($recursive); // true returns also handles;
        return $group_handles;
    }

    // returns array(integer Id, integer HandleNumber, string HandleName, string description) handles or exception
    public static function getHandles($group_id)
    {
        $handle = new Handle(array());
        $handles = $handle->get($group_id); // true returns also handles;
        return $handles;
    }

    public static function getTicketList($recursive, $first_id, $timestamp_last_update, $status)
    {
        $ticket = new Ticket(array());
        $limit_paging = 20;
        $tickets = $ticket->get($recursive, $first_id, $timestamp_last_update, $status, $limit_paging);
        return $tickets;
    }

    public static function searchTickets($keyword)
    {
        if (empty($keyword)) {
            throw new Exception('No keyword given to searchTickets');
        }

        $ticket = new Ticket(array());
        $tickets = $ticket->search($keyword);

        return $tickets;
    }

    // returns array (integer id,	integer ticket_id, string Title, Datetime called, Datetime created, Datetime modified) updates or exception
    public static function getUpdateList($type, $called, $first_id, $timestamp_last_update)
    {
        $update = new Update(array());
        $limit_paging = 20;
        $updates = $update->getUpdateList($type, $called, $first_id, $timestamp_last_update, $limit_paging);
        return $updates;
    }

    // returns array (id, ticket_id, type, title, message, handlename, called, called_by, created)
    public static function getUpdates($id, $ticket_id, $type)
    {
        $updates = new Update(array());
        $updates = $updates->get($id, $ticket_id, $type);
        return $updates;
    }

    public static function closeFeedback($id, $user_id)
    {
        $feedback = new Update(array(
            'id' => $id,
            'called_by' => $user_id
        ));
        $feedback->closeFeedback();
    }

    public static function addChat($text, $role, $user_id)
    {
        $chatline = new ChatLine(array(
            'text' => $text,
            'role' => $role,
            'user_id' => $user_id
        ));
        $id = $chatline->create();
        return array('id' => $id);
    }

    public static function getChats($chat_id, $role, $timestamp_last_update = null)
    {
        $chatline = new ChatLine(array());
        $options = array(
            'first_id' => $chat_id,
            'role' => $role,
            'since' => $timestamp_last_update,
            'limit_paging' => 20
        );
        $chats = $chatline->get($options);
        return $chats;
    }

    public static function getTicketDetail($id)
    {
        $ticket = new Ticket(array('id' => $id));
        $details = $ticket->getDetails();
        return $details;
    }

    public static function closeTicket($id)
    {
        $ticket = new Ticket(array('id' => $id));
        $ticket->close();
    }

    public static function setTicketOwner($id)
    {
        $ticket = new Ticket(array(
            'id' => $id,
            'user_id' => $_SESSION['user']['id']
        ));
        $ticket->setOwner();
    }

    public static function changeTicketOwner($id, $user_id)
    {
        $ticket = new Ticket(array(
            'id' => $id,
            'user_id' => $user_id
        ));
        $ticket->setOwner();
    }

    public static function changeTicketDetails($id, $title, $text, $location, $solution, $reference, $handle_id)
    {
        $ticket = new Ticket(array(
            'id' => $id,
            'title' => $title,
            'text' => $text,
            'location' => $location,
            'solution' => $solution,
            'reference' => $reference,
            'handle_id' => $handle_id
        ));
        $ticket->update();
    }

    public static function createUpdate($ticket_id, $message)
    {
        $update = new Update(array(
            'ticket_id' => $ticket_id,
            'user_id' => $_SESSION['user']['id'],
            'type' => 'update',
            'message' => $message
        ));
        $id = $update->create();
        return $id;
    }

    public static function createFeedback($ticket_id, $message)
    {
        $update = new Update(array(
            'ticket_id' => $ticket_id,
            'user_id' => $_SESSION['user']['id'],
            'type' => 'feedback',
            'message' => $message
        ));
        $id = $update->create();
        return $id;
    }

    public static function createAddition($ticket_id, $message)
    {
        $update = new Update(array(
            'ticket_id' => $ticket_id,
            'user_id' => $_SESSION['user']['id'],
            'type' => 'addition',
            'message' => $message
        ));
        $id = $update->create();

        $ticket = new Ticket(array('id' => $ticket_id));
        $ticket->setNotification();
        return $id;
    }

    public static function createAnswer($ticket_id, $message)
    {
        $update = new Update(array(
            'ticket_id' => $ticket_id,
            'user_id' => $_SESSION['user']['id'],
            'type' => 'answer',
            'message' => $message
        ));
        $id = $update->create();

        $ticket = new Ticket(array('id' => $ticket_id));
        $ticket->setNotification();
        return $id;
    }

    public static function becomeChildTicket($id, $parent_id)
    {
        $ticket = new Ticket(array(
            'id' => $id,
            'parent_id' => $parent_id
        ));
        $ticket->becomeChild();
    }

    public static function becomeParentTicket($id)
    {
        $ticket = new Ticket(array('id' => $id));
        $ticket->becomeParent();
    }

    public static function getAutotext()
    {
        $autotext = new Autotext(array());
        $autotexts = $autotext->get();
        return $autotexts;
    }


    public static function confirmNotification($ticket_id, $update_id, $type)
    {
        $ticket = new Ticket(array('id' => $ticket_id));
        $output = $ticket->getOwner();
        $owner = $output[0]['wluser'];

        if ($owner == $_SESSION['user']['username']) {
            switch ($type) {
                case 'message':
                    //get id for message from somewhere, not from client
                    $msg = new Message(array('ticket_id' => $ticket_id));
                    $msg->clearNotification();
                    $ticket->clearNotification();
                    break;

                case 'addition':
                    $update = new Update(array('id' => $update_id));

                    $update->clearNotification();
                    $ticket->clearNotification();
                    break;

                case 'answer':
                    $update = new Update(array('id' => $update_id));
                    $update->clearNotification();
                    $ticket->clearNotification();
                    break;

                default:
                    throw new Exception('Wrong type for notification');
            }
        }
    }

    // returns MessageId or exception
    public static function getReminders($day)
    {
        $rem = new Reminder(array());
        $reminders = $rem->get($day);
        return $reminders;
    }

    public static function getTaskDetail($id)
    {
        $task = new Reminder(array('id' => $id));
        $details = $task->getDetails();
        return $details;
    }

    // returns MessageId or exception
    public static function getSMSList($handled, $first_id, $timestamp_last_update)
    {
        $sms = new SMS(array());
        $limit_paging = 20;
        $messages = $sms->getList($handled, $first_id, $timestamp_last_update, $limit_paging);
        return $messages;
    }

    public static function getSMSDetail($id)
    {
        $sms = new SMS(array('id' => $id));
        $details = $sms->get();
        return $details;
    }

    public static function handleSMS($id, $user_id)
    {
        $sms = new SMS(array(
            'id' => $id,
            'handled_by' => $user_id
        ));
        $sms->handle();
    }
}
