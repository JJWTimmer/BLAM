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
			INSERT INTO updates (ticket_id, type, message, updated, created)
			VALUES (
				" . DB::esc($this->ticket_id) . ",
				'" .DB::esc($this->type) . "',
                '" . DB::esc($this->message) . "',
                '1',
                '" . date('Y-m-d G:i:s') . "'
            )
            ";

		DB::query($q);
        
		$this->id = DB::getMySQLiObject()->insert_id;
        
		return $this->id;
	}
    
  public function get($id, $ticket_id, $type = 'all') {
        if (is_string($type) && $type == 'all') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, user.username AS called_by, u.created, u.updated
                FROM updates AS u
                LEFT OUTER JOIN users user ON user.id = u.called_by
                WHERE u.ticket_id = " . DB::esc($ticket_id)
                . " LIMIT 0,100");
        } elseif (is_string($type) && $type == 'update') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE type = 'update' AND u.ticket_id = " . DB::esc($ticket_id)
                . " LIMIT 0,100");
        } elseif (is_string($type) && $type == 'feedback') {
            $results = DB::query("
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE u.type = 'feedback' AND u.ticket_id = " . DB::esc($ticket_id)
                . " LIMIT 0,100");
        /* Retrieve single update/feedback*/
        } elseif (!empty($id) && is_numeric($id)) {
            $results = DB::query("
                SELECT u.id, u.ticket_id, t.title, v.username AS called_by, w.username AS wl_user, u.message, u.called, u.created
                FROM updates AS u
                INNER JOIN tickets AS t ON t.id = u.ticket_id
            		LEFT OUTER JOIN users AS v ON u.called_by = v.id
            		LEFT OUTER JOIN users AS w ON t.user_id = w.id
                WHERE u.id = " . DB::esc($id)
                . " LIMIT 0,100");
        } else {
            throw new Exception('Invalid arguments for get update');
        }
            
				while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
				return $data;
	}
    
  public function getUpdateList($type = 'all',$called = null,$first_id = null, $timestamp_last_update = null, $limit_paging) {
        $q = "SELECT * FROM (
        		SELECT u.id AS id, u.ticket_id, u.type, t.title, u.called, u.created, u.modified
            FROM updates AS u
            INNER JOIN tickets AS t ON t.id = u.ticket_id";
        
        // retrieve previous updates
				if(is_numeric($first_id))
        {
      		$q.= " WHERE u.id < $first_id";
      		
					// if specific type is wanted, add this to query
      		if (is_string($type) && $type == 'update') {
      			$q.= " AND u.type = 'update'";
      		}
      			
      		if (is_string($type) && $type == 'feedback') {
      			$q.= " AND u.type = 'feedback'";
      		}
      		
      		//if called is set, add this to query
		      if (isset($called)) {
            switch ($called) {
                case 'false':
                    $q .= " AND u.called IS NULL ";
                    break;
                case 'true':
                    $q .= " AND NOT (u.called IS NULL) ";
                    break;
                default:
                    // select all
                    break;
            }
        	}
        	
        	//limit and re-order the search results for paging functionality
					$q.= " ORDER BY u.id DESC LIMIT $limit_paging) t";
					$q.= " ORDER BY id ASC";
        	
      	}
 
 				//retrieve updates about updates
				elseif(strtotime($timestamp_last_update))
				{			
					$q.= " WHERE u.modified > '$timestamp_last_update'";
					
					// if specific type is wanted, add this to query
      		if (is_string($type) && $type == 'update') {
      			$q.= " AND u.type = 'update'";
      		}
      			
      		if (is_string($type) && $type == 'feedback') {
      			$q.= " AND u.type = 'feedback'";
      		}
					
					/* retrieve all type of updates, otherwise moving issue
					//if called is set, add this to query
					if (isset($called)) {
            switch ($called) {
                case 'false':
                    $q .= " AND u.called IS NULL ";
                    break;
                case 'true':
                    $q .= " AND NOT (u.called IS NULL) ";
                    break;
                default:
                    // select all
                    break;
            }
        	}
        	*/
        	
        	//limit and re-order the search results for paging functionality
					$q.= " ORDER BY u.id DESC LIMIT $limit_paging) t";
					$q.= " ORDER BY id ASC";
				}
				
 				// first retrieval of updates
				elseif(empty($timestamp_last_update))
				{
					//this is a dummy WHERE statement 
					$q.= " WHERE u.id > 0";
					
					// if specific type is wanted, add this to query
      		if (is_string($type) && $type == 'update') {
      			$q.= " AND u.type = 'update'";
      		}
      			
      		if (is_string($type) && $type == 'feedback') {
      			$q.= " AND u.type = 'feedback'";
      		}
					
					//if called is set, add this to query
					if (isset($called)) {
            switch ($called) {
                case 'false':
                    $q .= " AND u.called IS NULL ";
                    break;
                case 'true':
                    $q .= " AND NOT (u.called IS NULL) ";
                    break;
                default:
                    // select all
                    break;
            }
        	}
        	//limit and re-order the search results for paging functionality
					$q.= " ORDER BY u.id DESC LIMIT $limit_paging) t";
					$q.= " ORDER BY id ASC";
				}
        else
				{
					throw new Exception('invalid parameters for getUpdateList');
				}
				
				$output[] = array('timestamp' => date('Y-m-d G:i:s'),'limit' => 'true');

        $results = DB::query($q);
        if ($results) while ($output[] = mysqli_fetch_assoc($results));
        if (!is_null($output) && end($output) == null) array_pop($output);
        
        if($limit_paging && count($output) < ($limit_paging+1)) $output[0]['limit']='false';
        $output[0]['query']=$q;

        return $output;
	}
    
    
  /*  
    
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
*/

	public function closeFeedback() {
        $q = "UPDATE updates SET called = NOW(), modified = '".date('Y-m-d G:i:s')."',
                    called_by = " . DB::esc($this->called_by) . " WHERE id = " . DB::esc($this->id);
		$res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
	}
    
  public function clearNotification() {
        $q = "UPDATE updates SET updated = 0 WHERE id = ".DB::esc($this->id)."";
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
  }


}

?>