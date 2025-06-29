import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  type BrowserContext,
  dataProducts,
  foClassicHomePage,
  foClassicModalBlockCartPage,
  foClassicModalQuickViewPage,
  foClassicSearchResultsPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_classic_menuAndNavigation_navigationAndDisplay_quickViewProducts';

/*
- Go to FO > quick view the product demo_3 and check information
quick view the product demo_12 and check information
quick view the product demo_14 and check information
 */
describe('FO - Navigation and display : Quick view products', async () => {
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

  describe(`Quick view the product '${dataProducts.demo_3.name}'`, async () => {
    it('should open the shop page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToShopFO', baseContext);

      await foClassicHomePage.goTo(page, global.FO.URL);

      const result = await foClassicHomePage.isHomePage(page);
      expect(result).to.eq(true);
    });

    it(`should search for the product '${dataProducts.demo_3.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct1', baseContext);

      await foClassicHomePage.searchProduct(page, dataProducts.demo_3.name);

      const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_3.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct1', baseContext);

      await foClassicSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foClassicModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.eq(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation1', baseContext);

      const result = await foClassicModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_3.name),
        expect(result.price).to.equal(dataProducts.demo_3.finalPrice),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_3.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_3.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_3.thumbImage),
      ]);
    });

    it('should add product to cart and check that the block cart modal is visible', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnContinueShopping', baseContext);

      await foClassicModalQuickViewPage.addToCartByQuickView(page);

      const isVisible = await foClassicModalBlockCartPage.isBlockCartModalVisible(page);
      expect(isVisible).to.eq(true);
    });

    it('should click on continue shopping button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'continueShopping', baseContext);

      const isModalNotVisible = await foClassicModalBlockCartPage.continueShopping(page);
      expect(isModalNotVisible).to.eq(true);
    });
  });

  describe(`Quick view the product '${dataProducts.demo_12.name}'`, async () => {
    it(`should search for the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct2', baseContext);

      await foClassicHomePage.searchProduct(page, dataProducts.demo_12.name);

      const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct2', baseContext);

      await foClassicSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foClassicModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.eq(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation2', baseContext);

      const result = await foClassicModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_12.name),
        expect(result.price).to.equal(dataProducts.demo_12.price),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_12.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_12.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_12.thumbImage),
      ]);
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal1', baseContext);

      const isQuickViewModalClosed = await foClassicModalQuickViewPage.closeQuickViewModal(page);
      expect(isQuickViewModalClosed).to.eq(true);
    });
  });

  describe(`Quick view the product '${dataProducts.demo_14.name}'`, async () => {
    it(`should search for the product '${dataProducts.demo_12.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'searchProduct3', baseContext);

      await foClassicHomePage.searchProduct(page, dataProducts.demo_14.name);

      const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
      expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);
    });

    it(`should quick view the product '${dataProducts.demo_14.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'quickViewProduct3', baseContext);

      await foClassicSearchResultsPage.quickViewProduct(page, 1);

      const isModalVisible = await foClassicModalQuickViewPage.isQuickViewProductModalVisible(page);
      expect(isModalVisible).to.eq(true);
    });

    it('should check product information', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkProductInformation3', baseContext);

      const result = await foClassicModalQuickViewPage.getProductDetailsFromQuickViewModal(page);
      await Promise.all([
        expect(result.name).to.equal(dataProducts.demo_14.name),
        expect(result.price).to.equal(dataProducts.demo_14.price),
        expect(result.taxShippingDeliveryLabel).to.equal('Tax included'),
        expect(result.shortDescription).to.equal(dataProducts.demo_14.summary),
        expect(result.coverImage).to.contains(dataProducts.demo_14.coverImage),
        expect(result.thumbImage).to.contains(dataProducts.demo_14.thumbImage),
      ]);
    });

    it('should check that \'Add to cart\' button is disabled', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddToCartButton', baseContext);

      const isEnabled = await foClassicModalQuickViewPage.isAddToCartButtonEnabled(page);
      expect(isEnabled, 'Add to cart button is not disabled').to.eq(false);
    });

    it('should close the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeModal2', baseContext);

      const isQuickViewModalClosed = await foClassicModalQuickViewPage.closeQuickViewModal(page);
      expect(isQuickViewModalClosed).to.eq(true);
    });
  });
});
