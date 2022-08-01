<?php
function obj_default($val, $replacement) {
    if (is_null($val)) {
        return $replacement;
    } else {
        return $val;
    }
}