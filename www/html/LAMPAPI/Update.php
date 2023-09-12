<?php

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type');
        $inData = getRequestInfo();


        $conn = new mysqli("localhost", "AdminAccount", "wearetesting", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
                if ($inData["FieldName"] == "FirstName")
                {
                        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ? WHERE ID = ?;");
                        $stmt->bind_param("ss", $inData["NewValue"], $inData["ID"]);

                }
                else if ($inData["FieldName"] == "LastName")
                {
                        $stmt = $conn->prepare("UPDATE Contacts SET LastName = ? WHERE ID = ?;");
                        $stmt->bind_param("ss", $inData["NewValue"], $inData["ID"]);
                }

                else if ($inData["FieldName"] == "Phone")
                {
                        $stmt = $conn->prepare("UPDATE Contacts SET Phone = ? WHERE ID = ?;");
                        $stmt->bind_param("ss", $inData["NewValue"], $inData["ID"]);
                }

                else if ($inData["FieldName"] == "Email")
                {
                        $stmt = $conn->prepare("UPDATE Contacts SET Email = ? WHERE ID = ?;");
                        $stmt->bind_param("ss", $inData["NewValue"], $inData["ID"]);
                }

                $stmt->execute();

        //      $getAllContactInfo = $conn->prepare("SELECT * from Contacts where ID = ?");
        //      $getAllContactInfo->bind_param("s", $inData["ID"]);
        //      $getAllContactInfo->execute();
        //      $result = $getAllContactInfo->get_result();

        //      $row = $result->fetch_assoc();

                if ($stmt == NULL)
                {
                        returnWithInfo( "Update operation failed");
                }
                else
                {
                        returnWithInfo("Update success!");
                }

                if ($getAllContactInfo != NULL)
                {
                        $getAllContactInfo->close();

                }
                if ($stmt != NULL)
                {
                        $stmt->close();
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
