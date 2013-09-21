<?php

require_once 'util.include.php';
require_once 'config.include.php';
require_once 'classes/DB.class.php';

$message = null;
if ($_FILES["file"]["error"] > 0) {
    $message = "Upload error: " . $_FILES["file"]["error"];
} else {
    DB::init($dbOptions);
    $row = 1;
    if (($handle = fopen($_FILES["file"]["tmp_name"], "r")) !== FALSE) {
        while (($data = fgetcsv($handle)) !== FALSE) {
            $num = count($data);
            $row++;
            if ($num == 3) {
                $q = "SELECT count(1) FROM groups WHERE name = '$data[0]'";
                $res = DB::query($q);
                $row = $res->fetch_assoc();
                if ($row['count(1)'] == 0) {
                    $q = "INSERT INTO groups (name) VALUES ('$data[0]')";
                    $res = DB::query($q);
                    $id = DB::getMySQLiObject()->insert_id;
                    $q = "INSERT INTO handles (handle_name, description, group_id) VALUES ('$data[2]', '$data[1]', $id)";
                    DB::query($q);
                } else {
                    $q = "SELECT id FROM groups WHERE name = '$data[0]'";
                    debug($q);
                    $res = DB::query($q);
                    $row = $res->fetch_assoc();
                    $q = "INSERT INTO handles (handle_name, description, group_id) VALUES ('$data[2]', '$data[1]', $row[id])";
                    debug($q);
                    DB::query($q);
                };
            }
        }
        fclose($handle);
    }
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>BLAM - Import</title>

    <link rel="stylesheet" type="text/css" href="css/import.css"/>
</head>

<body>
<h1>Lompe voertuigen-import tool</h1>
<?php if ($message) echo '<p id="message">' . $message . '</p>'; ?>
<p>Gebruik dit om de database te vullen met groepen en voertuigen uit een csv file.</p>

<p>Format van file: </p>
<pre>naam,roepnaam,groep</pre>
<form action="" method="post" enctype="multipart/form-data">
    <label for="file">Selecteer CSV file</label><input type="file" id="file" name="file"/>
    <input type="submit" value="Import" name="submit" id="import"/>
</form>
</body>
</html>
