<?php

/* Message is used for the log entries */

class Handle extends BLAMBase
{

    public $id = '';
    public $handle_number = '';
    public $handle_name = '';
    public $description = '';
    public $gps_status = '';

    public function get($group = null)
    {
        if (is_null($group)) {
            $results = DB::query("
                SELECT id, handle_number, handle_name, description, gps_status
                FROM handles
                ORDER BY handle_name ASC
                ");
        } elseif (is_numeric($group)) {
            $group_id = DB::esc($group);

            $results = DB::query("
                SELECT id, handle_number, handle_name, description, gps_status
                FROM handles
                WHERE group_id = $group_id
                ORDER BY handle_name ASC
                ");
        } else {
            return false;
        }

        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        return $data;
    }
}

?>