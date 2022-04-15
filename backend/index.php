<?php
require "rb/rb.php";
R::setup('sqlite:/tmp/dbfile.db');

$uri = $_SERVER['REQUEST_URI'];

if ($uri == "/init") {
    require "init.php";
} elseif ($uri == "/product") {
    require "product.php";
} elseif ($uri == "/category") {
    require "category.php";
} elseif ($uri == "/sale") {
    require "sale.php";
}
