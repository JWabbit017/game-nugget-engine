<?php declare(strict_types=1);

class DPack
{
  private static function exitBadInput(string $msg = 'Invalid input')
  {
    http_response_code(400);
    echo $msg;
    exit(1);
  }

  public static function dpack()
  {
    echo 'Validating input...\n';
    $data = static::validateInput();

    $v = $data['v'];
    $path = $data['path'];
    
    echo 'Updating package.json...\n';
    $GNEpath = static::incrementPackageJson($v, $path);

    echo 'Copying JS source to dist...';
    static::copyJS($_SERVER['DOCUMENT_ROOT'] . '/' . $path . '/' + $GNEpath);

    return "Version $v packed successfully";
  }

  private static function validateInput()
  {
    $input = file_get_contents('php://input');

    if ($input === false) static::exitBadInput();

    $data = json_decode($input, true);

    if (!isset($data['v']) || !isset($data['path'])) static::exitBadInput();

    return $data;
  }

  private static function incrementPackageJson(string $version, string $path)
  {
    $path = $_SERVER['DOCUMENT_ROOT'] . '/' . $path . '/package.json';

    $file = fopen($path, 'r+');

    $json = json_decode(fread($file, filesize($path)), true);

    fclose($file);

    if ($json === false) static::exitBadInput('Invalid package.json path');

    $json['version'] = $version;

    file_put_contents($path, json_encode($json));

    return $json['gneDirectory'] ?? '_GNE';
  }
  
  private static function copyJS(string $path)
  {
    $src = $path . '/src/js';
    $dist = $path . '/dist/js';

    static::recurseCopy($src, $dist);
  }

  private static function recurseCopy(
    string $sourceDirectory,
    string $destinationDirectory,
    string $childFolder = ''
  ): void {
    $directory = opendir($sourceDirectory);

    if ($childFolder !== '') 
    {
      if (is_dir("$destinationDirectory/$childFolder") === false) 
      {
        mkdir("$destinationDirectory/$childFolder");
      }

      while (($file = readdir($directory)) !== false) {
          if ($file === '.' || $file === '..') {
            continue;
          }

          if (is_dir("$sourceDirectory/$file") === true) 
          {
            static::recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
          } else 
          {
            copy("$sourceDirectory/$file", "$destinationDirectory/$childFolder/$file");
          }
      }

      closedir($directory);

      return;
    }

    while (($file = readdir($directory)) !== false) {
      if ($file === '.' || $file === '..') 
      {
        continue;
      }

      if (is_dir("$sourceDirectory/$file") === true) 
      {
        static::recurseCopy("$sourceDirectory/$file", "$destinationDirectory/$file");
      }
      else 
      {
        copy("$sourceDirectory/$file", "$destinationDirectory/$file");
      }
    }

    closedir($directory);
  }
}

echo DPack::dpack();