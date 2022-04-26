<?php
function link_products_to_sale($products, $sale)
{
    $product_array = array_map(function ($p) {
        return  R::load("product", $p);
    }, $products);
    $sale->via("relation")->sharedProductList = $product_array;
    return $sale;
}
if ($_SERVER["REQUEST_METHOD"] == "GET" && $_SERVER['REQUEST_URI'] == "/sale") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode(array_values(R::findAll('sale')), JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && $_SERVER['REQUEST_URI'] == "/sale") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode(array_values(R::findAll('sale')), JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $body = json_decode(file_get_contents("php://input"));
    $new_sale = R::dispense("sale");
    $new_sale->state = $body->state;
    if ($body->products != null) {
        $new_sale = link_products_to_sale($body->products, $new_sale);
    }
    R::store($new_sale);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_sale, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_sale = R::load("sale", $body->id);
    $new_sale->state = $body->state;
    $new_sale = link_products_to_sale($body->products, $new_sale);
    R::store($new_sale);
    // var_export($new_sale);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_sale, JSON_PRETTY_PRINT);
}
