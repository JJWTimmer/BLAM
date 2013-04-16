<?php

/* Chat line is used for the chat entries */

class ChatLine extends BLAMBase
{

    public $id = '';
    public $text = '';
    public $role = '';
    public $role_id = '';
    public $user_id = '';
    public $created = '';

    public function create()
    {
    	
    	
			$q = "SELECT id,name FROM roles WHERE name = '".DB::esc($this->role)."'";
      $dbresult = DB::query($q);
      if ($dbresult->num_rows == 1) {
      	$role_result = $dbresult->fetch_array();
        $this->role_id = $role_result['id'];
      } 
      else
      {
    		throw new Exception('unknown chat');
    	}
     
      DB::query("
      INSERT INTO chatlines (user_id, text, role_id, created)
			VALUES (
			" . DB::esc($this->user_id) . ",
			'" . DB::esc($this->text) . "',
			" . DB::esc($this->role_id) . ",
			NOW()
			)");
			// Returns the MySQLi object of the DB class
      $this->id = DB::getMySQLiObject()->insert_id;
      
      return $this->id;         	
    }

    public function get($options = 'empty')
    {
        if (is_array($options)) {
            $dbresult = DB::query("SELECT id,name FROM roles WHERE name = '".DB::esc($options['role'])."'");
      			if ($dbresult->num_rows == 1) {
      				$role_result = $dbresult->fetch_array();
        			$this->role_id = $role_result['id'];
      			}
      			else
      			{
    				throw new Exception('unknown chat');
    				}
            
            $q = "SELECT * FROM (
            			SELECT t.id, t.text, t.created, users.username, users.avatar
                	FROM chatlines AS t INNER JOIN users ON t.user_id = users.id";
            if ($options['first_id'] && is_numeric($options['first_id'])){
                $first_id = DB::esc($options['first_id']);
                $limit_paging = DB::esc($options['limit_paging']);
                $q .= " WHERE t.id < $first_id";
                $q .= " AND t.role_id = ".$this->role_id;
                $q .= " ORDER BY t.id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                $since = DB::esc($options['since']);
                $q .= ($since ? " WHERE t.created >= '" . $since . "'" : "");
                $q .= " AND t.role_id = ".$this->role_id;
                $q .= " ORDER BY t.id DESC LIMIT 20) t";
                $q .= " ORDER BY id ASC";
            }
            $results = DB::query($q);
        } else {
            throw new Exception('Invalid arguments for getChats');
        }

        $data[] = array('timestamp' => date('Y-m-d G:i:s'), 'limit' => 'true');
        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        if ($limit_paging && count($data) < ($limit_paging + 1)) $data[0]['limit'] = 'false';
        $data[0]['query'] = $q;
        return $data;
    }
}

?>