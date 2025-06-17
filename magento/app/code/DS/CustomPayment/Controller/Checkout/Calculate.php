<?php

namespace DS\CustomPayment\Controller\Checkout;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Checkout\Model\Session as CheckoutSession;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Store\Model\ScopeInterface;
use PaymentProcessor\PaymentProcessor as Client;

class Calculate extends Action
{
    protected $resultJsonFactory;
    protected $checkoutSession;
    protected $calculator;
    protected ScopeConfigInterface $scopeConfig;

    public function __construct(
        Context $context,
        JsonFactory $resultJsonFactory,
        CheckoutSession $checkoutSession,
        ScopeConfigInterface $scopeConfig
    ) {
        parent::__construct($context);
        $this->resultJsonFactory = $resultJsonFactory;
        $this->checkoutSession = $checkoutSession;
        $this->scopeConfig = $scopeConfig;
    }

    public function execute()
    {
        $apiKey = $this->scopeConfig->getValue(
            'payment/simple/api_key',
            ScopeInterface::SCOPE_STORE
        );

        $currency = $this->scopeConfig->getValue(
            'payment/simple/currency',
            ScopeInterface::SCOPE_STORE
        );

        $quote = $this->checkoutSession->getQuote();
        $total = (float) $quote->getGrandTotal();
        $currency = $quote->getQuoteCurrencyCode();

        $client = new Client($apiKey);
        $converted = $client->getRate($currency, $total);

        return $this->resultJsonFactory->create()->setData([
            'converted' => $converted,
            'currency' => $currency,
            'apiKey' => $apiKey,
        ]);
    }
}
