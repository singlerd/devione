<?php

namespace PaymentProcessor\Rules;

use PaymentProcessor\Contracts\CurrencyRuleInterface;

class DefaultCurrencyRule implements CurrencyRuleInterface {

    public function apply(string $currency, float $value): float
    {
        return match(strtoupper($currency)) {
            'USD' => $value * 1.0,
            'EUR' => $value * 0.9,
            'GBP' => $value * 0.8,
            default => $value,
        };
    }
}