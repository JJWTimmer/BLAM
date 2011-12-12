<?php

require_once 'util.include.php';
require_once 'config.include.php';
require_once 'classes/DB.class.php';
require_once "classes/BLAM.class.php";
require_once "classes/BLAMBase.class.php";
require_once "classes/User.class.php";

session_name('BLAM');
session_start();

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>RVD log - Archief</title>
        <link rel="stylesheet" type="text/css" href="css/archief.css" />
  </head>

  <body>
    <h1>Archief</h1>
    <table><tr><td><a href="../php/archief.php?action=messages" target="_self" >Meldingen</a></td><td><a href="../php/archief.php?action=tickets" target="_self" >Tickets</a></td></tr></table>
    <?php
    try {
    DB::init($dbOptions);

    switch($_GET['action']){

    case 'messages':
      BLAM::checkLogged();
      $q = "select msg.id, msg.text, msg.ticket_id, msg.created, users.username from messages AS msg INNER JOIN users ON msg.user_id = users.id ORDER BY msg.id ASC";
      $res = DB::query($q);
      echo '<table border="1">';
      echo '<tr><th>id</th><th>timestamp</th><th>operator</th><th>text</th><th>ticketnr</th></tr>';
      while ($data = mysqli_fetch_assoc($res)) {
      echo '<tr><td>'.$data['id'].'</td><td>'.$data['created'].'</td><td>'.$data['username'].'</td><td>'.$data['text'].'</td><td>'.$data['ticket_id'].'</td></tr>';
      //echo '<p id="message">'.$data['text'].'</p>';
      }
      echo '</table>';
    break;

    case 'tickets':
      BLAM::checkLogged();
      $q = "
            SELECT t.id AS id, t.title, t.handle_id, t.location, t.reference, t.text, t.solution, u.username AS wluser, t.created, t.modified, h.description AS voertuignaam
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN handles AS h ON t.handle_id = h.id
            WHERE t.parent_id IS NULL
            ORDER BY t.id ASC
            ";
      $res = DB::query($q);
      echo '<table border="1">';
      echo '<tr><th>id</th><th>timestamp</th><th>wl_user</th><th>titel</th><th>voertuig</th><th>referentie</th><th>locatie</th></tr>';
      while ($data = mysqli_fetch_assoc($res)) {
      echo '<tr><td>'.$data['id'].'</td><td>'.$data['created'].'</td><td>'.$data['wluser'].'</td><td>'.$data['title'].'</td><td>'.$data['voertuignaam'].'</td><td>'.$data['reference'].'</td><td>'.$data['location'].'</td></tr>';
      echo '<tr><td>'.$data['id'].'</td><td>'.$data['created'].'</td><td>Bericht</td><td colspan="4">'.$data['text'].'</td></tr>';
      $q2 = "
                SELECT u.id, u.ticket_id, u.type, u.message, u.called, u.called_by, u.created
                FROM updates AS u
                WHERE u.ticket_id = " . $data['id']
                ." LIMIT 0,100";
      $res2 = DB::query($q2);
      while ($update = mysqli_fetch_assoc($res2)) {
      echo '<tr><td>'.$data['id'].'</td><td>'.$update['created'].'</td><td>'.$update['type'].'</td><td colspan="4">'.$update['message'].'</td></tr>';
      }
      echo '<tr><td>'.$data['id'].'</td><td>'.$data['modified'].'</td><td>Oplossing</td><td colspan="4">'.$data['solution'].'</td></tr>';
      $q3 = "
            SELECT t.id AS id, t.title, t.handle_id, t.location, t.reference, t.text, t.solution, u.username AS wluser, t.created, t.modified, h.description AS voertuignaam
            FROM tickets AS t
            LEFT OUTER JOIN users AS u ON t.user_id = u.id
            LEFT OUTER JOIN messages AS m ON t.message_id = m.id
            LEFT OUTER JOIN handles AS h ON t.handle_id = h.id
            WHERE t.parent_id = ".$data['id']." ORDER BY t.id ASC";
      $res3 = DB::query($q3);
      $index=0;
      while ($subticket = mysqli_fetch_assoc($res3)) {
      if($index==0){
      echo '<tr><td colspan="7"><b>subtickets:</b></td></tr>';
      }
      $index+=1;
      echo '<tr><td>'.$subticket['id'].'</td><td>'.$subticket['created'].'</td><td>'.$subticket['wluser'].'</td><td>'.$subticket['title'].'</td><td>'.$subticket['voertuignaam'].'</td><td>'.$subticket['reference'].'</td><td>'.$subticket['location'].'</td></tr>';
      echo '<tr><td>'.$subticket['id'].'</td><td>'.$subticket['created'].'</td><td>Bericht</td><td colspan="4">'.$subticket['text'].'</td></tr>';
      echo '<tr><td>'.$subticket['id'].'</td><td>'.$subticket['modified'].'</td><td>Oplossing</td><td colspan="4">'.$subticket['solution'].'</td></tr>';
      }
      echo '<tr><td colspan="7"><BR></td></tr>';
      //echo '<p id="message">'.$data['text'].'</p>';
      }
      echo '</table>';
    break;

    default:
      echo ('<p>Selecteer Meldingen of Tickets</p>');
    }
  }
  catch(Exception $e){
  die('<p>'.$e.'</p>');
}


    ?>
  </body>
</html>