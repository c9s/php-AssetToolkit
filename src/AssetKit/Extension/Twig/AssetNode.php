<?php
namespace AssetKit\Extension\Twig;
use Twig_Node;
use Twig_Compiler;
use Twig_Node_Expression;
use Twig_Node_Expression_Array;
use Twig_Node_Expression_Constant;

class AssetNode extends Twig_Node
{

    public function __construct($attributes, $lineno, $tag = null)
    {
        parent::__construct(array(), $attributes, $lineno, $tag);
    }

    public function compile(Twig_Compiler $compiler)
    {
        $compiler->addDebugInfo($this);

        $assets = $this->getAttribute('assets');
        $target = $this->getAttribute('target');
        $compiler->raw("\$extension = \$this->getEnvironment()->getExtension('AssetKit');\n");
        $compiler->raw("\$assetloader = \$extension->getAssetLoader();\n");
        $compiler->raw("\$assetrender = \$extension->getAssetRender();\n");
        $compiler->raw("\$assets = array();\n");
        foreach($assets as $asset) {
            if (is_string($asset)) {

                $compiler->raw("\$assets[] = \$assetloader->load('$asset');\n");

            } else if ($asset instanceof Twig_Node_Expression_Constant) {

                $compiler->raw("\$assets[] = \$assetloader->load(");
                $compiler->subcompile($asset);
                $compiler->raw(");\n");

            } else if ($asset instanceof Twig_Node_Expression_Array) {
                $pairs = $asset->getKeyValuePairs();
                foreach ($pairs as $pair) {
                    $compiler->raw('$assets[] = $assetloader->load(');
                    $compiler->subcompile($pair['value']);
                    $compiler->raw(");\n");
                }
            }
        }
        $compiler->raw('$assetrender->renderAssets($assets');
        if ($target) {
            $compiler->raw(', ');
            $compiler->subcompile($target);
        }
        $compiler->raw(');');
    }

    /*
    public function __construct($assetNames, $lineno, $tag = null)
    {
        parent::__construct(array('assetNames' => $assetNames), array( ), $lineno, $tag);
    }

    public function compile(Twig_Compiler $compiler)
    {
        $compiler->addDebugInfo($this)
            ->write('// what the fuck');
            ->write('$context[\''.$this->getAttribute('name').'\'] = ')
            ->subcompile($this->getNode('value'))
            ->raw(";\n")
        ;
    }
    */
}




