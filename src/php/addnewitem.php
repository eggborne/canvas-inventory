<?php
	include("config.php");
	$postData = json_decode(file_get_contents("php://input"), TRUE);
	if (!$postData) {
		echo 'no post data';
		mysqli_close($link);
	}
	$location = $postData['location'];
	$origin = $postData['origin'];
	$height = $postData['height'];
	$width = $postData['width'];
	$depth = $postData['depth'];
	$packaging = $postData['packaging'];
	$notes = $postData['notes'];
	$addItemSql = "INSERT INTO `inventory` (`location`, `origin`, `height`, `width`, `depth`, `packaging`, `notes`) VALUES ( '$location' '$origin' '$height' '$width' '$depth' '$packaging' '$notes' );";
	$result = mysqli_query($link, $addItemSql);

	if ($result) {
		echo 'Saved new canvas!';
	} else {
		echo 'Failed to save new canvas.';
	}	
	mysqli_close($link);
?>
