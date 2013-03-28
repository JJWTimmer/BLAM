<?php
    require_once '../php/config.include.php';
        require_once 'preheader.php';
        require_once 'ajaxCRUD.class.php';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="generator" content="HTML Tidy for Windows (vers 14 February 2006), see www.w3.org" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>
      RVD log - Ajax test
    </title><!-- jQuery css first, so we can override later -->
    <link rel="stylesheet" type="text/css" href="../css/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="../css/jquery.jscrollpane.css" /><!-- second the general css -->
    <link rel="stylesheet" type="text/css" href="../css/blam.css" /><!-- last the page specific css -->
    <link rel="stylesheet" type="text/css" href="../css/crud.css" /><!-- first all the libraries, jquery first is needed for the rest -->

    <script type="text/javascript" src="../js/jquery.js">
</script>
    <script type="text/javascript" src="../js/jquery-ui.js">
</script>
    <script type="text/javascript" src="../js/jquery.jscrollpane.min.js">
</script>
    <script type="text/javascript" src="../js/jquery.mousewheel.js">
</script>
    <script type="text/javascript" src="../js/mwheelIntent.js">
</script><!-- general javascript -->

    <script type="text/javascript" src="../js/blam.js">
</script><!-- page specific javascript -->

    <script type="text/javascript" src="../js/crud.js">
</script>

<?php 
        $chatlines = new ajaxCRUD("chatlines", "chatlines", "id");
        $chatlines->setLimit(10);

        $updates = new ajaxCRUD("updates", "updates", "id");
        $updates->setLimit(10);

        $groups = new ajaxCRUD("groups", "groups", "id");
        $groups->setLimit(10);

        $handles = new ajaxCRUD("handles", "handles", "id");
        $handles->setLimit(10);

        $messages = new ajaxCRUD("messages", "messages", "id");
        $messages->setLimit(10);

        $roles = new ajaxCRUD("roles", "roles", "id");
        $roles->setLimit(10);

        $statuses = new ajaxCRUD("statuses", "statuses", "id");
        $statuses->setLimit(10);

        $tickets = new ajaxCRUD("tickets", "tickets", "id");
        $tickets->setLimit(10);

        $users = new ajaxCRUD("users", "users", "id");
        $users->setLimit(10);        
?>

  </head>
  <body>
    <div id="TopContainer" class="rounded"></div>
    <div id="MainContainer">
      <span id="select-table">
          <select id="table-selector">
            <option value="#chatlines-div">chatlines</option>
            <option value="#updates-div">updates</option>
            <option value="#groups-div">groups</option>
            <option value="#handles-div">handles</option>
            <option value="#messages-div">messages</option>
            <option value="#roles-div">roles</option>
            <option value="#statuses-div">statuses</option>
            <option value="#tickets-div">tickets</option>
            <option value="#users-div">users</option>
          </select>
      </span>
      <div id="chatlines-div" class="table-div">
          <?php
            $chatlines->showTable();
          ?>
      </div>
      <div id="updates-div" class="table-div">
      <?php
        $updates->showTable();
      ?>
      </div>
      <div id="groups-div" class="table-div">
      <?php
        $groups->showTable();
      ?>
      </div>
      <div id="handles-div" class="table-div">
          <?php
            $handles->showTable();
          ?>
      </div>
      <div id="messages-div" class="table-div">
      <?php
        $messages->showTable();
      ?>
      </div>
      <div id="roles-div" class="table-div">
      <?php
        $roles->showTable();
      ?>
      </div>
      <div id="statuses-div" class="table-div">
          <?php
            $statuses->showTable();
          ?>
      </div>
      <div id="tickets-div" class="table-div">
      <?php
        $tickets->showTable();
      ?>
      </div>
      <div id="users-div" class="table-div">
      <?php
        $users->showTable();
      ?>
      </div>
    </div>
    <div id="Login" align="center">
      <div id="LoginWindow" class="rounded">
        <h1 align="center">
          Login RVDLog
        </h1><br />
        <form id="loginForm" method="post" action="" name="loginForm">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="center">
                <input id="name" name="username" class="rounded" maxlength="16" />
              </td>
            </tr>
            <tr>
              <td align="center">
                <input id="password" name="password" class="rounded" maxlength="16" />
              </td>
            </tr>
            <tr>
              <td align="center">
                <input type="submit" class="blueButton" value="Login" />
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
  </body>
</html>
