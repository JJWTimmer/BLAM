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

        $q  = "
			INSERT INTO tickets (title, message_id, status_id, text, created, modified)
			VALUES (
				'" . DB::esc($this->title) . "',
				 " . DB::esc($this->message_id) . ",
				 " . DB::esc($this->status_id) . ",
				'" . DB::esc($this->text) . "',
                '" . date('Y-m-d G:i:s') . "',
                '" . date('Y-m-d G:i:s') . "'
            )
            ";
		$res = DB::query($q);
        
        if ($res)
            $this->id = DB::getMySQLiObject()->insert_id;
        else
            throw new Exception(DB::getMySQLiObject()->error);
		return $this->id;
	}

	public function createSub() {
    
        $q = "
			INSERT INTO tickets (parent_id, title, text, location, handle_id, status_id, created, modified)
			VALUES (
				 " . DB::esc($this->parent_id) . ",
				'" . DB::esc($this->title) . "',
				'" . DB::esc($this->text) . "',
				'" . DB::esc($this->location) . "',
				 " . DB::esc($this->handle_id ? $this->handle_id : "NULL") . ",
                1,
                '" . date('Y-m-d G:i:s') . "',
                '" . date('Y-m-d G:i:s') . "'
            )
            ";

		$res = DB::query($q);
            
        if (!$res)
           throw new Exception(DB::getMySQLiObject()->error);
           
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}    
    
	public function update() {
        $handle = !empty($this->handle_id);
		$res = DB::query("
			UPDATE tickets
			SET	title = '" . DB::esc($this->title) . "',
				text = '" . DB::esc($this->text) . "',
                location = '" . DB::esc($this->location) . "',"
                . ($handle ? "handle_id = " . DB::esc($this->handle_id) . "," : "")
                . "modified = '" . date('Y-m-d G:i:s') . "' 
            WHERE id = " . DB::esc($this->id) . "
            ");
            
        if (!$res)
           throw new Exception(DB::getMySQLiObject()->error);
	}
    
    public function getDetails() {
        $q = "SELECT t.id AS id, t.title, t.handle_id, t.location, t.text, s.name AS status, u.username AS wluser, u2.username AS rvduser, t.created, t.modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            LEFT OUTER JOIN statuses AS s ON t.status_id = s.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN users AS u2 ON m.user_id = u2.id
            WHERE t.id = " . DB::esc($this->id);
            
        $results = DB::query($q);
        
        if (!$results)
           throw new Exception(DB::getMySQLiObject()->error);
        
        $output = null;
        if ($results) while ($output[] = mysqli_fetch_assoc($results));
        if (!is_null($output) && end($output) == null) array_pop($output);
        
        if (!empty($output)) $output[0]['children'] = $this->getChildren(DB::esc($this->id));
        
        return $output; 
    }
    
    public function get($recursive = 'false', $last_id = null, $last_modified = null, $status = array()) {
        if (   !($recursive == 'true'|| $recursive == 'false' || is_null($recurive) )
            || !(is_numeric($last_id) || is_null($last_id))
            || !(strtotime($last_modified) || is_null($last_modified))
            || !(is_array($status) || empty($status))) {
            throw new Exception('invalid parameters for getTicket');
        }
        
        $q = "SELECT t.id AS id, t.title, t.handle_id, t.location, t.text, s.name AS status, u.username AS wluser, u2.username AS rvduser, t.created, t.modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN users AS u2 ON m.user_id = u2.id
            WHERE t.parent_id IS NULL";

        if (is_numeric($last_id)) {
            $q .= "AND t.id > $last_id";
        }
        if (strtotime($last_modified)) {
            $q .= " AND t.modified > '$last_modified'";
        }
        if (is_array($status) && !empty($status)) {
            $q .= " AND s.name IN ('" . implode("','", $status[0]) . "') "; // security risk, implode not escaped
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
        $q = "
            SELECT t.id AS id, t.title, t.handle_id, t.location, t.text, s.name AS status, u.username AS wluser, u2.username AS rvduser, t.created, t.modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN users AS u2 ON m.user_id = u2.id
            WHERE t.parent_id = $pid
            ";
        $results = DB::query($q);
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
    
    public function close() {
        $q = "
            UPDATE tickets
            SET status_id = 3, modified = '".date('Y-m-d G:i:s')."'
            WHERE id = ".DB::esc($this->id)."
            ";
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }
    
    public function setOwner() {
        $q = "
            UPDATE tickets
            SET user_id = ".DB::esc($this->user_id).", modified = '".date('Y-m-d G:i:s')."', status_id = 2
            WHERE id = ".DB::esc($this->id);

        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }
    
    public function becomeChild() {
        $q = "
            UPDATE tickets
            SET parent_id = ".DB::esc($this->parent_id).", modified = '".date('Y-m-d G:i:s')."'
            WHERE id = ".DB::esc($this->id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }

    
    public function becomeParent() {
        $q = "
            UPDATE tickets
            SET parent_id = NULL, modified = '".date('Y-m-d G:i:s')."'
            WHERE id = ".DB::esc($this->id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }
}

?>