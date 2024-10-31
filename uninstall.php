<?php
/**
 * Trigger this file on Plugin uninstall
 *
 * @package Qalam
 *
 */

defined('WP_UNINSTALL_PLUGIN') or die("you can't access this file");

//clear DB Stored data
foreach (wp_load_alloptions() as $option => $value) {
    if (strpos($option, 'qalam_') !== false) {
        delete_option($option);
        // for site options in Multisite
        delete_site_option($option);
    }
}

