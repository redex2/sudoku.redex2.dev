<?php
if (!isset($_GET['b']) || !isset($_GET['s'])) {
	header("404", true, 404);
	exit;
}
if (!preg_match("/^[0-9]{81}$/", $_GET['b']) || !preg_match("/^[0-9]{81}$/", $_GET['s'])) {
	header("404", true, 404);
	exit;
}

$board = $_GET['b'];
$solved = $_GET['s'];

$db = new SQLite3(".db/sudoku.db", SQLITE3_OPEN_READONLY);
$out = $db->query("SELECT solve FROM boards WHERE board = '$board';");
$solvedFromDb = $out->fetchArray();

if ($solvedFromDb == false)
	exit;

if ($solvedFromDb[0] == $solved)
	echo "1";
else
	echo "0";

?>