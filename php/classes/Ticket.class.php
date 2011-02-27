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
    
    public function get($recursive = false, $last_id = null, $last_modified = null, $status = array()) {
        if (   !($recursive == 'true'|| $recursive == 'false' || is_null($recurive) )
            || !(is_numeric($last_id) || is_null($last_id))
            || !(strtotime($last_modified) || is_null($last_modified))
            || !(is_array($status) || empty($status))) {
            throw new Exception('invalid parameters for getTicket');
        }
        
        $q = "SELECT t.id AS id, title, text, s.name AS status, u.username AS user, created, modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            WHERE t.parent_id IS NULL ";

        if (is_numeric($last_id)) {
            $q .= "AND t.id > $last_id";
        }
        if (strtotime($last_modified)) {
            $q .= " AND t.modified > '$last_modified'";
        }
        if (is_array($status) && !empty($status)) {
            $q .= " AND s.status IN ('" . DB::esc(implode("','", $status[0])) . "') ";
        }
         
        if ($recursive == 'false') {
            $results = DB::query($q);
            if ($results) while ($output[] = mysqli_fetch_assoc($results));
            if (!is_null($output) && end($output) == null) array_pop($output);
            
        } elseif ($recursive == 'true') {
            $results = DB::query($q);
            if ($results) {
                while ($data[] = mysqli_fetch_assoc($results));
                if (!is_null($data) && end($data) == null) array_pop($data);

                foreach ($data as $parent) {
                    $parent['children'] = $this->getChildren($parent['id']);
                    $output[] = $parent;
                }  
            } else {
                $output = array();
            }
        }
        return $output;
	}

    private function getChildren($pid) {
        $results = DB::query("
            SELECT t.id AS id, title, text, s.name AS status, u.username AS user, created, modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            WHERE t.parent_id = $pid
            ");
        while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
        foreach ($data as $child) {
            if ($child['parent_id'] != null) {
                $child['children'] = $this->getChildren($child['id']);
            }
            $output[] = $child;
        }
        return $output;
    }

}

?>