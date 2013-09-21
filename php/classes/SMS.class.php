<?php

/* Ticket is used for the log entries */

class SMS extends BLAMBase
{

    public $id = '';
    public $sender_nr = '';
    public $sender_name = '';
    public $received_at = '';
    public $message = '';
    public $handled_by = '';
    public $handled_at = '';

    //getOpen/getHandled
    public function getList($handled = null, $first_id = null, $timestamp_last_update = null, $limit_paging = null)
    {
        $q = "SELECT * FROM (SELECT sms.id, sender_nr, sender_name, received_at, handled_at FROM sms";

        // retrieve previous updates
        if (is_numeric($first_id)) {
            $q .= " WHERE sms.id < $first_id";

            //if handled is set, add this to query
            if (isset($handled)) {
                switch ($handled) {
                    case 'false':
                        $q .= " AND sms.handled_at IS NULL ";
                        break;
                    case 'true':
                        $q .= " AND sms.handled_at IS NOT NULL ";
                        break;
                    default:
                        // select all
                        break;
                }
            }

            //limit and re-order the search results for paging functionality
            if (is_null($limit_paging)) {
                //$q .= " ORDER BY id ASC";
                $q .= " ORDER BY id DESC) t";
                $q .= " ORDER BY id ASC";
            } elseif (!is_null($limit_paging) && is_numeric($limit_paging)) {
                //$q .= " ORDER BY id ASC LIMIT $limit_paging";
                $q .= " ORDER BY id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                throw new Exception("limit_paging must be numeric");
            }


        } //retrieve updates about updates
        elseif (strtotime($timestamp_last_update)) {
            if (isset($handled) && $handled == 'true') {
                $q .= " WHERE sms.handled_at > '$timestamp_last_update'";
            } elseif (isset($handled) && $handled == 'false') {
                $q .= " WHERE sms.received_at > '$timestamp_last_update'";
            }

            //limit and re-order the search results for paging functionality
            if (is_null($limit_paging)) {
                //$q .= " ORDER BY id ASC";
                $q .= " ORDER BY id DESC) t";
                $q .= " ORDER BY id ASC";
            } elseif (!is_null($limit_paging) && is_numeric($limit_paging)) {
                //$q .= " ORDER BY id ASC LIMIT $limit_paging";
                $q .= " ORDER BY id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                throw new Exception("limit_paging must be numeric");
            }

        } // first retrieval of updates

        elseif (empty($timestamp_last_update)) {
            //this is a dummy WHERE statement
            $q .= " WHERE sms.id > 0";

            //if handled is set, add this to query
            if (isset($handled)) {
                switch ($handled) {
                    case 'false':
                        $q .= " AND sms.handled_at IS NULL ";
                        break;
                    case 'true':
                        $q .= " AND sms.handled_at IS NOT NULL ";
                        break;
                    default:
                        // select all
                        break;
                }
            }
            //limit and re-order the search results for paging functionality
            if (is_null($limit_paging)) {
                //$q .= " ORDER BY id ASC";
                $q .= " ORDER BY id DESC) t";
                $q .= " ORDER BY id ASC";
            } elseif (!is_null($limit_paging) && is_numeric($limit_paging)) {
                //$q .= " ORDER BY id ASC LIMIT $limit_paging";
                $q .= " ORDER BY id DESC LIMIT $limit_paging) t";
                $q .= " ORDER BY id ASC";
            } else {
                throw new Exception("limit_paging must be numeric");
            }
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
    public function get()
    {
        $q = "SELECT sms.id, sender_nr, sender_name, received_at, message, handled_at, users.username AS handled_by
              FROM sms LEFT OUTER JOIN users on sms.handled_by = users.id WHERE sms.id = " . DB::esc($this->id);

        $output[] = array('timestamp' => date('Y-m-d G:i:s'));

        $results = DB::query($q);
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        return $output;
    }

    //handleSMS
    public function handle()
    {
        $q = "UPDATE sms SET handled_at = NOW(), handled_by = " . DB::esc($this->handled_by) . " WHERE id = " . DB::esc($this->id);
        $res = DB::query($q);
        if (!$res) throw new Exception(DB::getMySQLiObject()->error);
    }
}

?>
