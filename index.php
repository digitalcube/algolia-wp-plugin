<?php

/**
 * Algolia Design System for WordPress
 *
 * @package Algolia
 *
 * Plugin Name: Algolia for Elementor
 * Description: Algolia for Elementor
 * Plugin URI:  https://github.com/digitalcube/algolia-wp-plugin
 * Version:     0.0.0
 * Author:      DigitalCube
 * Author URI:  https://www.digitalcube.jp
 * Text Domain: algolia
 */

define('ALGOLIA', __FILE__);

/**
 * Include the Algolia class.
 */
require plugin_dir_path(ALGOLIA) . 'class-algolia.php';
