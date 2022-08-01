<?php
include_once("./util.php");
if ($_SERVER["REQUEST_METHOD"] == "GET" && $_SERVER['REQUEST_URI'] == "/category") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode(array_values(R::findAll('category')), JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $body = json_decode(file_get_contents("php://input"));
    $new_category = R::dispense("category");
    $new_category->label = $body->label;
    $new_category->ordre = $body->ordre;
    if (is_null($new_category->created)) {
        $new_category->created = time();
    }
    $new_category->updated = time();
    R::store($new_category);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_category, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_category = R::load("category", $body->id);
    $new_category->label = $body->label;
    $new_category->ordre = $body->ordre;
    if (is_null($new_category->created)) {
        $new_category->created = time();
    }
    $new_category->updated = time();
    R::store($new_category);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_category, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_category = R::load("category", $body->id);
    $new_category->label = $body->label;
    $new_category->ordre = $body->ordre;
    if (is_null($new_category->created)) {
        $new_category->created = time();
    }
    $new_category->updated = time();
    R::store($new_category);
    // var_export($new_category);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_category, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $body = json_decode(file_get_contents("php://input"));
    $path_parts = explode("/", $_SERVER['REQUEST_URI']);
    $id = obj_default($path_parts[2], $body->id);
    if (is_null($id)) {
        http_response_code(400);
        return;
    }
    if (R::count('product','category_id=?',[$id]) > 0) {
        http_response_code(409);
        die("Cannot delete a category with existing products");
    }
    if (R::count('category','id=?',[$id]) != 1) {
        http_response_code(404);
        die("Item not found");
    }
    $new_category = R::load("category", $id);

    R::trash($new_category);
    // var_export($new_category);
    http_response_code(204);
}

