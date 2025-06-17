<?php

namespace Drupal\custom_payment\Plugin\Commerce\PaymentGateway;

use Drupal\commerce_payment\Plugin\Commerce\PaymentGateway\OffsitePaymentGatewayBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides the Custom Payment gateway.
 *
 * @CommercePaymentGateway(
 *   id = "custom_payment",
 *   label = "Custom Payment (API)",
 *   display_label = "Custom Payment",
 *   forms = {
 *     "offsite-payment" = "Drupal\custom_payment\Form\CustomPaymentForm"
 *   },
 *   payment_method_types = {"credit_card"},
 *   modes = {
 *     "test" = @Translation("Test")
 *   }
 * )
 */
class CustomPayment extends OffsitePaymentGatewayBase
{

  public function defaultConfiguration()
  {
    return parent::defaultConfiguration() + [
      'api_key' => '',
      'payment_method_types' => ['credit_card'],
    ];
  }

  public function buildConfigurationForm(array $form, FormStateInterface $form_state)
  {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['api_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('API Key'),
      '#default_value' => $this->configuration['api_key'] ?? '',
      '#required' => TRUE,
    ];

    return $form;
  }

  public function submitConfigurationForm(array &$form, FormStateInterface $form_state)
  {
    parent::submitConfigurationForm($form, $form_state);
    $this->configuration['api_key'] = $form_state->getValue('configuration')['custom_payment']['api_key'] ?? '';
  }
}
