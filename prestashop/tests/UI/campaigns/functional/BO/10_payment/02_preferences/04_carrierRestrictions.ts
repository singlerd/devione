import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  boDashboardPage,
  boLoginPage,
  boPaymentPreferencesPage,
  type BrowserContext,
  dataCustomers,
  foClassicCartPage,
  foClassicCheckoutPage,
  foClassicHomePage,
  foClassicLoginPage,
  foClassicProductPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_payment_preferences_carrierRestrictions';

describe('BO - Payment - Preferences : Configure carrier restrictions and check FO', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('Login into FO', async () => {
    it('should go to FO page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToFO', baseContext);

      await foClassicHomePage.goToFo(page);
      await foClassicHomePage.changeLanguage(page, 'en');

      const isHomePage = await foClassicHomePage.isHomePage(page);
      expect(isHomePage, 'Fail to open FO home page').to.eq(true);
    });

    it('should go to login page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToLoginPageFO', baseContext);

      await foClassicHomePage.goToLoginPage(page);

      const pageTitle = await foClassicLoginPage.getPageTitle(page);
      expect(pageTitle, 'Fail to open FO login page').to.contains(foClassicLoginPage.pageTitle);
    });

    it('should sign in with default customer', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'sighInFO', baseContext);

      await foClassicLoginPage.customerLogin(page, dataCustomers.johnDoe);

      const isCustomerConnected = await foClassicLoginPage.isCustomerConnected(page);
      expect(isCustomerConnected, 'Customer is not connected').to.eq(true);
    });
  });

  describe('Configure carrier restrictions', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Payment > Preferences\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToPreferencesPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.paymentParentLink,
        boDashboardPage.preferencesLink,
      );
      await boPaymentPreferencesPage.closeSfToolBar(page);

      const pageTitle = await boPaymentPreferencesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boPaymentPreferencesPage.pageTitle);
    });

    [
      {args: {action: 'uncheck', paymentModule: 'ps_wirepayment', exist: false}},
      {args: {action: 'check', paymentModule: 'ps_wirepayment', exist: true}},
      {args: {action: 'uncheck', paymentModule: 'ps_checkpayment', exist: false}},
      {args: {action: 'check', paymentModule: 'ps_checkpayment', exist: true}},
    ].forEach((test, index: number) => {
      it(`should ${test.args.action} free prestashop carrier for '${test.args.paymentModule}'`, async function () {
        await testContext.addContextItem(
          this,
          'testIdentifier',
          test.args.action + test.args.paymentModule,
          baseContext,
        );

        const result = await boPaymentPreferencesPage.setCarrierRestriction(
          page,
          0,
          test.args.paymentModule,
          test.args.exist,
        );
        expect(result).to.contains(boPaymentPreferencesPage.successfulUpdateMessage);
      });

      it('should view my shop', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `viewMyShop${index}`, baseContext);

        // Click on view my shop
        page = await boPaymentPreferencesPage.viewMyShop(page);
        // Change language in FO
        await foClassicHomePage.changeLanguage(page, 'en');

        const pageTitle = await foClassicHomePage.getPageTitle(page);
        expect(pageTitle).to.contains(foClassicHomePage.pageTitle);
      });

      it('should add the first product to the cart and proceed to checkout', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `addProductToCart${index}`, baseContext);

        // Go to the first product page
        await foClassicHomePage.goToProductPage(page, 1);
        // Add the product to the cart
        await foClassicProductPage.addProductToTheCart(page);
        // Proceed to checkout the shopping cart
        await foClassicCartPage.clickOnProceedToCheckout(page);

        const isCheckoutPage = await foClassicCheckoutPage.isCheckoutPage(page);
        expect(isCheckoutPage).to.eq(true);
      });

      it('should continue to delivery step', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToDeliveryStep${index}`, baseContext);

        // Address step - Go to delivery step
        const isStepAddressComplete = await foClassicCheckoutPage.goToDeliveryStep(page);
        expect(isStepAddressComplete, 'Step Address is not complete').to.eq(true);
      });

      it('should continue to payment step and check the existence of payment method', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkPaymentMethod${index}`, baseContext);

        // Delivery step - Go to payment step
        const isStepDeliveryComplete = await foClassicCheckoutPage.goToPaymentStep(page);
        expect(isStepDeliveryComplete, 'Step Address is not complete').to.eq(true);

        // Payment step - Check payment method
        const isVisible = await foClassicCheckoutPage.isPaymentMethodExist(page, test.args.paymentModule);
        expect(isVisible).to.be.equal(test.args.exist);
      });

      it('should go back to BO', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goBackToBo${index}`, baseContext);

        // Close current tab
        page = await foClassicHomePage.closePage(browserContext, page, 0);

        const pageTitle = await boPaymentPreferencesPage.getPageTitle(page);
        expect(pageTitle).to.contains(boPaymentPreferencesPage.pageTitle);
      });
    });
  });
});
