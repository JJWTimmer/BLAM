<?php

/* Ticket is used for the log entries */

class Update extends BLAMBase {
	
	public $id = '';
	public $ticket_id = '';
	public $type = '';
	public $message = '';
	public $called = '';
	public $called_by = '';
    public $created = '';

	public function create() {

        $q = "
			INSERT INTO updates (ticket_id, type, message, created)
			VALUES (
				" . DB::esc($this->ticket_id) . ",
				'" .DB::esc($this->type) . "',
                '" . DB::esc($this->message) . "',
                '" . date('Y-m-d G:i:s') . "'
            )
            ";

		DB::query($q);
        
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}
    
    public function get($for, $type = 'all') {
        if (is_string($type) && $type == 'all') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE u.ticket_id = " . DB::esc($for)
                . " LIMIT 0,100");
        } elseif (is_string($type) && $type == 'update') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE type = 'update' AND u.ticket_id = " . DB::esc($for)
                . " LIMIT 0,100");
        } elseif (is_string($type) && $type == 'feedback') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE u.type = 'feedback' AND u.ticket_id = " . DB::esc($for)
                . " LIMIT 0,100");
        } else {
            throw new Exception('Invalid arguments for get update');
        }
            
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
    
    public function getFeedback($id = null, $called = null) {
        if (!(is_numeric($id) || is_null($id))
            || !((is_string($called) && ($called == 'true' || $called == 'false' )) || is_null($id))) {
            throw new Exception('invalid parameters for getFeedback');
        }

        $q = "SELECT f.id AS id, f.ticket_id, t.title, u2.username AS wl_user, f.message, f.called, u.username AS called_by, f.created
            FROM updates AS f
            INNER JOIN tickets AS t ON t.id = f.ticket_id
            LEFT OUTER JOIN users u ON u.id = f.called_by
            LEFT OUTER JOIN users u2 ON t.user_id = u2.id
            WHERE f.type = 'feedback'";
        if (!empty($id) && is_numeric($id) ) {
            $q .= " AND f.id = $id";
        }
        if (isset($called)) {
            switch ($called) {
                case 'false':
                    $q .= " AND f.called IS NULL ";
                    break;
                case 'true':
                    $q .= " AND NOT (f.called IS NULL) ";
                    break;
                default:
                    // select all
                    break;
            }
        }
        $q .= " LIMIT 0, 100";

        $results = DB::query($q);
        if ($results) while ($output[] = mysqli_fetch_assoc($results));
        if (!is_null($output) && end($output) == null) array_pop($output);

        return $output;
	}

	public function closeFeedback() {
        $q = "UPDATE updates SET called = NOW(),
                    called_by = " . DB::esc($this->called_by) . " WHERE id = " . DB::esc($this->id);
		$res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
	}
}

?>