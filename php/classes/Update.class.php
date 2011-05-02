<?php

/* Ticket is used for the log entries */

class Update extends RVDLogBase {
	
	protected $id = '';
	protected $ticket_id = '';
	protected $type = '';
	protected $title = '';
	protected $message = '';
	protected $handle_id = '';
	protected $called = '';
	protected $called_by = '';
    protected $created = '';

	public function create() {

        $q = "
			INSERT INTO updates (ticket_id, type, title, message, handle_id, created)
			VALUES (
				" . DB::esc($this->ticket_id) . ",
				'" .DB::esc($this->type) . "',
				'" . (empty($this->title) ? 'NULL' : DB::esc($this->title)) . "',
                '" . DB::esc($this->message) . "',
                " . (empty($this->handle_id) ? 'NULL' : DB::esc($this->handle_id)) . ",
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
                SELECT u.id, u.ticket_id, u.type, u.title, u.message, h.handle_name, h.description, u.called, u.called_by, u.created
                FROM updates AS u LEFT OUTER JOIN handles AS h ON u.handle_id = h.id
                WHERE u.ticket_id = " . DB::esc($for));
        } elseif (is_string($type) && $type == 'update') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.title, u.message, h.handle_name, h.description, u.called, u.called_by, u.created
                FROM updates AS u LEFT OUTER JOIN handles AS h ON u.handle_id = h.id
                WHERE type = 'update' AND u.ticket_id = " . DB::esc($for));
        } elseif (is_string($type) && $type == 'feedback') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.title, u.message, h.handle_name, h.description, u.called, u.called_by, u.created
                FROM updates AS u LEFT OUTER JOIN handles AS h ON u.handle_id = h.id
                WHERE type = 'feedback' AND u.ticket_id = " . DB::esc($for));
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

        $q = "SELECT f.id AS id, f.ticket_id, u2.username AS wl_user, f.title, h.handle_name as handle, h.description, f.message, f.called, u.username AS called_by, f.created
            FROM updates AS f
            INNER JOIN tickets AS t ON t.id = f.ticket_id
            INNER JOIN handles AS h ON h.id = f.handle_id
            LEFT OUTER JOIN users u ON u.id = f.called_by
            LEFT OUTER JOIN users u2 ON t.user_id = u2.id
            WHERE f.type = 'feedback'";
        if (!empty($id) && is_numeric($id) ) {
            $q .= " AND t.id > $id";
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