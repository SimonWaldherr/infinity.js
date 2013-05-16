<?php

$earliest = $_POST['earliest'];
$latest   = $_POST['latest'];
$height   = $_POST['height'];

$data['itemscount'] = 1;

if($earliest>1000) {                //append
  $new = ($earliest + rand(1,240));
  $data['date']     = $new;
  $data['earliest'] = $new;
  $data['html']     = hash("md5", rand(1111,999999999999999)).'<br/>'.$data['date'];
} elseif($latest>1000) {            //prepend
  $new = ($latest - rand(1,240));
  $data['date']   = $new;
  $data['latest'] = $new;
  $data['html']   = hash("md5", rand(1111,999999999999999)).'<br/>'.$data['date'];
} else {                            //init
  $new                         = time()-5500;
  $data['earliest']            = $new;
  for($i = 0; $i < 20; $i++) {
    $data['items'][$i]['date'] = $new;
    $data['items'][$i]['html'] = hash("md5", rand(1111,999999999999999)).'<br/>'.$data[$i]['date'];
    $new                       = $new - rand(10,360);
  }
  $data['itemscount'] = $i;
  $data['latest']     = $new;
}

$data['status'] = true;

die(json_encode($data));

?>
