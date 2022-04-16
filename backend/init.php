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

function product($id, $label, $category, $price, $ordre)
{
    $product = R::load("product", $id);
    $product->label = $label;
    $product->category = $category;
    $product->price = $price;
    $product->ordre = $ordre;
    R::store($product);
}

product(1, "Bière", $drinks, 2.5, 1);
product(2, "Christaline (50cl)", $drinks, .5, 2);
product(3, "San pellegrino (50cl)", $drinks, 1, 3);
product(4, "Coca-Zero (33cl)", $drinks, 1, 4);
product(5, "Coca (33cl)", $drinks, 1, 5);
product(6, "Fanta (33cl)", $drinks, 1, 6);
product(7, "Tropico pomme banane (33cl)", $drinks, 1, 6);
product(8, "Tropico exotique (33cl)", $drinks, 1, 6);
product(9, "Tropico orange (33cl)", $drinks, 1, 6);

product(10, "Part tarte aux pommes", $cakes, 2, 1);
product(11, "Part flan", $cakes, 2, 2);
product(12, "Part cake chocolat", $cakes, 2, 3);
product(13, "Part cake pépites chcolat", $cakes, 2, 3);
product(14, "Part gateau citron", $cakes, 2, 3);

R::close();
