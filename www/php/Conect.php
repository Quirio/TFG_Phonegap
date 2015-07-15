<?php

header('Content-type: application/json');

$server = "qtm839.dentef.com";
$username = "qtm839";
$password = "Sar159753";
$database = "qtm839";

$con = mysql_connect($server, $username, $password) or die ("Could not connect: " . mysql_error());
mysql_select_db($database, $con);

?>