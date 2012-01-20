<?php

/* Message is used for the log entries */

class Message extends BLAMBase {
	
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
    
    public function get($options = 'empty') {
        if(is_array($options)) {
        	if ($options['first_id']) {
            $first_id = DB::esc($options['first_id']);
            		$q="SELECT * FROM (
            		SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE msg.id < $first_id
                ORDER BY msg.id DESC LIMIT 5) t
                ORDER BY id ASC";
                $results = DB::query($q);
        	}
        	elseif ($options['since'] && $options['since']!=null) {
            		$since = DB::esc($options['since']);             
           			$q="SELECT * FROM (
            		SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE msg.modified > '".$since."'
                ORDER BY msg.id DESC LIMIT 5) t
                ORDER BY id ASC";
                 $results = DB::query($q);
        	} 
        	elseif($options['since']==null){
      					$q="SELECT * FROM (
                SELECT msg.id, msg.text, msg.ticket_id, msg.created, msg.modified, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                ORDER BY msg.id DESC LIMIT 5) t
                ORDER BY id ASC";
                $results = DB::query($q);
      		}
      	}	
      	else{
            throw new Exception('Invalid arguments for getMessages');
        }
        $results = DB::query($q);
        $findmin = DB::query("select min(id) from messages");
        $first_id_db = array_pop(mysqli_fetch_assoc($findmin));
        
			$data[] = array('timestamp' => date('Y-m-d G:i:s'),'first_id_db' => $first_id_db);
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