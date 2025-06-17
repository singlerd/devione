<?php

use PHPUnit\Framework\TestCase;
use PaymentProcessor\PaymentProcessor;

class PaymentProcessorTest extends TestCase
{
    public function testUppercaseApiKey()
    {
        $processor = new PaymentProcessor('A123');
        $this->assertEquals(1150.0, $processor->getRate('USD', 10.0));
    }

    public function testLowercaseApiKey()
    {
        $processor = new PaymentProcessor('a123');
        $this->assertEquals(522.0, $processor->getRate('EUR', 10.0));
    }

    public function testCurrencyRuleIsApplied()
    {
        $processor = new PaymentProcessor('A123');
        $this->assertEquals(1150.0, $processor->getRate('USD', 10.0));
        $this->assertEquals(1035.0, $processor->getRate('EUR', 10.0));
    }

    public function testInvalidApiKeyThrowsException()
    {
        $this->expectException(\InvalidArgumentException::class);
        $client = new PaymentProcessor('');
        $client->getRate('USD', 10.0);

    }
}