<?php
require_once "rb/rb.php";
// $sale = R::load('sale', 3);
// echo (json_encode(R::findMulti(
//     'sale,relation,product',
//     'SELECT sale.*, relation.*, product.* FROM sale LEFT JOIN relation ON relation.sale_id = sale.id LEFT JOIN product ON relation.product_id = product.id',
//     [],
// [
//     Finder::map('sale', 'relation'),
//     Finder::map('relation', 'product')
// ]
// array(array(
//     'a'       => 'sale',
//     'b'       => 'relation',
//     'matcher' =>  function ($a, $b) {
//         return ($b->sale_id == $a->id);
//     },
//     'do'      => function ($a, $b) {
//         $a->noLoad()->sharedRelationList[] = $b;
//     }
// ))
// function ($a, $b) {
//     // $a->products[] = $c;
//     echo ($a);
//     echo ($b);
// }
// ), JSON_PRETTY_PRINT));
// $it = $sale->via("relation")->sharedProductList;
// $it = R::convertToBean('sale', $sale);
$it = R::findMulti('sale,relation', ' SELECT sale.*, relation.* FROM sale INNER JOIN relation ON relation.sale_id = sale.id', [], array(array(
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
// var_export($it);
echo json_encode(array_values($it), JSON_PRETTY_PRINT);
// echo json_encode($it, JSON_PRETTY_PRINT);
