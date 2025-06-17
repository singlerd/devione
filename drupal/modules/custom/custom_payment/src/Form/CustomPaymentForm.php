<?php

namespace Drupal\custom_payment\Form;

use Drupal\commerce_payment\PluginForm\PaymentOffsiteForm;
use Drupal\Core\Form\FormStateInterface;
use PaymentProcessor\PaymentProcessor as Client;

class CustomPaymentForm extends PaymentOffsiteForm
{

  public function buildConfigurationForm(array $form, FormStateInterface $form_state)
  {
    $order = $this->entity->getOrder();
    $paymentGateway = $this->entity->getPaymentGateway();
    $apiKeyValue = $paymentGateway->getPlugin()->getConfiguration('api_key')['api_key'] ?? '';

    $client = new Client($apiKeyValue);
    $convertedValue = $client->getRate('EUR', $order->getTotalPrice()->getNumber());

    $form['converted_value'] = [
      '#markup' => "<p>Converted Amount: <strong>{$convertedValue}</strong></p>",
    ];

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Confirm Payment'),
    ];

    return $form;
  }

  public function submitConfigurationForm(array &$form, FormStateInterface $form_state)
  {
    $this->submitForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state)
  {
    // TODO; submit payment
  }
}
