<?php

$idir = "../img/";
$tdir = "../img/";   // Path To Thumbnails Directory 
$twidth = "50";   // Maximum Width For Thumbnail Images 
$theight = "50";   // Maximum Height For Thumbnail Images

require_once "config.include.php";
require_once "util.include.php";

require_once "classes/DB.class.php";
require_once "classes/RVDLogBase.class.php";
require_once "classes/RVDLog.class.php";
require_once "classes/User.class.php";

session_name('RVDLog');
session_start();

DB::init($dbOptions);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>RVD log Index</title>

        <link rel="stylesheet" type="text/css" href="css/rvdlog.css" />
        <link rel="stylesheet" type="text/css" href="css/chat.css" />
    </head>

    <body>
<?php

try {
    RVDLog::checkLogged();

    if ($_GET['action'] == 'new') {
        if (!$_SESSION['user']['role_id'] == 3) die ("niet genoeg rechten");
        if (!empty($_POST['username']) && $_POST['password1'] == $_POST['password2'] ) {
            $usr = new User(array(
                    'username' => $_POST['username'],
                    'password' => $_POST['password1'],
                    'role' => $_POST['role']
                ));
            $id = $usr->create();

            $msg = "Gebruiker met success gemaakt!";
        } else {
            $msg = "geen naam of passwords matchen niet";
        }
    } elseif ($_GET['action'] == 'delete') {
        if (!$_SESSION['user']['role_id'] == 3) die ("niet genoeg rechten");
        if (is_numeric($_GET['id'])) {
            $usr = new User(array(
                    'id' => $_GET['id']
                ));
            $id = $usr->delete();

            $msg = "Gebruiker met success weggewerkt!";
        } else {
            $msg = "id niet numeriek";
        }
    }  elseif ($_GET['action'] == 'changepw') {
        if ($_POST['password1'] == $_POST['password2']) {
            $user = new User(array(
                    'id' => $_SESSION['user']['id'],
                    'password' =>  $_POST['password'],
                    'newpw' => $_POST['password1']
                ));
            $res = $user->changepw();

            if ($res) {
             $msg = 'Password gewijzigd!';
            }
            else {
              $msg = 'Error bij password wijzigen.';
            }
        } else {
            $msg = 'error';
        }
    }  elseif ($_GET['action'] == 'photo') {
            $url = $_FILES['photo']['name'];   // Set $url To Equal The Filename For Later Use 
            if ($_FILES['photo']['type'] == "image/jpg" || $_FILES['photo']['type'] == "image/jpeg" || $_FILES['photo']['type'] == "image/pjpeg") { 
                $file_ext = strrchr($_FILES['photo']['name'], '.');   // Get The File Extention In The Format Of , For Instance, .jpg, .gif or .php 
                print 'Image uploaded successfully.<br />';   // Was Able To Successfully Upload Image 
                $simg = imagecreatefromjpeg($_FILES['photo']['tmp_name']);   // Make A New Temporary Image To Create The Thumbanil From 
                $currwidth = imagesx($simg);   // Current Image Width 
                $currheight = imagesy($simg);   // Current Image Height 
                if ($currheight > $currwidth) {   // If Height Is Greater Than Width 
                 $zoom = $twidth / $currheight;   // Length Ratio For Width 
                 $newheight = $theight;   // Height Is Equal To Max Height 
                 $newwidth = $currwidth * $zoom;   // Creates The New Width 
                } else {    // Otherwise, Assume Width Is Greater Than Height (Will Produce Same Result If Width Is Equal To Height) 
                $zoom = $twidth / $currwidth;   // Length Ratio For Height 
                $newwidth = $twidth;   // Width Is Equal To Max Width 
                $newheight = $currheight * $zoom;   // Creates The New Height 
                } 
                $dimg = imagecreate($newwidth, $newheight);   // Make New Image For Thumbnail 
                imagetruecolortopalette($simg, false, 256);   // Create New Color Pallete 
                $palsize = ImageColorsTotal($simg); 
                for ($i = 0; $i < $palsize; $i++) {   // Counting Colors In The Image 
                $colors = ImageColorsForIndex($simg, $i);   // Number Of Colors Used 
                ImageColorAllocate($dimg, $colors['red'], $colors['green'], $colors['blue']);   // Tell The Server What Colors This Image Will Use 
                } 
                imagecopyresized($dimg, $simg, 0, 0, 0, 0, $newwidth, $newheight, $currwidth, $currheight);   // Copy Resized Image To The New Image (So We Can Save It) 
                imagejpeg($dimg, "$tdir" . $_SESSION['user']['username'] . '.jpg');   // Saving The Image 
                imagedestroy($simg);   // Destroying The Temporary Image 
                imagedestroy($dimg);   // Destroying The Other Temporary Image 
                print 'Image thumbnail created successfully.';   // Resize successful
                
                $user = new User(array('id' => $_SESSION['user']['id'], 'avatar' => $_SESSION['user']['username'] . '.jpg'));
                $user->setAvatar();
        }
    }
    ?>
        <div id="chatContainer">
            <div id="errorbox"><?php if (isset($msg) ) echo $msg; ?></div>
            <div id="ManageUsersContainer">
                <p>Maak nieuwe user:</p>
                <form id="newuserform" name="test" method="post" action="usermgr.php?action=new">
                    <label for="username">Username: </label><input type="text" id="username" name="username" />
                    <label for="password2">Pw2: </label><input type="password" id="password1" name="password1" />
                    <label for="password1">pw1: </label><input type="password" id="password2" name="password2" />
                    <label for="role">rol: </label>
                    <select name="role">
                        <option value="1">RVD</option>
                        <option value="2">WL</option>
                        <option value="3">Admin</option>
                    </select>
                    <input type="submit" value="Maak" />
                </form>
                <p>Delete user:</p>
                <table>
                <tr><td>Naam</td><td>Verwijder</td></tr>
                <?php
                    $users = new User(array());
                    foreach ($users->get('all') as $user) {
                        echo "<tr><td>$user[username]</td><td><a href=\"usermgr.php?action=delete&id=$user[id]\">klik</a></td></tr>";
                    }
                ?>
                </table>
            </div>
            <div id="ChangePasswordContainer">
                <p>verander huidig wachtwoord:</p>
                <form id="newpassword" method="post" action="usermgr.php?action=changepw">
                    <label for="username">huidig password: </label><input type="password" id="currentpassword" name="password" />
                    <label for="password2">Pw2: </label><input type="password" id="password1" name="password1" />
                    <label for="password1">pw1: </label><input type="password" id="password2" name="password2" />
                    <input type="submit" value="Verander" />
                </form>
                <p>Upload nieuwe foto:</p>
                <form id="newphoto" method="post" action="usermgr.php?action=photo" enctype="multipart/form-data">
                    <label for="photo">Foto: </label><input type="file" id="photo" name="photo" />
                    <input type="submit" value="Upload" />
                </form>
            </div>
        </div>
    </body>
</html>
<?php
} catch (Exception $e) {
    die("Niet ingelogd");
}
?>
