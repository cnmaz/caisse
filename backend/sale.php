<?php
header("Content-Type: application/json; charset=UTF-8");
header("Content-Encoding: UTF-8");
echo json_encode(array_values(R::findAll('sale')), JSON_PRETTY_PRINT);
