<?php

/* Message is used for the log entries */

class Handle extends RVDLogBase {
	
	protected $id = '';
	protected $handle_number = '';
	protected $handle_name = '';
    protected $description = '';

    public function get($group = null) {
        if (is_null($group)) {
            $results = DB::query("
                SELECT id, handle_number, handle_name, description
                FROM handles
                ");
        } elseif (is_numeric($group)) {
            $group_id = DB::esc($group);
            
            $results = DB::query("
                SELECT id, handle_number, handle_name, description
                FROM handles
                WHERE group_id = $group_id
                ");
        } else {
            return false;
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
}

?>