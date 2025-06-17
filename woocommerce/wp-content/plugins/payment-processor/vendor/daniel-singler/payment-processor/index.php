<?php

require 'vendor/autoload.php';

use PaymentProcessor\PaymentProcessor;
use PaymentProcessor\Rules\DefaultCurrencyRule;

$client = new PaymentProcessor('A123', new DefaultCurrencyRule());
echo "Rate (USD): " . $client->getRate('USD', 10.0) . PHP_EOL;
echo "<br />";
$client2 = new PaymentProcessor('a123');
echo "Rate (EUR): " . $client2->getRate('EUR', 10.0) . PHP_EOL;
echo "<br />";
$client2 = new PaymentProcessor('123');
echo "Rate (EUR): " . $client2->getRate('EUR', 10.0) . PHP_EOL;