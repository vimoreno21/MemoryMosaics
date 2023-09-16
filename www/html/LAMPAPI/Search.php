<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "AdminAccount", "wearetesting", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    if ($inData["search"] == "" || $inData["search"] == NULL) {
        $stmt = $conn->prepare("SELECT * from Contacts where UserID = ?");
        $stmt->bind_param("s", $inData["UserID"]);

        $stmt->execute();

        $result = $stmt->get_result();

        $data = array(
            "FirstName" => array(),
            "LastName" => array(),
            "Phone" => array(),
            "Email" => array(),
            "ID" => array(),
            "error" => ""
        );

        while ($row = $result->fetch_assoc()) {
            $data["FirstName"][] = $row["FirstName"];
            $data["LastName"][] = $row["LastName"];
            $data["Phone"][] = $row["Phone"];
            $data["Email"][] = $row["Email"];
            $data["ID"][] = $row["ID"];
        }

        returnWithInfo($data);
    } else {
        $stmt = $conn->prepare("SELECT FirstName,LastName,Phone,Email,ID from Contacts where FirstName like ? and UserID = ?
            UNION SELECT FirstName,LastName,Phone,Email,ID from Contacts where LastName like ? and UserID = ?
            UNION SELECT FirstName,LastName,Phone,Email,ID from Contacts where Phone like ? and UserID = ? 
            UNION SELECT FirstName,LastName,Phone,Email,ID from Contacts where Email like ? and UserID = ?");

        $searchInput = "%" . $inData["search"] . "%";
        $stmt->bind_param("ssssssss", $searchInput, $inData["UserID"], $searchInput, $inData["UserID"], $searchInput, $inData["UserID"], $searchInput, $inData["UserID"]);
        $stmt->execute();

        $result = $stmt->get_result();

        $data = array(
            "FirstName" => array(),
            "LastName" => array(),
            "Phone" => array(),
            "Email" => array(),
            "ID" => array(),
            "error" => ""
        );

        while ($row = $result->fetch_assoc()) {
            $data["FirstName"][] = $row["FirstName"];
            $data["LastName"][] = $row["LastName"];
            $data["Phone"][] = $row["Phone"];
            $data["Email"][] = $row["Email"];
            $data["ID"][] = $row["ID"];
        }

        if (empty($data["FirstName"])) {
            returnWithError("No Records Found");
        } else {
            returnWithInfo($data);
        }
    }

    if ($stmt != NULL) {
        $stmt->close();
    }
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = array(
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => $err
    );

    sendResultInfoAsJson($retValue);
}

function returnWithInfo($data)
{
    sendResultInfoAsJson($data);
}
?>
