<?php

if (!defined('ABSPATH')) exit;

class WC_Settings_Payment_Processor extends WC_Settings_Page
{
    public function __construct()
    {
        $this->id = 'payment_processor';
        $this->label = __('DS Payment Processor', 'woocommerce');
        parent::__construct();
    }

    public function get_settings()
    {
        $iframe = '<iframe src="http://172.18.0.6:5173/" style="width:100%; height:700px; border:none;"></iframe>';

        return [
            [
                'title' => __('Payment Processor Settings', 'woocommerce'),
                'type'  => 'title',
                'id'    => 'payment_processor_settings'
            ],
            [
                'title' => 'Test',
                'type' => 'text',
                'name' => 'payment_processor_vue_app',
                'desc' => $iframe,
                // 'id' => 'payment_processor_vue_app'
            ],
            [
                'title'    => __('API Key', 'woocommerce'),
                'desc'     => __('Enter your PaymentProcessor API key.', 'woocommerce'),
                'id'       => 'payment_processor_api_key',
                'type'     => 'text',
                'default'  => '',
                'desc_tip' => true,
            ],
            [
                'title'    => __('Target Currency', 'woocommerce'),
                'desc'     => __('Currency to convert cart total into (e.g., USD, EUR).', 'woocommerce'),
                'id'       => 'payment_processor_currency',
                'type'     => 'text',
                'default'  => 'EUR',
                'desc_tip' => true,
            ],
            [
                'type' => 'sectionend',
                'id'   => 'payment_processor_settings'
            ],
        ];
    }
}