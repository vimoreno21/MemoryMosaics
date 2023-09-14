
<?php

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type');
        $inData = getRequestInfo();


        $conn = new mysqli("localhost", "AdminAccount", "wearetesting", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }

        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ? WHERE ID = ?;");
        $stmt->bind_param("ss", $inData["NewFirstName"], $inData["ID"]);

        $stmt2 = $conn->prepare("UPDATE Contacts SET LastName = ? WHERE ID = ?;");
        $stmt2->bind_param("ss", $inData["NewLastName"], $inData["ID"]);

        $stmt3 = $conn->prepare("UPDATE Contacts SET Phone = ? WHERE ID = ?;");
        $stmt3->bind_param("ss", $inData["NewPhone"], $inData["ID"]);

        $stmt4 = $conn->prepare("UPDATE Contacts SET Email = ? WHERE ID = ?;");
        $stmt4->bind_param("ss", $inData["NewEmail"], $inData["ID"]);

        $stmt->execute();
        $stmt2->execute();
        $stmt3->execute();
        $stmt4->execute();

        if ($stmt == NULL || $stmt2 == NULL || $stmt3 == NULL || $stmt4 == NULL)
        {
                returnWithInfo( "Update operation failed");
        }
        else
        {
                returnWithInfo("Update success!");
        }

        if ($stmt2 != NULL)
        {
                $stmt2->close();
        }
        if ($stmt != NULL)
        {

                $stmt->close();
        }
        if ($stmt3 != NULL)
        {
                $stmt3->close();
        }
        if ($stmt4 != NULL)
        {
                $stmt4->close();
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

         function returnWithInfo( $result )
         {
                $retValue = '{"result":' . $result . '}';
                sendResultInfoAsJson( $retValue );
         }

?>
