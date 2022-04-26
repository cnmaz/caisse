<?php
require_once "rb/rb.php";
$sale = R::load('sale', 3);
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
var_export($sale->via("relation")->sharedProductList);
