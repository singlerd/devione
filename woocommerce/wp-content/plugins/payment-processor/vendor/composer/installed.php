<?php return array(
    'root' => array(
        'name' => 'daniel-singler/payment-processor-plugin',
        'pretty_version' => '1.0.0+no-version-set',
        'version' => '1.0.0.0',
        'reference' => null,
        'type' => 'wordpress-plugin',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'dev' => true,
    ),
    'versions' => array(
        'daniel-singler/payment-processor' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'reference' => 'b8aa1a6828cbe914ea265675e68af0bf12992185',
            'type' => 'library',
            'install_path' => __DIR__ . '/../daniel-singler/payment-processor',
            'aliases' => array(
                0 => '9999999-dev',
            ),
            'dev_requirement' => false,
        ),
        'daniel-singler/payment-processor-plugin' => array(
            'pretty_version' => '1.0.0+no-version-set',
            'version' => '1.0.0.0',
            'reference' => null,
            'type' => 'wordpress-plugin',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
    ),
);
