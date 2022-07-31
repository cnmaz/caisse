<?php
require_once "rb/rb.php";
R::setup('sqlite:./dbfile.db');

$uri = $_SERVER['REQUEST_URI'];

if ($uri == "/init") {
    require "init.php";
} elseif ($uri == "/debug") {
    require "debug.php";
} elseif (str_starts_with($uri,"/product")) {
    require "product.php";
} elseif (str_starts_with($uri,"/category")) {
    require "category.php";
} elseif (str_starts_with($uri,"/sale")) {
    require "sale.php";
}
