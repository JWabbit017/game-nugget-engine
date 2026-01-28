const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/js/init.js",
  output: {
    filename: "dist.js",
    path: path.resolve(__dirname, "dist/js"),
  },
  resolve: {
    alias: {
      GameNugget: path.resolve(__dirname, "src/js/"),
      View: path.resolve(__dirname, "src/js/modules/"),
    },
  },
};
