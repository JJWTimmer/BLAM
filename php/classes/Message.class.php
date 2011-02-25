<?php

/* Message is used for the log entries */

class Message extends RVDLogBase {
	
	protected $id = '';
	protected $user_id = '';
	protected $text = '';
    protected $created = '';
	
	public function create() {

		DB::query("
			INSERT INTO messages (user_id, text, created)
			VALUES (
				'" . DB::esc($this->user_id) . "',
				'" . DB::esc($this->text) . "',
                '" . DB::esc($this->created) . "'
            )
            ");
        
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}
    
    public function get($options = 'all') {
        if (is_string($options) && $options == 'all') {
            $results = DB::query("
                SELECT msg.id, msg.text, msg.created, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                ");
        } elseif (is_array($options)) {
            $last_id = DB::esc($options['last_id']);
            $since = DB::esc($options['since']);
            
            $results = DB::query("
                SELECT msg.id, msg.text, msg.created, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE msg.id > $last_id AND msg.created > $since
                ");
        } else {
            return false;
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if ($data[-1] == null) array_pop($data);
		return $data;
	}
    
    public function search($keyword) {
        if (is_string($keyword)) {
            $results = DB::query("
                SELECT msg.id, msg.text, msg.created, users.username, users.avatar
                FROM messages AS msg INNER JOIN users ON msg.user_id = users.id
                WHERE MATCH(text) AGAINST('" . DB::esc($keyword) . "' IN BOOLEAN MODE)
                ");
            logmsg(DB::getMySQLiObject()->error);
        } else {
            return false;
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if ($data[-1] == null) array_pop($data);
		return $data;
	}

}

?>