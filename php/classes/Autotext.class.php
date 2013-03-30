<?php

class Autotext extends BLAMBase
{


    public function get()
    {

        $results = DB::query("SELECT id, text FROM autotext");
        while ($data[] = mysqli_fetch_assoc($results)) ;
        if (!is_null($data) && end($data) == null) array_pop($data);
        return $data;
    }


}

?>