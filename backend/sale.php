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
    $sales = R::findMulti('sale,relation', ' SELECT sale.*, relation.* FROM sale INNER JOIN relation ON relation.sale_id = sale.id', [], array(array(
        'a' => 'sale',
        'b' => 'relation',
        'matcher' =>  function ($a, $b) {
            return $b->sale_id == $a->id;
        },
        'do' => function ($a, $b) {
            if (is_array($a->noLoad()->products)) {
                $a->noLoad()->products[] = $b->product_id;
            } else {
                $a->noLoad()->products = [$b->product_id];
            }
            // echo ('a' . $a . '/ b' . $b . "\n");
        }
    )));
    // var_export($sales);
    $sales = $sales['sale'];
    // var_export($sales);
    $sales = array_map(function ($a) {
        return array(
            'id' => $a->id,
            'products' => $a->products,
            'state' => $a->state
        );
    }, $sales);
    // var_export($sales);
    echo json_encode(array_values($sales), JSON_PRETTY_PRINT);
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
