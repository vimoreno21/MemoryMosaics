<?php
	header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json; charset=UTF-8');
  header('Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE');
  header('Access-Control-Allow-Headers: Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With');

  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit();
  }


	$inData = getRequestInfo();
 
 
  $curr_ID = $inData['UserID'];
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
    $lastLogged = $conn->prepare("SELECT * from Users WHERE ID = ?");
		$lastLogged->bind_param("i", $curr_ID);
    $currLastLogged = "";
    
		if($lastLogged->execute())
		{
        $curr_user = mysqli_fetch_assoc(mysqli_stmt_get_result($lastLogged));
        $currLastLogged = $curr_user['DateLastLoggedIn'];
		}

		$stmt = $conn->prepare("INSERT into Contacts (DateCreated, DateLastLoggedIn, FirstName,LastName,Phone,Email,UserID) VALUES ('$date','$currLastLogged','$firstName','$lastName','$phoneNumber','$email','$curr_ID')");
    if($stmt->execute()) 
    {
        returnWithInfo($firstName, $lastName, "Success!");
    }
		else
		{
			returnWithError("Please fill out all fields!");
		}

		if($lastLogged != NULL){$lastLogged->close();}
		if($conn != NULL){$conn->close();}
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
