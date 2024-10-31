<?php
/**
 * Plugin Name:       Qalam
 * Description:       Qalam helps you to write clear, effective texts that are free from spelling and grammatical errors, using the latest artificial intelligence technologies and Arabic language processing.
 * Version:           1.0.4
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Qalam
 * Author URI:        https://qalam.ai/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       qalam
 */
/*
Qalam is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

Qalam is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Qalam. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/

// Make sure we don't expose any info if called directly

defined('ABSPATH') or die("you can't access this file");
if (!function_exists('add_action')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}

if (!class_exists('Qalam')) {
    class Qalam
    {
        const PATH_MODE = "path";
        const QUERY_MODE = "query";

        private $plugin;
        private $clientId;
        private $documentIdSource;
        private $documentSourceValue;
        private $allowedToUse;

        public function __construct()
        {
            $this->plugin = plugin_basename(__FILE__);

            $this->clientId = get_option('qalam_client_id');
            $this->documentIdSource = get_option('qalam_document_id_source');
            $this->documentSourceValue = trim(get_option('qalam_document_source_value'));
            $this->allowedToUse = get_option('qalam_allowed_to_use');
        }

        function activate()
        {
            $this->default_value();
        }

        function deactivate()
        {
        }

        private function default_value()
        {
            if ($this->documentIdSource == ""){
		update_option('qalam_document_id_source', self::QUERY_MODE);
		$this->documentIdSource = self::QUERY_MODE;
	    }	


            if ($this->documentSourceValue == "" && $this->documentIdSource == self::QUERY_MODE)
                update_option('qalam_document_source_value', "post");

            if ($this->allowedToUse == "")
                update_option('qalam_allowed_to_use', "admin");
        }


        function register()
        {
            //add settings link and insert params in writing page;
            //admin only can show and edit settings
            if (is_admin()) {
                add_action('admin_menu', array($this, 'add_settings_page'));
                add_action('admin_init', array($this, 'register_settings'));
//                all setting links to plugin page.
                add_filter('plugin_action_links_' . $this->plugin, array($this, 'setting_link'));
            }
            //checking before loading JS
            if ($this->clientId != "" && $this->can_use()) {
//              import CDN and Js files
                add_action('admin_enqueue_scripts', array($this, 'enqueue'));
            }
        }

        private function can_use(): bool
        {
            if ($this->allowedToUse == 'admin' || $this->allowedToUse == "")
                return is_admin();
            elseif ($this->allowedToUse == 'all')
                return true;
            else
                return false;
        }

        function enqueue()
        {
            wp_enqueue_script('qalamMain', plugins_url('assets/js/main.js?v1.1.0', __FILE__));
            $scriptData = array(
                'clientId' => esc_attr($this->clientId),
                'documentIdSource' => esc_attr($this->documentIdSource),
                'documentSourceValue' => esc_attr($this->documentSourceValue),
                'assetsPath' => esc_attr(plugins_url('assets', __FILE__)),
            );
            wp_enqueue_script('qalamscript', plugins_url('assets/js/script.js', __FILE__));
            wp_localize_script('qalamscript', 'settings', $scriptData);
        }

        function setting_link($links)
        {
            $setting_link = "<a href='options-general.php?page=qalam-plugin'>Settings</a>";
            array_push($links, $setting_link);
            return $links;
        }

        function add_settings_page()
        {
            add_options_page('Qalam Settings',
                'Qalam Plugin',
                'manage_options',
                'qalam-plugin',
                array($this, 'render_plugin_settings_page'));
        }

        function render_plugin_settings_page()
        {
            ?>
            <h1>Qalam Plugin Settings</h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('qalam_options');
                do_settings_sections('qalam_options'); ?>
                <input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e('Save'); ?>"/>
            </form>
            <?php
        }

        function register_settings()
        {

            add_settings_section(
                'qalam_settings_section',
                'Qalam Settings Section',
                array($this, 'settings_section_callback'),
                'qalam_options'
            );

            register_setting('qalam_options', 'qalam_client_id');
            register_setting('qalam_options', 'qalam_document_id_source');
            register_setting('qalam_options', 'qalam_document_source_value');
            register_setting('qalam_options', 'qalam_allowed_to_use');

            add_settings_field(
                'qalam_client_id',
                'Client ID', array($this, 'settings_client_id_callback'),
                'qalam_options',
                'qalam_settings_section'
            );
            add_settings_field(
                'qalam_document_id_source',
                'Document ID Source', array($this, 'settings_document_id_callback'),
                'qalam_options',
                'qalam_settings_section'
            );
            add_settings_field(
                'qalam_document_source_value',
                'Document Source Value', array($this, 'settings_document_value_callback'),
                'qalam_options',
                'qalam_settings_section'
            );
            add_settings_field(
                'qalam_allowed_to_use',
                'Allowed Users Roles', array($this, 'settings_allowed_to_use_callback'),
                'qalam_options',
                'qalam_settings_section'
            );
        }

        function settings_section_callback()
        {
            echo '<p id="qalam_section">Welcome to Qalam Settings Section. Here you can manage your Client ID and other configurations. If the Client ID is missing and/or you needed any support, please contact us via: <a href= "https://qalam.ai/contact">Contact Us </a></p>';
        }

        function settings_client_id_callback()
        {
            ?>
            <input type="text" name="qalam_client_id"
                   value="<?php echo isset($this->clientId) ? esc_attr($this->clientId) : ''; ?>">
            <?php
        }

        function settings_document_id_callback()
        {
            ?>

            <input type="radio" id="qalam_document_query" name="qalam_document_id_source"
                   value="query" <?php if (isset($this->documentIdSource) && esc_attr($this->documentIdSource) == "query") {
            echo 'checked';
        } ?> ">
            <label for="qalam_document_query">Query</label><br><br>

            <input type="radio" id="qalam_document_path" name="qalam_document_id_source"
                   value="path" <?php if (isset($this->documentIdSource) && esc_attr($this->documentIdSource) == "path") {
                echo 'checked';
            } ?>>
            <label for="qalam_document_path">Path</label><br><br>

            <input type="radio" id="qalam_document_none" name="qalam_document_id_source"
                   value="none" <?php if ((isset($this->documentIdSource) && esc_attr($this->documentIdSource) == "none")) {
                echo 'checked';
            } ?>>
            <label for="qalam_document_none">None</label><br>
            <?php
        }

        function settings_document_value_callback()
        {
            ?>
            <input type="text" name="qalam_document_source_value"
                   value="<?php echo isset($this->documentSourceValue) ? esc_attr($this->documentSourceValue) : ''; ?>">
            <?php
        }

        function settings_allowed_to_use_callback()
        {
            ?>
            <input type="radio" id="qalam_allowed_to_use_admin" name="qalam_allowed_to_use"
                   value="admin" <?php if (isset($this->allowedToUse) && esc_attr($this->allowedToUse) == "admin") {
                echo 'checked';
            } ?>>
            <label for="qalam_allowed_to_use_admin">Administrators Only</label><br><br>
            
            <input type="radio" id="qalam_allowed_to_use_all" name="qalam_allowed_to_use"
                   value="all" <?php if (isset($this->allowedToUse) && esc_attr($this->allowedToUse) == "all") {
            echo 'checked';
        } ?> ">
            <label for="qalam_allowed_to_use_all">All Roles</label><br>
            <?php
        }
    }

    $qalam = new Qalam();
    $qalam->register();

    //activation
    register_activation_hook(__FILE__, [$qalam, 'activate']);

    //deactivation
    register_deactivation_hook(__FILE__, [$qalam, 'deactivate']);


}
