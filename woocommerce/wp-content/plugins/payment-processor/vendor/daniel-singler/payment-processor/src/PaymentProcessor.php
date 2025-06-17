<?php

namespace PaymentProcessor;

use PaymentProcessor\Rules\DefaultCurrencyRule;
use PaymentProcessor\Contracts\CurrencyRuleInterface;
use PaymentProcessor\Contracts\PaymentProcessorInterface;
use InvalidArgumentException;

class PaymentProcessor implements PaymentProcessorInterface
{
    private string $apiKey;
    private CurrencyRuleInterface $currencyRule;

    public function __construct(string $apiKey, ?CurrencyRuleInterface $currencyRule = null)
    {
        $this->apiKey = $apiKey;
        $this->currencyRule = $currencyRule ?? new DefaultCurrencyRule();
    }

    public function getRate(string $currency, float $value): float
    {
        $base = match (true) {
            ctype_upper($this->apiKey[0]) => $value * 115,
            ctype_lower($this->apiKey[0]) => $value * 58,
            default => throw new InvalidArgumentException('Invalid API key format.')
        };

        return $this->currencyRule->apply($currency, $base);
    }
}