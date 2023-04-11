<?php
if (!isset($_GET['b']) || !isset($_GET['s'])) {
	header("404", true, 404);
	exit;
}
if (!preg_match("/^[0-9]{81}$/", $_GET['b']) || !preg_match("/^[0-9]{81}$/", $_GET['s'])) {
	header("404", true, 404);
	exit;
}

$puzzle = $_GET['p'];

$db = new SQLite3(".db/sudoku.db", SQLITE3_OPEN_READONLY);
$out = $db->query("SELECT solution FROM sudoku WHERE puzzle = '$puzzle';");
$solution = $out->fetchArray();

if ($solution == false)
	exit;

if ($solution[0] == $_GET['s'])
	echo "1";
else
	echo "0";

?>