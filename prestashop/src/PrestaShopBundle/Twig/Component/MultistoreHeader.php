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

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component;

use Doctrine\ORM\EntityManagerInterface;
use PrestaShop\PrestaShop\Adapter\LegacyContext;
use PrestaShop\PrestaShop\Core\Context\EmployeeContext;
use PrestaShop\PrestaShop\Core\Context\ShopContext;
use PrestaShop\PrestaShop\Core\Util\ColorBrightnessCalculator;
use PrestaShopBundle\Entity\ShopGroup;
use PrestaShopBundle\Twig\Layout\MenuBuilder;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/multistore_header.html.twig')]
class MultistoreHeader extends AbstractMultistoreHeader
{
    public function __construct(
        protected readonly MenuBuilder $menuBuilder,
        protected readonly array $controllersLockedToAllShopContext,
        ShopContext $shopContext,
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
        ColorBrightnessCalculator $colorBrightnessCalculator,
        LegacyContext $legacyContext,
        EmployeeContext $employeeContext,
    ) {
        parent::__construct(
            $shopContext,
            $entityManager,
            $translator,
            $colorBrightnessCalculator,
            $legacyContext,
            $employeeContext,
        );
    }

    public function mount(): void
    {
        if (!$this->isMultistoreUsed()) {
            return;
        }

        parent::doMount();
        if (!$this->isLockedToAllShopContext()) {
            $this->groupList = array_filter(
                $this->entityManager->getRepository(ShopGroup::class)->findBy(['active' => true]),
                function (ShopGroup $shopGroup) {
                    return !$shopGroup->getShops()->isEmpty() && $this->employeeContext->hasAuthorizationOnShopGroup($shopGroup->getId());
                },
            );

            // Filter not allowed shops
            foreach ($this->groupList as $group) {
                foreach ($group->getShops() as $shop) {
                    if (!$this->employeeContext->hasAuthorizationOnShop($shop->getId())) {
                        $group->getshops()->removeElement($shop);
                    }
                }
            }
        }
    }

    public function isLockedToAllShopContext(): bool
    {
        $controllerName = $this->menuBuilder->getLegacyControllerClassName();

        return in_array($controllerName, $this->controllersLockedToAllShopContext);
    }
}
