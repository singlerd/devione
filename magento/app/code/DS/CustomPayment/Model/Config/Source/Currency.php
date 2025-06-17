<?php
namespace DS\CustomPayment\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;

class Currency implements ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'USD', 'label' => __('USD')],
            ['value' => 'EUR', 'label' => __('EUR')],
            ['value' => 'GBP', 'label' => __('GBP')],
        ];
    }
}