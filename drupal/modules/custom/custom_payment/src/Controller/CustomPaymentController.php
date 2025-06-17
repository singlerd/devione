<?php

declare(strict_types=1);

namespace Drupal\custom_payment\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use PaymentProcessor\PaymentProcessor as Client;
use Symfony\Component\HttpFoundation\Request;

/**
 * Returns responses for Custom Payment routes.
 */
final class CustomPaymentController extends ControllerBase {

  public function getRate(Request $request): JsonResponse
  {
    $currency = $request->query->get('currency');
    $amount = $request->query->get('amount');

    if (!$currency || !$amount || !is_numeric($amount)) {
      return new JsonResponse([
        'status' => 'error',
        'message' => 'Missing or invalid currency/amount'
      ], 400);
    }

    $client = new Client('a123');
    $converted = $client->getRate($currency, (float) $amount);

    return new JsonResponse([
      'statuus' => 'success',
      'original_amount' => $amount,
      'currency' => $currency,
      'converted_amount' => $converted,
    ]);
  }

}
