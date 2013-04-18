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
    public function getList($handled)
    {
        if ($handled == "true") {
            $q = "SELECT id, sender_nr, sender_name, received_at, message FROM sms WHERE handeld_at IS NOT NULL";
        } else {
            $q = "SELECT id, sender_nr, sender_name, received_at, message FROM sms WHERE handeld_at IS NULL";
        }
        $output[] = array('timestamp' => date('Y-m-d G:i:s'));

        $results = DB::query($q);
        if ($results) while ($output[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($output) && end($output) == null) array_pop($output);

        return $output;
    }

    //getDetail

    //handleSMS

}

?>