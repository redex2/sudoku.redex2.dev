<!DOCTYPE HTML>
<html>

<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<title>Sudoku game - Redex2's website</title>
	<meta name="robots" content="index,follow,noarchive" />
	<meta name="description" content="sudoku game site">
	<link rel="stylesheet" type="text/css" href="https://sudoku.redex2.dev/style.css">
	<script>
		<?php
		try {
			$db = new SQLite3(".db/sudoku.db", SQLITE3_OPEN_READONLY);
			$out = $db->query("SELECT board FROM boards ORDER BY RANDOM() LIMIT 1;");
			$board = $out->fetchArray();
			if ($board != false)
				echo "let fromDBboard = '$board[0]';";
		} catch (Exception) {
		}
		?>
	</script>
</head>

<body>
	<div style="display:none;" id="modal_container">
		<div id="modal_content">
		</div>
	</div>
	<header>
		<h1>Sudoku game</h1>
		<h2><a href="https://redex2.dev">Main page - redex2.dev</a></h2>
	</header>
	<main>
		<canvas id="canvas"></canvas>
	</main>
	<script type="text/javascript" src="https://sudoku.redex2.dev/script.js"></script>
</body>

</html>