<?php
  // Before anyone asks: There is no LLM-generated code here (or anywhere in the repo for that matter), I just suck badly
  
  $entryUrl = $argv[1] ?? $_GET['entry'];
  $exitUrl = $argv[2] ?? $_GET['exit'];

  if (!is_file($entryUrl))
    {
      exit('File/directory pointer args invalid');
    }

  $entryFile = file_get_contents($entryUrl) ?? 'n';

  $style = [];
  $styleMatches = preg_match_all('/VStyle\(\)\s?{.+return\s|\n\`(.+)\`;\s|\n}/sm', $entryFile, $style);

  if (!isset($style[1])) exit('Warn: No style in view '.$entryUrl);

  file_put_contents($exitUrl, $style[1]);
?>