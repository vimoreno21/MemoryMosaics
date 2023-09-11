<?php
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type');


        $inData = getRequestInfo();
        // this info is passed in by the user
        $loginData = $inData['Login'];
        $passwordData = $inData['Password'];
        $date = date('Y-m-d H:i:s');


        $conn = mysqli_connect("localhost", "AdminAccount", "wearetesting", "COP4331");
        if (!$conn)
        {
                die("Connection failed: " . mysqli_connect_error());
        }

        else
        {
                $checkLogin = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
                $checkLogin->bind_param("ss", $loginData, $passwordData);

                $checkLogin->execute();

                $result = $checkLogin->get_result();

                if( $curr_user = $result->fetch_assoc() )
                {
                        $update_date_login = $conn->prepare("UPDATE Users SET DateLastLoggedIn = ? where ID = ?");
                        $update_date_login->bind_param("ss", $date, $curr_user['ID']);
                        $update_date_login->execute();

                        returnWithInfo( $curr_user['FirstName'], $curr_user['LastName'], $curr_user['ID'] );
                        if ($update_date_login != NULL)
                        {
                                $update_date_login->close();
                        }
                }


                else
                {
                        returnWithError("No Records Found");
                }


                if ($checkLogin != NULL)
                {
                        $checkLogin->close();
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
                $retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $firstName, $lastName, $id )
        {
                $retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>
      
