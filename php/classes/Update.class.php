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

		DB::query("
			INSERT INTO updates (ticket_id, type, title, message,  handle_id, created)
			VALUES (
				" . DB::esc($this->ticket_id) . ",
				'" .DB::esc($this->type) . "',
				'" . DB::esc($this->title) . "',
                " . (empty($this->handle_id) ? 'NULL' : DB::esc($this->handle_id)) . ",
                '" . DB::esc($this->message) . "',
                '" . date('Y-m-d G:i:s') . "'
            )
            ");
        
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}
    
    public function get($id = null, $called = null) {
        if (!(is_numeric($id) || is_null($id))
            || !((is_string($called) && ($called == 'true' || $called == 'false' )) || is_null($id))) {
            throw new Exception('invalid parameters for getFeedback');
        }

        $q = "SELECT f.id AS id, f.ticket_id, u2.username AS wl_user, f.title, h.handle_name as handle, f.message, f.called, u.username AS called_by, f.created
            FROM feedbacks AS f
            INNER JOIN tickets AS t ON t.id = f.ticket_id
            INNER JOIN handles AS h ON h.id = f.handle_id
            LEFT OUTER JOIN users u ON u.id = f.called_by
            LEFT OUTER JOIN users u2 ON t.user_id = u2.id";
        $prev_pred = false;
        if (!empty($id) && is_numeric($id) ) {
            $q .= " WHERE t.id > $id";
            $prev_pred = true;
        }
        if (isset($called)) {
            if (!$prev_pred) $q .= " WHERE ";
            else $q .= " AND ";
            switch ($called) {
                case 'false':
                    $q .= " f.called IS NULL ";
                    break;
                case 'true':
                    $q .= " NOT (f.called IS NULL) ";
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