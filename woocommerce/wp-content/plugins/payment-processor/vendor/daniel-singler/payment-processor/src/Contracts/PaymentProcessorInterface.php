<?php

namespace PaymentProcessor\Contracts;

interface PaymentProcessorInterface 
{
    public function getRate(string $currency, float $value): float;
}