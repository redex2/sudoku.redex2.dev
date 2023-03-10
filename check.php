<?php
if (!isset($_GET['b']) || !isset($_GET['s']))
	header("404", true, 404);
if (!preg_match("/^[0-9]{81}$/", $_GET['b']) || !preg_match("/^[0-9]{81}$/", $_GET['s']))
	header("404", true, 404);

echo 1;
?>