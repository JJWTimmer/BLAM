<?php

/* Message is used for the log entries */

class Message extends RVDLogBase {
	
	public $id = '';
	public $user_id = '';
	public $text = '';
    public $ticket_id = '';
    public $created = '';
    public $modified = '';
	
	public function create() {

		DB::query("
			INSERT INTO messages (user_id, text, created, modified)
			VALUES (
				" . DB::esc($this->user_id) . ",
				'" . DB::esc($this->text) . "',
                '" . DB::esc($this->created) . "',
                '" . DB::esc($this->created) . "'
            )
            ");
        
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}
    
    public function get($options = 'all') {
        if (is_string($options) && $options == 'all') {
            $results = DB::query("
                SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                ORDER BY msg.id ASC LIMIT 0,100");
        } elseif (is_array($options)) { //TODO: last_timestamp
            $last_id = DB::esc($options['last_id']);
            $since = DB::esc($options['since'] ? $options['since'] : date('Y-m-d G:i:s'));
            $max = DB::esc($options['max']);
            $ts = DB::esc($options['last_timestamp']);
            
            $q = "SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE msg.id > $last_id";
            $q .= ($since ? " AND msg.created > '$since'" : "");
            $q .= ($ts ? " AND msg.modified > '$ts'" : "");
            $q .= " ORDER BY msg.id ASC";
            $q .= " LIMIT 0,100";

            $results = DB::query($q);
        } else {
            throw new Exception('Invalid arguments for getMessages');
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
    
    public function search($keyword) {
        if (is_string($keyword)) {
            $results = DB::query("
                SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE text LIKE '%" . DB::esc($keyword) . "%'
                LIMIT 0,100");
        } else {
            return false;
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
	
	public function update() {
        $q = "UPDATE messages SET text = '" .DB::esc($this->text). "', modified = '".date('Y-m-d G:i:s')."'
              WHERE id = " . DB::esc($this->id);
		$res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
        $ticket = new Ticket(array('message_id' => DB::esc($this->id), 'text' => DB::esc($this->text)));
        $ticket->updateText();
        
	}
	
	public function setTicket($tick_no) {
        $q = "UPDATE messages SET ticket_id = " . DB::esc($tick_no) . "
              WHERE id = " . DB::esc($this->id);
		$res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
	}
}

?>