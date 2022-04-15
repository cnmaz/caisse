<?php
R::fancyDebug(true);

$admin = R::load("user", 1);
$admin->name = "admin";
$admin->email = "contact-tech@cnmaz.fr";
R::store($admin);

$drinks = R::load("category", 1);
$drinks->label = "Boissons";
$drinks->ordre = 1;
R::store($drinks);

$cakes = R::load("category", 2);
$cakes->label = "Gateaux";
$cakes->ordre = 2;
R::store($cakes);

function product($id, $label, $category, $ordre)
{
    $product = R::load("product", $id);
    $product->label = $label;
    $product->category = $category;
    $product->ordre = $ordre;
    R::store($product);
}

product(1, "Bière", $drinks, 1);
product(2, "Christaline (50cl)", $drinks, 2);
product(3, "San pellegrino (50cl)", $drinks, 3);
product(4, "Coca-Zero (33cl)", $drinks, 4);
product(5, "Coca (33cl)", $drinks, 5);
product(5, "Fanta (33cl)", $drinks, 6);

R::close();
