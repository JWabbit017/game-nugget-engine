# The Game Nugget Web App Engine

The Game Nugget Web App Engine (from here on 'GNE') is a retro-styled library/engine for basic, fun web apps.

## Setup Guide

While we're working on neat documentation, here's a basic guide to get your Game Nugget up and running:

1. Put the dist folder in your project's root
2. Link "{your GNE folder}/game-nugget.css" to your project's index.php
3. Use PHP to include "{your GNE folder}/gameNugget.php" inside your index's container div
4. In your own script, import the following: import \* as GNE from "{your GNE folder}/index.js"
5. Save GNE.GameNugget in a (preferrably) global scope variable - this is the live instance that will be running your app
6. Call GameNugget.start() at the end of your script

And voila, on opening your index you should see a beautiful Game Nugget with the debug view loaded.
From here you can start making your own app for it to run - a guide for that is to follow shortly.
