<?php
require_once "vendor/autoload.php";

use \RedBeanPHP\R as R;

R::setup('sqlite:./dbfile.db');

$uri = $_SERVER['REQUEST_URI'];

function starts_with ( $haystack, $needle ) {
    return strpos( $haystack , $needle ) === 0;
}

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
