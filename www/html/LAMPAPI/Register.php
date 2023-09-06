<?php
	$inData = getRequestInfo();

  	// this info is passed in by the user
	$firstName = $inData['FirstName'];
	$lastName = $inData['LastName'];
  	$login = $inData['Login'];
	$password = $inData['Password'];
  	$date = date('Y-m-d H:i:s');
 
	$conn = mysqli_connect("localhost", "AdminAccount", "wearetesting", "COP4331");
  
	if (!$conn)
	{
		die("Connection failed: " . mysqli_connect_error());
	}
 
	else
	{
		$checkLogin = $conn->prepare("SELECT * from Users WHERE Login = ?");
		$checkLogin->bind_param("s", $login);

		if($checkLogin->execute())
		{
       		$curr_user = mysqli_fetch_assoc(mysqli_stmt_get_result($checkLogin));
   		}
    

		if ($curr_user)
		{
			returnWithError("Login username already exists. Try again with a different login.");
		}
		else
		{
			// default date logged in will be date created (until user logs in again)
      
			$stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName,LastName,Login,Password) VALUES ('$date','$date','$firstName','$lastName','$login','$password')");
			if($stmt->execute()) 
			{
				returnWithError("");
     		}
		}
	}
 
  $stmt->close();
  $conn->close();
  

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
