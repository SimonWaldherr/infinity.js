<?php

$earliest = $_POST['earliest'];
$latest   = $_POST['latest'];
$height   = $_POST['height'];

if($earliest>1000) {                //append
  $new = ($earliest + rand(1,240));
  $data['date'] = $new;
  $data['earliest'] = $new;
} elseif($latest>1000) {            //prepend
  $new = ($latest - rand(1,240));
  $data['date'] = $new;
  $data['latest'] = $new;
} else {                            //init
  $new = time()-5500;
  $data['date'] = $new;
  $data['latest'] = $new;
  $data['earliest'] = $new;
}

$data['status'] = true;
$data['html']   = hash("md5", rand(1111,999999999999999)).'<br/>'.$data['date'];

die(json_encode($data));

?>