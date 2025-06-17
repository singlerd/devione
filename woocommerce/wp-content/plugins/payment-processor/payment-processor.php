

<?php

/**
 * Plugin Name: DS Payment Processor
 * Description: Displays a converted total at WooCommerce checkout using PaymentProcessor.
 * Version: 1.0
 * Author: Daniel Singler
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

use PaymentProcessor\PaymentProcessor as DSPaymentProcessor;

add_filter('woocommerce_get_settings_pages', function ($settings): array {
    require_once __DIR__ . '/settings/class-wc-settings-payment-processor.php';
    $settings[] = new WC_Settings_Payment_Processor();
    return $settings;
});

add_action('woocommerce_cart_calculate_fees', function ($cart): void {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (!WC()->cart) return;

    $api_key = get_option('payment_processor_api_key', 'A123');
    $currency = get_option('payment_processor_currency', 'EUR');

    try {
        $client = new DSPaymentProcessor($api_key);
        $cart_total = (float) $cart->get_cart_contents_total();
        $converted = $client->getRate($currency, $cart_total);

        $adjustment = $converted - $cart_total;

        $label = __('Currency Adjustment (' . strtoupper($currency) . ' )', 'woocommerce');

        $cart->add_fee($label, $adjustment, true, '');
    } catch (Throwable $e) {
        error_log('PaymentProcessor error: ' . $e->getMessage());
    }
}, 20, 1);

function custom_iframe_shortcode($atts) {
    $attributes = shortcode_atts(
        array(
            'src' => '',
            'width' => '100%',
            'height' => '450',
            'scrolling' => 'no',
            'frameborder' => '0',
            'allowfullscreen' => 'allowfullscreen'
        ),
        $atts
    );
    
    return '<iframe src="' . esc_url($attributes['src']) . '" 
                   width="' . esc_attr($attributes['width']) . '" 
                   height="' . esc_attr($attributes['height']) . '" 
                   scrolling="' . esc_attr($attributes['scrolling']) . '" 
                   frameborder="' . esc_attr($attributes['frameborder']) . '"
                   ' . esc_attr($attributes['allowfullscreen']) . '></iframe>';
}
add_shortcode('iframe', 'custom_iframe_shortcode');