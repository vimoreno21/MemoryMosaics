<?php
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type');


        $inData = getRequestInfo();

        $conn = mysqli_connect("localhost", "AdminAccount", "wearetesting", "COP4331");
        if (!$conn)
        {
                die("Connection failed: " . mysqli_connect_error());
        }

        $stmt = $conn->prepare("DELETE from Contacts WHERE ID = ?;");
        $stmt->bind_param("s", $inData["ID"]);

        $stmt->execute();



        if ($stmt != NULL)
        {
                returnWithInfo("Deletion was successful.");
                $stmt->close();
        }
        else
        {
                returnWithInfo("Deletion operation failed.");
        }
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
                $retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $result )
        {
                $retValue = '{"result":"' . $result . '"}';
                sendResultInfoAsJson( $retValue );
        }
 ?>
