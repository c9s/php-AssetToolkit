<?php
require "../vendor/autoload.php";
use AssetKit\AssetConfig;
use AssetKit\AssetLoader;
use AssetKit\CacheFactory;

$baseUrl = dirname($_SERVER['SCRIPT_NAME']);

define('ROOT', dirname(__DIR__) );

// create a virtual asset config object.
$config = new AssetConfig("../assetkit.yml");
$config->setRoot(ROOT);
$config->setBaseDir("public/assets");
$config->setBaseUrl("/assets");

// namespace is used for caching
$config->setNamespace("assetkit-testing-prod");
$config->setEnvironment("production");
$config->setCacheDir(ROOT . "/cache"); // setup asset cache path

$config->addAssetDirectory("tests/assets"); // setup asset lookup directory (based on ROOT directory)

// create a cache handler based on the current config
$config->setCache(CacheFactory::create($config));

$loader = new AssetLoader($config);
$assets = array();
$assets[] = $loader->load( 'jquery' );
$assets[] = $loader->load( 'jquery-ui' );
$assets[] = $loader->load( 'underscore' );
$assets[] = $loader->load( 'test' );

$render = new AssetKit\AssetRender($config,$loader);

if (isset($_GET['force'])) {
    $compiler = $render->getCompiler();
    $compiler->enableFstatCheck();
    $render->force();
}
?>
<html>
<head>
<?php
$render->renderAssets($assets,'demo');
?>
<style>
body { font-size: 12px; }
</style>
</head>
<body>

<div id="accordion">
  <h3>Section 1</h3>
  <div>
    <p>
    Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer
    ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit
    amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut
    odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.
    </p>
  </div>
  <h3>Section 2</h3>
  <div>
    <p>
    Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet
    purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor
    velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In
    suscipit faucibus urna.
    </p>
  </div>
  <h3>Section 3</h3>
  <div>
    <p>
    Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis.
    Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero
    ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis
    lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.
    </p>
    <ul>
      <li>List item one</li>
      <li>List item two</li>
      <li>List item three</li>
    </ul>
  </div>
  <h3>Section 4</h3>
  <div>
    <p>
    Cras dictum. Pellentesque habitant morbi tristique senectus et netus
    et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in
    faucibus orci luctus et ultrices posuere cubilia Curae; Aenean lacinia
    mauris vel est.
    </p>
    <p>
    Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus.
    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
    inceptos himenaeos.
    </p>
  </div>
</div>

<div id="dialog-confirm" title="Assets Compliation Succeed!">
  <p><span class="ui-icon ui-icon-alert" style="float: left; margin: 0 7px 20px 0;"></span>
  If you see this dialog, it means the compilation succeed, you may check public/assets/compiled directory to see the compiled assets.
  </p>
</div>

</body>
</html>
