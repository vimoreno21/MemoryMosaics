<?php
	$inData = getRequestInfo();

    // this info is passed in by the user
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
    $login = $inData["Login"];
	$password = $inData["Password"];


	$conn = new mysqli("localhost", "AdminAccount", "wearetesting", "COP4331");

	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$checkLogin = $conn->prepare("SELECT count(1) from Users WHERE Login = ?");

		$checkLogin->bind_param("s", $login);
		$checkLogin->execute();
		$checkLogin->bind_result($foundResult);
		$checkLogin->fetch();
		$checkLogin->close();

		if ($foundResult)
		{
			returnWithError("Login username already exists. Try again with a different login.");
		}
		else
		{
			// default date logged in will be date created (until user logs in again)
			$stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName,LastName,Login,Password) VALUES(now(),now(),'$firstName','$lastName','$login','$password')");
			$stmt->execute();
			returnWithError("");
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
