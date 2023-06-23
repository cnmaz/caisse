<?php
include_once("./util.php");
use \RedBeanPHP\R as R;

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode(array_values(R::findAll('product')), JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $body = json_decode(file_get_contents("php://input"));
    $new_product = R::dispense("product");
    $new_product->label = $body->label;
    $new_product->ordre = $body->ordre;
    $new_product->category_id = $body->category_id;
    $new_product->preparation = $body->preparation;
    $new_product->price = $body->price;
    $new_product->active = $body->active;
    if (is_null($new_product->created)) {
        $new_product->created = time();
    }
    $new_product->updated = time();
    R::store($new_product);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_product, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_product = R::load("product", $body->id);
    $new_product->label = $body->label;
    $new_product->ordre = $body->ordre;
    $new_product->category_id = $body->category_id;
    $new_product->preparation = $body->preparation;
    $new_product->active = $body->active;
    if (is_null($new_product->created)) {
        $new_product->created = time();
    }
    $new_product->updated = time();
    R::store($new_product);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_product, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_product = R::load("product", $body->id);
    $new_product->label = $body->label;
    $new_product->ordre = $body->ordre;
    $new_product->category_id = $body->category_id;
    $new_product->preparation = $body->preparation;
    $new_product->active = $body->active;
    if (is_null($new_product->created)) {
        $new_product->created = time();
    }
    $new_product->updated = time();
    R::store($new_product);
    // var_export($new_product);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_product, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $body = json_decode(file_get_contents("php://input"));
    $path_parts = explode("/", $_SERVER['REQUEST_URI']);
    $id = obj_default($path_parts[2], $body->id);
    if (is_null($id)) {
        http_response_code(400);
        return;
    }
    if (R::count('solditem','product_id=?',[$id]) > 0) {
        http_response_code(409);
        die("Cannot delete a already sold product");
    }
    if (R::count('product','id=?',[$id]) != 1) {
        http_response_code(404);
        die("Item not found");
    }
    $new_category = R::load("product", $id);

    R::trash($new_category);
    // var_export($new_category);
    http_response_code(204);
}
