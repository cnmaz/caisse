<?php
require_once "vendor/autoload.php";
require "config.php";

use \RedBeanPHP\R as R;

R::setup('sqlite:./dbfile.db');

$uri = $_SERVER['REQUEST_URI'];

function starts_with ( $haystack, $needle ) {
    return strpos( $haystack , $needle ) === 0;
}

function ends_with($haystack, $needle)
{
    return strpos($haystack, $needle) === strlen($haystack) - strlen($needle);
}

$oauth_credentials = json_decode(file_get_contents('client_secret.json'), true);


session_start(); // Remove if session.auto_start=1 in php.ini
// var_export($_SERVER);
// $uri = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['PATH_INFO'];

// echo $uri;

$provider = new \League\OAuth2\Client\Provider\Google([
    'clientId'                => $oauth_credentials['web']['client_id'],    // The client ID assigned to you by the provider
    'clientSecret'            => $oauth_credentials['web']['client_secret'],    // The client password assigned to you by the provider
    'redirectUri'             => $redirectUrl // $uri, //'http://localhost:8080/auth',
    //    'hostedDomain' => 'localhost:8080'
]);

if (starts_with($uri, "/auth") || empty($_SESSION['oauth_token'])) {
    require "auth.php";
    exit();
}

// Optional: Now you have a token you can look up a users profile data
try {

    $token = $_SESSION['oauth_token'];

    // We got an access token, let's now get the owner details
    $ownerDetails = $provider->getResourceOwner($token);

    // Use these details to create a new profile
    $mail = $ownerDetails->getEmail();
    if (!ends_with($mail, "@cnmaz.fr")) {
        http_response_code(403);
        echo ("Not CNMAZ");
        exit();
    }
} catch (Exception $e) {

    // Failed to get user details
    exit('Something went wrong: ' . $e->getMessage());
}
$uri = str_replace('/api','', $uri);
if ($uri == "/init") {
    require "init.php";
} elseif ($uri == "/debug") {
    require "debug.php";
} elseif (starts_with($uri,"/product")) {
    require "product.php";
} elseif (starts_with($uri,"/category")) {
    require "category.php";
} elseif (starts_with($uri,"/sale")) {
    require "sale.php";
}
