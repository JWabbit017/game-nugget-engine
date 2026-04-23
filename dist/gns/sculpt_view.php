<?php declare(strict_types=1);

$input = file_get_contents('php://input');

if (is_null($input) || empty($input))
{
    http_response_code(400);
    echo '<span class="error">ERROR: Bad input for view sculpt</span>';
    exit(1);
}

$data = json_decode($input, true);

if (!isset($data['path']) || !isset($data['name']))
{
    http_response_code(400);
    echo '<span class="error">ERROR: Invalid arguments for view sculpt</span>';
    exit(1);
}

$dirpath = $_SERVER['DOCUMENT_ROOT'].$data['path'];

$name = $data['name'] ?? 'default';

$new = fopen($dirpath.'/'.$name.'.js', 'c');

$view = "import * as GNE from '';

const GameNugget = GNE.GameNugget;
const g = GNE.g;

class $name extends GNE.View
{
    constructor()
    {
        super($name.HTML, {
            a: $name.exampleEvent,
            b: null,
            up: null,
            down: null,
            misc: null
        });
    }

    static exampleEvent()
    {
        GameNugget.debugHandler.createDebug('hello world', true);
    }

    static HTML()
    {
        const view = g.newElement('div');
        view.setAttribute('id', $name);

        const text = g.newElement('h2', 'This is a GNE View');

        view.appendChild(text);

        return view;
    }
}

export default new $name();
";

fwrite($new, $view);

fclose($new);

echo 'View '.$name.' successfully sculpted in '.$dirpath.'!
 Make sure to first link GNE to it by having your IDE autocomplete the import statement on line 1.
 Access it by running: |~$/instance: goto '.$name;
