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
		
		return DB::getMySQLiObject();
	
	}

}

?>