<?php
        header('Access-Control-Allow-Origin: *');

        header('Access-Control-Allow-Headers: Content-Type');
        $inData = getRequestInfo();

        $searchResults = "";
        $searchCount = 0;

        $conn = new mysqli("localhost", "AdminAccount", "wearetesting", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                if ($inData["search"] == "" || $inData["search"] == NULL)
                {
                        $stmt = $conn->prepare("SELECT * from Contacts where UserID = ?");
                        $stmt->bind_param("s", $inData["UserID"]);

                        $stmt->execute();

                        $result = $stmt->get_result();
                        while($row = $result->fetch_assoc())

                        {

                if( $searchCount > 0 )
                {
                        $firstName .= ",";
                        $lastName .= ",";
                        $phone .= ",";
                        $email .= ",";
                }
                $searchCount++;

                $firstName .= $row["FirstName"];
                $lastName .= $row["LastName"];
                $phone .= $row["Phone"];
                                $email .= $row["Email"];
                        }
            returnWithInfo( $firstName, $lastName, $phone, $email );
        }

                else
                {
            $stmt = $conn->prepare("SELECT FirstName,LastName,Phone,Email from Contacts where FirstName like ? and UserID = ?
            UNION SELECT FirstName,LastName,Phone,Email from Contacts where LastName like ? and UserID = ?
            UNION SELECT FirstName,LastName,Phone,Email from Contacts where Phone like ? and UserID = ? 
            UNION SELECT FirstName,LastName,Phone,Email from Contacts where Email like ? and UserID = ?");

            $searchInput = "%" . $inData["search"] . "%";
            $stmt->bind_param("ssssssss", $searchInput, $inData["UserID"], $searchInput, $inData["UserID"], $searchInput, $inData["UserID"], $searchInput, $inData["UserID"]);

            $stmt->execute();

            $result = $stmt->get_result();

            while($row = $result->fetch_assoc())
            {
                if( $searchCount > 0 )
                {
                    $firstName .= ",";
                    $lastName .= ",";
                    $phone .= ",";
                    $email .= ",";
               }
                $searchCount++;

                $firstName .= $row["FirstName"];
                $lastName .= $row["LastName"];
                $phone .= $row["Phone"];
                $email .= $row["Email"];


            }

                if( $searchCount == 0 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        returnWithInfo( $firstName, $lastName, $phone, $email );
                }
        }


                if ($stmt != NULL)
                {

                        $stmt->close();
                }
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
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $firstName, $lastName, $phone, $email )
        {
                $retValue = '{"FirstName":[' . $firstName . '],"LastName":['.$lastName.'],"Phone":['.$phone.'],"Email":['.$email.'],error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>

