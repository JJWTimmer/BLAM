<?php

/* Chat line is used for the chat entries */

class ChatLine extends BLAMBase
{

    public $id = '';
    public $text = '';
    public $user_id = '';
    public $created = '';

    public function create()
    {

        DB::query("
			INSERT INTO chatlines (user_id, text, created)
			VALUES (
				" . DB::esc($this->user_id) . ",
				'" . DB::esc($this->text) . "',
				NOW()
		)");

        // Returns the MySQLi object of the DB class
        $this->id = DB::getMySQLiObject()->insert_id;

        return $this->id;

    }

    public function get($options = 'empty')
    {
        if (is_array($options)) {
            $q = "SELECT * FROM (
            			SELECT t.id, t.text, t.created, users.username, users.avatar
                	FROM chatlines AS t INNER JOIN users ON t.user_id = users.id";
            if ($options['first_id'] && is_numeric($options['first_id'])) {
                $first_id = DB::esc($options['first_id']);
                $limit_paging = DB::esc($options['limit_paging']);
                $q .= " WHERE t.id < $first_id";
                $q .= " ORDER BY t.id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                $since = DB::esc($options['since']);
                $q .= ($since ? " WHERE t.created >= '" . $since . "'" : "");
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