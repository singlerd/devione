<?php
namespace DS\CustomPayment\Model\Payment;

use Magento\Payment\Model\Method\AbstractMethod;
use Magento\Framework\Exception\LocalizedException;

class Simple extends AbstractMethod
{
    protected $_code = 'simple';
    protected $_isGateway = true;
    protected $_canCapture = true;
    protected $_canCapturePartial = true;
    protected $_canUseCheckout = true;
    protected $_canUseInternal = true;
    protected $_canRefund = true;
    protected $_canRefundInvoicePartial = true;
    protected $_supportedCurrencyCodes = ['USD'];

    public function authorize($payment, $amount) {
        if (!$this->canAuthorize()) throw new LocalizedException(__('Authorization not available.'));
        return $this;
    }

    public function capture($payment, $amount) {
        if (!$this->canCapture()) throw new LocalizedException(__('Capture not available.'));
        return $this;
    }

    public function refund($payment, $amount) {
        if (!$this->canRefund()) throw new LocalizedException(__('Refund not available.'));
        return $this;
    }
}
