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
}

?>