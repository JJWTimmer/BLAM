<?php

class ChatUser extends ChatBase{
	
	protected $name = '', $avatar = '';
	
	public function save(){
		
		DB::query("
			INSERT INTO webchat_users (name, loggedin)
			VALUES (
				'".DB::esc($this->name)."',
				'".True."'
		)");
		
		return DB::getMySQLiObject();
	
	}
	
	public function update(){
	
		DB::query("
			INSERT INTO webchat_users (name)
			VALUES (
				'".DB::esc($this->name)."'				
			) ON DUPLICATE KEY UPDATE last_activity = NOW()");
		DB::query("update webchat_users set loggedin=1 WHERE name = '".DB::esc($_SESSION['user']['name'])."'");
	
	}
}

?>