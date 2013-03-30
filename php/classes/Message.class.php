<?php

/* Message is used for the log entries */

class Message extends BLAMBase
{

    public $id = '';
    public $user_id = '';
    public $text = '';
    public $ticket_id = '';
    public $created = '';
    public $modified = '';

    public function create()
    {
        $q = "
			INSERT INTO messages (user_id, text, created, modified".(!empty($this->ticket_id) ? ", ticket_id" : "").")
			VALUES (
				" . DB::esc($this->user_id) . ",
				'" . DB::esc($this->text) . "',
                '" . DB::esc($this->created) . "',
                '" . DB::esc($this->created) . "'".
            (!empty($this->ticket_id) ? ", " . $this->ticket_id : "")."
            )
            ";

        DB::query($q);

        $this->id = DB::getMySQLiObject()->insert_id;

        return $this->id;
    }

    public function get($options = 'empty')
    {
        if (is_array($options)) {
            $q = "SELECT * FROM (
            		SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id";
            if ($options['first_id'] && is_numeric($options['first_id'])) {
                $first_id = DB::esc($options['first_id']);
                $limit_paging = DB::esc($options['limit_paging']);
                $q .= " WHERE msg.id < $first_id";
                $q .= " ORDER BY msg.id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                $since = DB::esc($options['since']);
                $q .= ($since ? " WHERE msg.modified >= '" . $since . "'" : "");
                $q .= " ORDER BY msg.id DESC LIMIT 20) t";
                $q .= " ORDER BY id ASC";
            }
            $results = DB::query($q);
        } else {
            throw new Exception('Invalid arguments for getMessages');
        }

        $data[] = array('timestamp' => date('Y-m-d G:i:s'), 'limit' => 'true');
        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        //check if the returned nr of messages is the paging limit or not. if not change limit to false
        if ($limit_paging && count($data) < ($limit_paging + 1)) $data[0]['limit'] = 'false';
        //$data[0]['query']=$q;
        return $data;
    }

    public function search($keyword)
    {
        if (is_string($keyword)) {
            $results = DB::query("
                SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE text LIKE '%" . DB::esc($keyword) . "%'
                LIMIT 0,100");
        } else {
            return false;
        }

        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        return $data;
    }


    public function update()
    {
        $q = "UPDATE messages SET text = '" . DB::esc($this->text) . "', modified = '" . date('Y-m-d G:i:s') . "', updated = 1
              WHERE id = " . DB::esc($this->id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
        $ticket = new Ticket(array('message_id' => DB::esc($this->id), 'text' => DB::esc($this->text)));
        $ticket->updateText();

    }

    public function clearNotification()
    {
        $q = "UPDATE messages SET updated = 0 WHERE ticket_id = " . DB::esc($this->ticket_id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }

    public function setTicket($tick_no)
    {
        $q = "UPDATE messages SET ticket_id = " . DB::esc($tick_no) . "
              WHERE id = " . DB::esc($this->id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }
}

?>