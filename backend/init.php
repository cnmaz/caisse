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

$cakes = R::load("category", 3);
$cakes->label = "Gateaux";
$cakes->ordre = 2;
R::store($cakes);

$crepes = R::load("category", 4);
$crepes->label = "Crêpes";
$crepes->ordre = 3;
R::store($crepes);

$other = R::load("category", 5);
$other->label = "Autres";
$other->ordre = 3;
R::store($other);


function product($id, $label, $category, $price, $ordre, $preparation = false)
{
    $product = R::load("product", $id);
    $product->label = $label;
    $product->category = $category;
    $product->price = $price;
    $product->ordre = $ordre;
    $product->preparation = $preparation;
    R::store($product);
}

$id = 1;
product($id++, "Bière + Consigne EcopCup", $drinks, 3.5, 1);
product($id++, "Retour Consigne EcoCup", $drinks, -1, 1);
// product($id++, "Bière", $drinks, 2.5, 1);
product($id++, "Eau plate (50cl)", $drinks, .5, 2);
product($id++, "Coca-Zero (33cl)", $drinks, 1, 4);
product($id++, "Coca (33cl)", $drinks, 1, 5);
product($id++, "Fanta orange (33cl)", $drinks, 1, 6);
product($id++, "Tropico orange ananas (33cl)", $drinks, 1, 6);
product($id++, "Tropico tropical (33cl)", $drinks, 1, 6);
product($id++, "Fuze tea (33cl)", $drinks, 1, 6);

product($id++, "Part de quatre quart", $cakes, 1, 1);
product($id++, "Sucette", $cakes, 0.5, 1);
// product(12, "Part flan", $cakes, 2, 2);
// product(13, "Part cake chocolat", $cakes, 2, 3);
// product(14, "Part cake pépites chcolat", $cakes, 2, 3);
// product(15, "Part gateau citron", $cakes, 2, 3);

$id = 40;
product($id++, "Crêpe sucre", $crepes, 1.5, 1, true);
product($id++, "Crêpe beurre sucre", $crepes, 1.5, 1, true);
product($id++, "Crêpe confiture fraise", $crepes, 2, 1, true);
product($id++, "Crêpe confiture framboise", $crepes, 2, 1, true);
product($id++, "Crêpe nutella", $crepes, 2, 1, true);
product($id++, "Crêpe pâte à tartiner choco/noisette", $crepes, 2, 1, true);

$id = 400;
product($id++, "Droit d'inscription régate", $other, 10, 1);

R::close();
