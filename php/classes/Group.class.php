<?php

/* Message is used for the log entries */

class Group extends RVDLogBase {
	
	protected $id = '';
	protected $name = '';
	
    public function get($recursive = 'false') {
        if ($recursive == 'false') {
            $results = DB::query("
                SELECT id, name
                FROM groups
                ");
            
            while ($res[] = mysqli_fetch_assoc($results));
            if (!is_null($res) && end($res) == null) array_pop($res);

        } elseif ($recursive == 'true') {
            $results = DB::query("
                SELECT id, name
                FROM groups
                ");
            while ($groups[] = mysqli_fetch_assoc($results));
            if (!is_null($groups) && end($groups) == null) array_pop($groups);
        
            $handle = new Handle(array());
            
            foreach ($groups as $g) {
                $g['handles'] = $handle->get($g['id']);
                $res[] = $g;
            }
        } else {
            return array();
        }

		return $res;
	}
 
}

?>