<?php
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
}
