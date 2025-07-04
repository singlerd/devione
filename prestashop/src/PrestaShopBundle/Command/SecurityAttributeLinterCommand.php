<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

namespace PrestaShopBundle\Command;

use InvalidArgumentException;
use PrestaShopBundle\Routing\Linter\AdminRouteProvider;
use PrestaShopBundle\Routing\Linter\Exception\LinterException;
use PrestaShopBundle\Routing\Linter\SecurityAttributeLinter;
use RuntimeException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Routing\Route;

/**
 * Checks if all admin routes have #[AdminSecurity] configured
 *
 * @see \PrestaShopBundle\Security\Attribute\AdminSecurity
 */
final class SecurityAttributeLinterCommand extends Command
{
    public const ACTION_LIST_ALL = 'list';
    public const ACTION_FIND_MISSING = 'find-missing';
    /**
     * @var AdminRouteProvider
     */
    private $adminRouteProvider;

    /**
     * @var SecurityAttributeLinter
     */
    private $securityAttributeLinter;

    /**
     * @var array
     */
    private const EXCEPTION_ROUTES = [
        'admin_category_simple_add_form',
        'admin_common_notifications',
        'admin_common_notifications_ack',
        'admin_common_pagination',
        'admin_common_reset_search',
        'admin_common_reset_search_by_filter_id',
        'admin_common_secured_file_image_reader',
        'admin_common_sidebar',
        'admin_currencies_update_live_exchange_rates',
        'admin_emails_send_test',
        'admin_employees_change_form_language',
        'admin_employees_edit',
        'admin_employees_toggle_navigation',
        'admin_feature_get_feature_values',
        'admin_homepage',
        'admin_import_data_configuration_index_redirect',
        'admin_import_file_upload',
        'admin_legacy_controller_route', // Internal check of permission not based on attributes
        'admin_login',
        'admin_logout',
        'admin_module_import',
        'admin_module_manage_action',
        'admin_module_manage_action_bulk',
        'admin_module_manage_update_all',
        'admin_module_notification_count',
        'admin_product_form',
        'admin_product_new',
        'admin_request_password_reset',
        'admin_reset_password',
        'admin_security_compromised',
        'admin_shops_search',
        'admin_theme_customize_layouts',
    ];

    public function __construct(AdminRouteProvider $adminRouteProvider, SecurityAttributeLinter $securityAttributeLinter)
    {
        parent::__construct();
        $this->adminRouteProvider = $adminRouteProvider;
        $this->securityAttributeLinter = $securityAttributeLinter;
    }

    /**
     * @param string $expression
     *
     * @return string
     */
    public static function parseExpression($expression)
    {
        $pattern1 = '#\[(.*)\]#';
        $pattern2 = '#is_granted\((.*),#';
        $matches1 = [];
        $matches2 = [];
        preg_match($pattern1, $expression, $matches1);

        if (count($matches1) > 1) {
            return $matches1[1];
        }
        preg_match($pattern2, $expression, $matches2);
        if (count($matches2) > 1) {
            return $matches2[1];
        }

        return '';
    }

    /**
     * @return string[]
     */
    public static function getAvailableActions()
    {
        return [self::ACTION_LIST_ALL, self::ACTION_FIND_MISSING];
    }

    /**
     * {@inheritdoc}
     */
    public function configure()
    {
        $description = 'Checks if Back Office route controllers has configured Security annotations.';
        $actionDescription = sprintf(
            'Action to perform, must be one of: %s',
            implode(', ', self::getAvailableActions())
        );

        $this
            ->setName('prestashop:linter:security-attribute')
            ->setDescription($description)
            ->addArgument('action', InputArgument::REQUIRED, $actionDescription);
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $actionToPerform = $input->getArgument('action');

        if (!in_array($actionToPerform, self::getAvailableActions())) {
            throw new InvalidArgumentException(sprintf(
                'Action must be one of: %s',
                implode(', ', self::getAvailableActions())
            )
            );
        }

        switch ($actionToPerform) {
            case self::ACTION_LIST_ALL:
                $this->listAllRoutesAndRelatedPermissions($input, $output);
                break;
            case self::ACTION_FIND_MISSING:
                if ($this->findRoutesWithMissingSecurityAttributes($input, $output)) {
                    return 1;
                }
                break;

            default:
                throw new RuntimeException(sprintf('Unknown action %s', $actionToPerform));
        }

        return 0;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    private function listAllRoutesAndRelatedPermissions(InputInterface $input, OutputInterface $output)
    {
        $listing = [];

        foreach ($this->adminRouteProvider->getRoutes() as $route) {
            /* @var Route $route */
            try {
                $attributes = $this->securityAttributeLinter->getRouteSecurityAttributes($route);

                foreach ($attributes as $attribute) {
                    $listing[] = [
                        $route->getDefault('_controller'),
                        implode(', ', $route->getMethods()),
                        'Yes',
                        self::parseExpression($attribute->getAttribute()),
                    ];
                }
            } catch (LinterException) {
                $listing[] = [
                    $route->getDefault('_controller'),
                    implode(', ', $route->getMethods()),
                    'No',
                    '',
                ];
            }
        }

        $io = new SymfonyStyle($input, $output);
        $headers = ['Controller action', 'Methods', 'Is secured ?', 'Permissions'];

        $io->table($headers, $listing);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    private function findRoutesWithMissingSecurityAttributes(InputInterface $input, OutputInterface $output): bool
    {
        $notConfiguredRoutes = [];

        /** @var Route $route */
        foreach ($this->adminRouteProvider->getRoutes() as $routeName => $route) {
            if (in_array($routeName, self::EXCEPTION_ROUTES)) {
                continue;
            }
            try {
                $this->securityAttributeLinter->lint($routeName, $route);
            } catch (LinterException) {
                $notConfiguredRoutes[] = $routeName;
            }
        }

        $io = new SymfonyStyle($input, $output);

        if (!empty($notConfiguredRoutes)) {
            $io->warning(sprintf(
                '%s routes are not configured with #[AdminSecurity] attribute:',
                count($notConfiguredRoutes)
            ));
            $io->listing($notConfiguredRoutes);

            return true;
        }

        $io->success('All admin routes are secured with #[AdminSecurity].');

        return false;
    }
}
