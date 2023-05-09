<?php
function error()
{
    header("HTTP/1.0 404 Not Found");
    require("error.html");
    exit(0);
}

if (
    isset($_SERVER['HTTP_REFERER']) &&
    isset($_SERVER['REQUEST_METHOD']) &&
    isset($_SERVER['REQUEST_URI']) &&
    $_SERVER['HTTP_REFERER'] === "https://sudoku.redex2.dev/" &&
    $_SERVER['REQUEST_METHOD'] === "GET" &&
    $_SERVER['REQUEST_URI'] === "/get.php"
) {

    try {
        $db = new SQLite3(".db/sudoku.db", SQLITE3_OPEN_READONLY);
        $out = $db->query("SELECT puzzle FROM sudoku ORDER BY RANDOM() LIMIT 1;");
        $puzzle = $out->fetchArray();
        if ($puzzle != false)
            echo $puzzle[0];
        else
            error();
    } catch (Exception) {
        error();
    }
} else {
    error();
}
?>