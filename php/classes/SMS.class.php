<?php

/* Ticket is used for the log entries */

class SMS extends BLAMBase
{

    public $id          = '';
    public $sender_nr   = '';
    public $sender_name = '';
    public $received_at = '';
    public $message     = '';
    public $handled_by  = '';
    public $handled_at  = '';

    //getOpen/getHandled
    public function getList($type = 'all', $called = null, $first_id = null, $timestamp_last_update = null, $limit_paging)
    {
        $q = "SELECT * FROM (
        		SELECT u.id AS id, u.ticket_id, u.type, t.title, u.called, u.created, u.modified
            FROM updates AS u
            INNER JOIN tickets AS t ON t.id = u.ticket_id";

        // retrieve previous updates
        if (is_numeric($first_id)) {
            $q .= " WHERE u.id < $first_id";

            // if specific type is wanted, add this to query
            if (is_string($type) && $type == 'update') {
                $q .= " AND u.type = 'update'";
            }

            if (is_string($type) && $type == 'feedback') {
                $q .= " AND u.type = 'feedback'";
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
            $q .= " ORDER BY u.id DESC LIMIT $limit_paging) t";
            $q .= " ORDER BY id ASC";

        } //retrieve updates about updates
        elseif (strtotime($timestamp_last_update)) {
            if (isset($called) && $called == 'true') {
                $q .= " WHERE u.modified > '$timestamp_last_update'";
            }
            elseif (isset($called) && $called == 'false') {
                $q .= " WHERE u.created > '$timestamp_last_update'";
            }
            else {
                $q .= " WHERE ((u.modified IS NULL AND u.created > '$timestamp_last_update') OR (u.modified > '$timestamp_last_update'))";
            }
            // if specific type is wanted, add this to query
            if (is_string($type) && $type == 'update') {
                $q .= " AND u.type = 'update'";
            }

            if (is_string($type) && $type == 'feedback') {
                $q .= " AND u.type = 'feedback'";
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
            $q .= " ORDER BY u.id DESC LIMIT $limit_paging) t";
            $q .= " ORDER BY id ASC";
        } // first retrieval of updates
        elseif (empty($timestamp_last_update)) {
            //this is a dummy WHERE statement
            $q .= " WHERE u.id > 0";

            // if specific type is wanted, add this to query
            if (is_string($type) && $type == 'update') {
                $q .= " AND u.type = 'update'";
            }

            if (is_string($type) && $type == 'feedback') {
                $q .= " AND u.type = 'feedback'";
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
            $q .= " ORDER BY u.id DESC LIMIT $limit_paging) t";
            $q .= " ORDER BY id ASC";
        } else {
            throw new Exception('invalid parameters for getUpdateList');
        }

        $output[] = array('timestamp' => date('Y-m-d G:i:s'), 'limit' => 'true');

        $results = DB::query($q);
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        if ($limit_paging && count($output) < ($limit_paging + 1)) $output[0]['limit'] = 'false';
        $output[0]['query'] = $q;

        return $output;
    }

    //getDetail

    //handleSMS

}

?>