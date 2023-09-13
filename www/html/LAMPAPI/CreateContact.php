<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Headers: Content-Type');


	$inData = getRequestInfo();
 
  //TODO: CHANGE QUERIES TO THE CORRECT CHANGE CONTACT QUERIES
 
  	// this info is passed in by the user
	$firstName = $inData['FirstName'];
	$lastName = $inData['LastName'];
  $email = $inData['Email'];
  $phoneNumber = $inData['Phone'];
	$date = date('Y-m-d H:i:s');


	$conn = mysqli_connect("localhost", "AdminAccount", "wearetesting", "COP4331");
	if (!$conn)
	{
		die("Connection failed: " . mysqli_connect_error());
	}

	else
	{
    //get the date last logged in of the current user
    $curr_ID = $_SESSION['user_id'];
    $lastLogged = $conn->prepare("SELECT * from Users WHERE ID = ?");
		$lastLogged->bind_param("i", $curr_ID);
    $currLastLogged = "";
    
		if($lastLogged->execute())
		{
        $curr_user = mysqli_fetch_assoc(mysqli_stmt_get_result($lastLogged));
        $currLastLogged = $curr_user['DateLastLoggedIn']
		}

    //insert contact
		$stmt = $conn->prepare("INSERT into Contacts (DateCreated, DateLastLoggedIn, FirstName,LastName,Phone,Email,UserID) VALUES ('$date','$currLastLogged','$firstName','$lastName','$email','$phoneNumber','$curr_ID')");
    if($stmt->execute()) 
    {
        returnWithError("");
    }
		else
		{
			returnWithError("Unable to insert");
		}

		$lastLogged->close();
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
		$retValue = '{"returnID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"returnID":100,"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
