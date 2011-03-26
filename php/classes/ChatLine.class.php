<?php

/* Chat line is used for the chat entries */

class ChatLine extends RVDLogBase {
	
	protected $id = '';
	protected $text = '';
    protected $user_id = '';
	protected $created = '';
	
	public function create(){
		
		DB::query("
			INSERT INTO chatlines (user_id, text, created)
			VALUES (
				".DB::esc($this->user_id).",
				'".DB::esc($this->text)."',
				NOW()
		)");
		
		// Returns the MySQLi object of the DB class
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
		
	}
    
    public function get($last_id = 'all', $since = null) {
        if (is_string($last_id) && $last_id == 'all') {
            $results = DB::query("
                SELECT t.id, t.text, t.created, users.username, users.avatar
                FROM chatlines AS t INNER JOIN users ON t.user_id = users.id
                ");
        } elseif (is_numeric($last_id) || strtotime($since)) {
            $last_id = DB::esc($last_id ? $last_id : 0);
            $since = DB::esc($since);

            $q = "
                SELECT t.id, t.text, t.created, users.username, users.avatar
                FROM chatlines AS t INNER JOIN users ON t.user_id = users.id
                WHERE t.id > $last_id";
            $q .= ($since ? " AND t.created > '$since'" : "");

            $results = DB::query($q);
        } else {
            return false;
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
}

?>