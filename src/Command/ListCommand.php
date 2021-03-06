<?php
namespace AssetKit\Command;
use AssetKit\Asset;
use AssetKit\AssetConfig;
use AssetKit\AssetLoader;
use AssetKit\FileUtils;
use AssetKit\Installer;
use AssetKit\LinkInstaller;
use CLIFramework\Command;
use Exception;

class ListCommand extends BaseCommand
{

    public function brief()
    {
        return 'List registered assets.';
    }

    public function options($opts)
    {
        parent::options($opts);
    }

    public function execute()
    {
        $config = $this->getAssetConfig();
        $loader = $this->getAssetLoader();
        // $loader->updateAssetManifests();

        $cwdLen =  strlen(getcwd()) + 1;

        $this->logger->info( sprintf("%d assets registered: ", count($loader->all()) ) );

        foreach( $loader->pairs() as $name => $stash ) {
            $asset = $loader->load($name);
            $this->logger->info( 
                sprintf('%12s | %2d collections | %s', 
                    $name, 
                    count($asset->getCollections()),
                    substr($asset->manifestFile, $cwdLen)   
                ), 1);
        }
    }
}



