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
    echo 'Validating input...';
    $data = static::validateInput();
      echo '<span class="success">done!</span><br>';

    $v = $data['v'];
    $path = $data['path'];
    
    echo 'Updating package.json...';
    $GNEpath = static::incrementPackageJson($v, $path);
      echo '<span class="success">done!</span><br>';

    echo 'Copying JS source to dist...';
    static::copyJS($_SERVER['DOCUMENT_ROOT'] . '/' . $path . '/' . $GNEpath);
    echo '<span class="success">done!</span><br>';

    echo 'Copying GNS source to dist...';
    static::copyGNS($_SERVER['DOCUMENT_ROOT'] . '/' . $path . '/' . $GNEpath);
      echo '<span class="success">done!</span><br>';

    echo 'Compiling Sass to dist...';
    $sass = shell_exec('npm run sassDist');
    echo '<span class="success">done!</span><br>';

    if (!($sass ?? false)) static::exitBadInput('DPack was unable to run sass compiler');

    return "<br>Version $v packed successfully";
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

  private static function copyGNS(string $path)
  {
    $src = $path . '/src/gns';
    $dist = $path . '/dist/gns';

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
exit(0);