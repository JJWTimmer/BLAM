<?php

/* Ticket is used for the log entries */

class Ticket extends BLAMBase
{

    public $id = '';
    public $user_id = '';
    public $parent_id = '';
    public $message_id = '';
    public $status_id = '';
    public $title = '';
    public $text = '';
    public $location = '';
    public $solution = '';
    public $handle_id = '';
    public $reference = '';
    public $created = '';
    public $modified = '';

    public function create()
    {

        $q = "
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

    public function update()
    {
        $handle = !empty($this->handle_id);
        $q = "
			UPDATE tickets
			SET	title = '" . DB::esc($this->title) . "',
				text = '" . DB::esc($this->text) . "',
                location = '" . DB::esc($this->location) . "',
				solution = '" . DB::esc($this->solution) . "',
                reference = '" . DB::esc($this->reference) . "',"
            . "handle_id = " . ($handle ? DB::esc($this->handle_id) : "NULL") . ","
            . "modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->id);
        $res = DB::query($q);

        if (!$res)
            throw new Exception(DB::getMySQLiObject()->error);
    }

    public function updateText()
    {
        $res = DB::query("
			UPDATE tickets
			SET	text = '" . DB::esc($this->text) . "',
            modified = '" . date('Y-m-d G:i:s') . "',
            updated = 1
            WHERE message_id = " . DB::esc($this->message_id)
        );

        if (!$res)
            throw new Exception(DB::getMySQLiObject()->error);
        $id = DB::getMySQLiObject()->insert_id;

        return $id;
    }

    public function getDetails()
    {
        $q = "SELECT t.id AS id, t.title, t.handle_id, t.location, t.reference, t.text, t.solution, s.name AS status, m.updated AS messageupdated,u.username AS wluser, u2.username AS rvduser, t.created, t.modified
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
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        if (!empty($output)) $output[0]['children'] = $this->getChildren(DB::esc($this->id));

        return $output;
    }

    public function get($recursive = 'false', $first_id = null, $timestamp_last_update = null, $status = array(), $limit_paging)
    {
        $q = "SELECT * FROM (
        	SELECT t.id AS id, t.title, s.name AS status, u.username AS wluser, t.modified, t.updated
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            WHERE t.parent_id IS NULL";

        // retrieve previous tickets
        if (($recursive == 'true' || $recursive == 'false' || is_null($recursive)) && is_numeric($first_id) && (is_array($status) || empty($status))) {
            if (is_array($status) && !empty($status)) {
                $q .= " AND s.name IN ('" . implode("','", $status[0]) . "') "; // security risk, implode not escaped
            }
            $q .= " AND t.id < $first_id";
            $q .= " ORDER BY t.id DESC LIMIT $limit_paging) t";
            $q .= " ORDER BY id ASC";
        } //retrieve updates about tickets
        elseif (($recursive == 'true' || $recursive == 'false' || is_null($recursive)) && strtotime($timestamp_last_update) && (is_array($status) || empty($status))) {
            if (is_array($status) && !empty($status)) {
                //just return all type of tickets which are modified, otherwise moving issue
                //$q .= " AND s.name IN ('" . implode("','", $status[0]) . "') "; // security risk, implode not escaped
            }
            $q .= " AND t.modified > '$timestamp_last_update'";
            $q .= " ORDER BY t.id DESC LIMIT 5) t";
            $q .= " ORDER BY id ASC";
        } //retrieve all tickets (for select box)
        elseif (($recursive == 'true' || $recursive == 'false' || is_null($recursive)) && ($timestamp_last_update == 'all') && (is_array($status) || empty($status))) {
            if (is_array($status) && !empty($status)) {
                $q .= " AND s.name IN ('" . implode("','", $status[0]) . "') "; // security risk, implode not escaped
            }
            $q .= " ORDER BY t.id DESC) t";
            $q .= " ORDER BY id ASC";
        } // first retrieval of tickets
        elseif (($recursive == 'true' || $recursive == 'false' || is_null($recursive)) && empty($timestamp_last_update) && (is_array($status) || empty($status))) {
            if (is_array($status) && !empty($status)) {
                $q .= " AND s.name IN ('" . implode("','", $status[0]) . "') "; // security risk, implode not escaped
            }
            $q .= " ORDER BY t.id DESC LIMIT 20) t";
            $q .= " ORDER BY id ASC";
        } else {
            throw new Exception('invalid parameters for getTicket');
        }

        $output[] = array('timestamp' => date('Y-m-d G:i:s'), 'limit' => 'true');

        if ($recursive == 'false') {
            $results = DB::query($q);
            if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
            if (!is_null($output) && end($output) == null) array_pop($output);

        } elseif ($recursive == 'true') {
            $results = DB::query($q);
            if ($results) {
                while ($data[] = mysqli_fetch_assoc($results)) ;
                if (!is_null($data) && end($data) == null) array_pop($data);

                foreach ($data as $parent) {
                    $parent['children'] = $this->getChildren($parent['id']);
                    $output[] = $parent;
                }
            } else {
                $output = array();
            }
        }
        if ($limit_paging && count($output) < ($limit_paging + 1)) $output[0]['limit'] = 'false';
        //$output[0]['query']=$q;
        return $output;
    }

    private function getChildren($pid)
    {
        $q = "
            SELECT t.id AS id, t.title, t.handle_id, t.location, t.reference, t.text, t.solution, s.name AS status, u.username AS wluser, u2.username AS rvduser, t.created, t.modified
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            INNER JOIN statuses AS s ON t.status_id = s.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN users AS u2 ON m.user_id = u2.id
            WHERE t.parent_id = $pid
            ORDER BY t.id ASC
            ";
        $results = DB::query($q);
        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        foreach ($data as $child) {
            if ($child['parent_id'] != null) {
                $child['children'] = $this->getChildren($child['id']);
            }
            $output[] = $child;
        }
        return $output;
    }

    public function search($keyword)
    {
        if (is_string($keyword)) {
            $results = DB::query("
                SELECT DISTINCT t.id AS id, t.title, s.name AS status, us.username AS wluser, t.modified
                FROM tickets AS t
                    LEFT OUTER JOIN users AS us ON t.user_id = us.id
            	    LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            	    LEFT OUTER JOIN updates AS ud ON t.id = ud.ticket_id
            		INNER JOIN statuses AS s ON t.status_id = s.id
                WHERE   t.title LIKE '%" . DB::esc($keyword) . "%'
                    OR  CAST(t.id as CHAR) LIKE '%" . DB::esc($keyword) . "%'
                    OR  t.text LIKE '%" . DB::esc($keyword) . "%'
                    OR  t.location LIKE '%" . DB::esc($keyword) . "%'
                    OR  t.solution LIKE '%" . DB::esc($keyword) . "%'
                    OR  t.reference LIKE '%" . DB::esc($keyword) . "%'
                    OR  ud.message LIKE '%" . DB::esc($keyword) . "%'
                    OR  us.username LIKE '%" . DB::esc($keyword) . "%'
                    OR  m.text LIKE '%" . DB::esc($keyword) . "%'
                    OR  s.name LIKE '%" . DB::esc($keyword) . "%'
                ORDER BY t.id ASC
                LIMIT 0,100");
        } else {
            return false;
        }

        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        return $data;
    }

    public function close()
    {
        $q = "
            UPDATE tickets
            SET status_id = 3, modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->id) . "
            ";
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }

    public function setOwner()
    {
        if (DB::esc($this->user_id) > 0) {
            $q = "UPDATE tickets
            SET user_id = " . DB::esc($this->user_id) . ", modified = '" . date('Y-m-d G:i:s') . "', status_id = 2
            WHERE id = " . DB::esc($this->id);
        } //unclaim
        elseif (($this->user_id) == -1) {
            $q = "UPDATE tickets
            SET user_id = '', modified = '" . date('Y-m-d G:i:s') . "', status_id = 1
            WHERE id = " . DB::esc($this->id);
        }

        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }

    public function becomeChild()
    {

        $q = "
            UPDATE tickets
            SET parent_id = " . DB::esc($this->parent_id) . ", modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->id);
        // ugly hack to get child tickets to work: parent ticket also has modified date
        $q2 = "
            UPDATE tickets
            SET modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->parent_id);

