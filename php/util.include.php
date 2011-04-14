<?php
	//gebruik: debug($var);
	function debug($var = false, $showHtml = false, $showFrom = true) {
		echo '<div class="debug">';
		if ($showFrom) {
			$calledFrom = debug_backtrace();
			echo '<strong>' . substr(str_replace(MY_PATH, '', $calledFrom[0]['file']), 1) . '</strong>';
			echo ' (line <strong>' . $calledFrom[0]['line'] . '</strong>)';
		}
		echo "\n<pre class=\"debug\">\n";

		$var = print_r($var, true);
		if ($showHtml) {
			$var = str_replace('<', '&lt;', str_replace('>', '&gt;', $var));
		}
		echo $var . "\n</pre>\n";
		echo '</div>';
	}
    
    //gebruik: logmsg($var);
    function logmsg($msg) {
        $myFile = "log.txt";
        $fh = fopen($myFile, 'a') or die("can't open file");
        $calledFrom = debug_backtrace();
        fwrite($fh, substr(str_replace(MY_PATH, '', $calledFrom[0]['file']), 1) . '[' . $calledFrom[0]['line'] . ']: ' . $msg . "\n");
        fclose($fh);
    }