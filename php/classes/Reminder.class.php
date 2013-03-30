<?php

class Reminder extends BLAMBase
{

    public $id = '';

    public function get($day)
    {
        if (is_string($day)) {
            $q = "SELECT r.id AS id, u.username AS user1, v.username AS user2, w.name AS grp, title, text, completed, begin, end, created, modified
       FROM reminders AS r 
       LEFT OUTER JOIN users AS u ON r.user_id = u.id
       LEFT OUTER JOIN users AS v ON r.backup_user_id = v.id
       LEFT OUTER JOIN roles AS w ON r.group_id = w.id
       WHERE r.begin >= DATE('" . DB::esc($day) . "') AND r.begin <=DATE('" . DB::esc($day) . "' + interval 1 DAY)";

            $results = DB::query($q);
        } else {
            throw new Exception('unknown option');
        }

        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        return $data;

    }

    public function getDetails()
    {
        $q = "SELECT r.id AS id, u.username AS user1, v.username AS user2, w.name AS grp, title, text, completed, begin, end, created, modified
       FROM reminders AS r 
       LEFT OUTER JOIN users AS u ON r.user_id = u.id
       LEFT OUTER JOIN users AS v ON r.backup_user_id = v.id
       LEFT OUTER JOIN roles AS w ON r.group_id = w.id
            WHERE r.id = " . DB::esc($this->id);

        $results = DB::query($q);

        if (!$results)
            throw new Exception(DB::getMySQLiObject()->error);

        $output = null;
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        return $output;
    }
}

?>