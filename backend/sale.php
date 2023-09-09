<?php

use \RedBeanPHP\R as R;

function link_products_to_sale($products, $sale)
{
    // $product_array = array_map(function ($p) {
    //     return  R::load("product", $p->product_id);
    // }, $products);
    // $old_items = R::find("solditem", "sale_id = ?", [$sale->id]);
    $ids = [];
    foreach ($products as $product_info) {
        $rel = R::load("solditem", $product_info->id);
        $rel->sale_id = $sale->id;
        $rel->product_id = $product_info->product_id;
        $rel->state = $product_info->state;
        R::store($rel);
        $ids[] = $rel->id;
    }
    $items = R::findAll("solditem", "sale_id = ?", [$sale->id]);
    foreach ($items as $item) {
        if (!in_array($item->id, $ids)) {
            R::trash($item);
        }
    }
    return $sale;
}
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    if (isset($_GET['limit'])) {
        $limit=intval($_GET['limit']);
    } else {
        $limit=false;
    }
    $tabs = isset($_GET['tabs']);
    $sales = R::findMulti('sale,solditem', ' SELECT sale.*, solditem.* FROM sale INNER JOIN solditem ON solditem.sale_id = sale.id '.
    ($tabs?' WHERE sale.name is not null AND sale.state != 4':'')
    .' ORDER BY sale.created DESC', [], array(array(
        'a' => 'sale',
        'b' => 'solditem',
        'matcher' =>  function ($a, $b) {
            return $b->sale_id == $a->id;
        },
        'do' => function ($a, $b) {
            if (is_array($a->noLoad()->items)) {
                $a->noLoad()->items[] = $b;
            } else {
                $a->noLoad()->items = [$b];
            }
            // echo ('a' . $a . '/ b' . $b . "\n");
        }
    )));
    $sales = $sales['sale'];
    $sales = array_map(function ($a) {
        return array(
            'id' => $a->id,
            'items' => $a->items,
            'state' => $a->state,
            'mode' => $a->mode,
            'name' => $a->name,
            'created' => $a->created,
            'updated' => $a->updated,
        );
    }, $sales);
    if ($limit) {
        echo json_encode(array_slice(array_values($sales), 0, $limit), JSON_PRETTY_PRINT);
    } else {
        echo json_encode(array_values($sales), JSON_PRETTY_PRINT);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode(array_values(R::findAll('sale')), JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $body = json_decode(file_get_contents("php://input"));
    $new_sale = R::dispense("sale");
    $new_sale->state = $body->state;
    $new_sale->mode = $body->mode;
    $new_sale->name = $body->name;
    if (is_null($new_sale->created)) {
        $new_sale->created = time();
    }
    $new_sale->updated = time();
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
    $new_sale->mode = $body->mode;
    $new_sale->name = $body->name;
    $new_sale = link_products_to_sale($body->products, $new_sale);
    if (is_null($new_sale->created)) {
        $new_sale->created = time();
    }
    $new_sale->updated = time();
    R::store($new_sale);
    // var_export($new_sale);
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_sale, JSON_PRETTY_PRINT);
} elseif ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    $body = json_decode(file_get_contents("php://input"));
    if (is_null($body->id)) {
        http_response_code(400);
        return;
    }
    $new_sale = R::load("sale", $body->id);
    $new_sale->state = $body->state;
    $new_sale->mode = $body->mode;
    $new_sale->name = $body->name;
    if (is_null($new_sale->created)) {
        $new_sale->created = time();
    }
    $new_sale->updated = time();
    R::store($new_sale);
    // var_export($new_sale);
    foreach ($body->items as $product) {
        if (!is_null($product->id)) {
            $pr = R::load("solditem", $product->id);
            if (!is_null($product->state)) {
                $pr->state = $product->state;
                R::store($pr);
            }
        }
    }
    header("Content-Type: application/json; charset=UTF-8");
    header("Content-Encoding: UTF-8");
    echo json_encode($new_sale, JSON_PRETTY_PRINT);
}
