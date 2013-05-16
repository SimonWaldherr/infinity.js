<html>
<head>
  <meta charset="utf-8">
  <title>infinity.js</title>
  <link href="./files_for_demo/style.css" rel="stylesheet" type="text/css">
</head>
<body>
  <div id="scrolldiv">
    
  </div>
  <div class="topbar">
    <p onclick="ScrollToElement(document.getElementsByClassName('today')[0]);"><!--scroll to --></p>
  </div>
  <div id="container" class="container" data-url="./serverside/"></div>
  <script type="text/javascript" src="./files_for_demo/disTime/disTime.js"></script>
  <script type="text/javascript" src="./infinity.js"></script>
  <script type="text/javascript">
    var config = {'lang' : 'en', 'time' : '60*60*24', 'detail' : 1};
    
    function infinityAfterAjax () {
      disTime(<?php echo time(); ?>-parseInt(Date.now()/1000),config['lang'],parseInt(config['detail'],10));
    }
    
    function init() {
      var cal = document.getElementById('container');
      
      cal.infinityinit();
      cal.infinityFirst();
    }
    
    window.onload = function() {
      init();
    }
  </script>
</body>
</html>
