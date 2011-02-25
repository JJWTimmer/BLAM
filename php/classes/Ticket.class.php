<?php

/* Ticket is used for the log entries */

class Ticket extends RVDLogBase {
	
	protected $id = '';
	protected $user_id = '';
	protected $parent_id = '';
	protected $title = '';
	protected $message_id = '';
	protected $status_id = '';
	protected $handle_id = '';
	protected $location = '';
	protected $text = '';
    protected $created = '';
	protected $modified = '';

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

}

?>