        $res = DB::query($q);
        $res2 = DB::query($q2);
        if (!$res AND !$res2) throw new Exception(DB::getMySQLiObject()->error);
    }


    public function becomeParent()
    {
        $q = "
            UPDATE tickets
            SET parent_id = NULL, modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->id);
        $q2 = "
            UPDATE tickets
            SET modified = '" . date('Y-m-d G:i:s') . "'
            WHERE id = " . DB::esc($this->parent_id);

        $res = DB::query($q);
        $res2 = DB::query($q2);

        if (!$res AND !$res2) throw new Exception(DB::getMySQLiObject()->error);
    }


    public function getOwner()
    {

        $q = "SELECT u.username AS wluser FROM tickets AS t LEFT OUTER JOIN users AS u ON t.user_id = u.id WHERE t.id = " . DB::esc($this->id);
        $results = DB::query($q);


        if (!$results)
            throw new Exception(DB::getMySQLiObject()->error);

        $output = null;
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        return $output;
    }


    public function setNotification()
    {
        $q = "UPDATE tickets SET updated = 1, modified = '" . date('Y-m-d G:i:s') . "' WHERE id = " . DB::esc($this->id) . "";
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }

    public function clearNotification()
    {
        $count_upd = 0;
        $q_upd = "select count(updated) from updates where ticket_id = " . DB::esc($this->id) . " AND updated=1";
        $res_upd = DB::query($q_upd);
        if ($res_upd) {
            $count_row_upd = mysqli_fetch_assoc($res_upd);
            $count_upd = $count_row_upd['count(updated)'];
        }

        $count_mes = 0;
        $q_mes = "select count(updated) from messages where ticket_id = " . DB::esc($this->id) . " AND updated=1";
        $res_mes = DB::query($q_mes);
        if ($res_mes) {
            $count_row_mes = mysqli_fetch_assoc($res_mes);
            $count_mes = $count_row_mes['count(updated)'];
        }

        if (($count_upd + $count_mes) == 0) {
            $q_clear = "UPDATE tickets SET updated = 0, modified = '" . date('Y-m-d G:i:s') . "' WHERE id = " . DB::esc($this->id) . "";
            $res = DB::query($q_clear);
            if (!$res) throw new Exception(DB::getMySQLiObject()->error);
        }
    }

}

?>
