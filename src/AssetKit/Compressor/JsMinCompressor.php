<?php
namespace AssetKit\Compressor;
use AssetKit\Process;
use AssetKit\JSMin;
use RuntimeException;

class JsMinCompressor
{
    public $bin;

    public function __construct($bin = null)
    {
        if ($bin) {
            $this->bin = $bin;
        }
    }
    
    public function compress(Collection $collection)
    {
        // C version jsmin is faster,
        $content = $collection->getContent();
        if ( $this->bin ) {
            $proc = new Process(array($this->bin));
            $code = $proc->input($content)->run();
            if ( $code != 0 ) {
                throw new RuntimeException("JsminCompressor failure: $code");
            }
            $content = $proc->getOutput();
        } elseif ( extension_loaded('jsmin') ) {
            $content = jsmin( $content );
        } else {
            // pure php jsmin
            $content = JSMin::minify( $content );
        }
        $collection->setContent($content);
    }
}



