<?php
  session_start();

  // this info is passed in by the user
  $firstName = $_POST['firstName'];
  $lastName = $_POST['lastName'];
  $login = $_POST['login'];
  $password = $_POST['password'];
  $date = date('Y-m-d H:i:s');

  $conn = mysqli_connect("localhost", "AdminAccount", "wearetesting", "COP4331");
  
  if (!$conn)
  {
	die("Connection failed: " . mysqli_connect_error());
	//header('Location: ../signup.html');
  }
 
  
  
  else
  {
	$checkLogin = $conn->prepare("SELECT * from Users WHERE Login = ?");
	$checkLogin->bind_param("s", $login);
	if($checkLogin->execute()) {
	$curr_user = mysqli_fetch_assoc(mysqli_stmt_get_result($checkLogin));
	}
	    
	
	if ($curr_user)
	{
		returnWithError("Login username already exists. Try again with a different login.");
		header('Location: ../signup.php?msg=1');
	}
	else
	{
		// default date logged in will be date created (until user logs in again)
		
		$stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName,LastName,Login,Password) VALUES ('$date','$date','$firstName','$lastName','$login','$password')");
		if($stmt->execute()) {
		header('Location: ../signup.php?msg=2');
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
