<?php

if (!is_dir(__DIR__.'/devkey.gne')) echo 'false';
else if (file_get_contents(__DIR__.'/devkey.gne') === file_get_contents('php://input')) echo 'true';
else echo 'false';