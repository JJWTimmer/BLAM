<?php

/* Chat line is used for the chat entries */

class ChatLine extends RVDLogBase {
	
	protected $text = '', $author = '', $avatar = '';
	
	public function save(){
		
		DB::query("
			INSERT INTO webchat_lines (author, avatar, text)
			VALUES (
				'".DB::esc($this->author)."',
				'".DB::esc($this->avatar)."',
				'".DB::esc($this->text)."'
		)");
		
		// Returns the MySQLi object of the DB class
		
		return DB::getMySQLiObject();
		
	}
}

?>