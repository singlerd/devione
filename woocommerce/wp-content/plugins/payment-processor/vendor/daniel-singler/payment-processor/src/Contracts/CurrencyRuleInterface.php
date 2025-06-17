<?php

namespace PaymentProcessor\Contracts;

interface CurrencyRuleInterface 
{
    public function apply(string $currency, float $value): float;
}