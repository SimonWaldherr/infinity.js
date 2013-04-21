<?php

$data['status'] = true;
$data['date']   = rand(1111,999999999999999);
$data['html']   = rand(1111,999999999999999);
$data['earliest'] = rand(1111,999999999999999);
$data['latest'] = rand(1111,999999999999999);

die(json_encode($data));

?>