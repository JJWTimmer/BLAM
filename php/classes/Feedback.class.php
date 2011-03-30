<?php

/* Ticket is used for the log entries */

class Feedback extends RVDLogBase {
	
	protected $id = '';
	protected $ticket_id = '';
	protected $title = '';
	protected $handle_id = '';
	protected $message = '';
	protected $called = '';
	protected $called_by = '';
    protected $created = '';

	public function create() {

		DB::query("
			INSERT INTO feedbacks (ticket_id, title, handle_id, message, created)
			VALUES (
				" . DB::esc($this->ticket_id) . ",
				'" . DB::esc($this->title) . "',
                " . DB::esc($this->handle_id) . ",
                '" . DB::esc($this->message) . "',
                '" . date('Y-m-d G:i:s') . "',
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

        $q = "SELECT f.id AS id, f.ticket_id, f.title, h.handle_name as handle, f.message, f.called, u.username, f.created
            FROM feedbacks AS f
            INNER JOIN tickets AS t ON t.id = f.ticket_id
            INNER JOIN handles AS h ON h.id = f.handle_id
            LEFT OUTER JOIN users u ON u.id = f.called_by";
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

	public function close() {
        $q = "UPDATE feedbacks SET called = NOW(),
                    called_by = " . DB::esc($this->called_by) . " WHERE id = " . DB::esc($this->id);
		$res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
	}
    
}

?>