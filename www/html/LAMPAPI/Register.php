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
    // default date logged in will be date created (until user logs in again)
		$stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName,LastName,Login,Password) VALUES(now(),now(),'$firstName','$lastName','$login','$password')");

		$stmt->execute();

		$stmt->close();
		$conn->close();
		returnWithError("");
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
