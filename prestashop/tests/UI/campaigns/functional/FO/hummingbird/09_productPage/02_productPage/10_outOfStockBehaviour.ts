import testContext from '@utils/testContext';
import {expect} from 'chai';

import {deleteProductTest} from '@commonTests/BO/catalog/product';
import {enableHummingbird, disableHummingbird} from '@commonTests/BO/design/hummingbird';

import {
  boDashboardPage,
  boLoginPage,
  boProductsPage,
  boProductsCreatePage,
  boProductsCreateTabStocksPage,
  boStockMovementsPage,
  type BrowserContext,
  FakerProduct,
  foHummingbirdModalBlockCartPage,
  foHummingbirdProductPage,
  type Page,
  utilsDate,
  utilsFile,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_FO_hummingbird_productPage_productPage_outOfStockBehaviour';

describe('FO - Product page - Product page : Out of stock behaviour', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  const todayDate: string = utilsDate.getDateFormat('yyyy-mm-dd');

  // Data to create new product
  const newProductData: FakerProduct = new FakerProduct({
    name: 'test',
    type: 'standard',
    quantity: 300,
    minimumQuantity: 0,
    status: true,
  });

  // Pre-condition : Install Hummingbird
  enableHummingbird(`${baseContext}_preTest`);

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);

    if (newProductData.coverImage) {
      await utilsFile.generateImage(newProductData.coverImage);
    }
    if (newProductData.thumbImage) {
      await utilsFile.generateImage(newProductData.thumbImage);
    }
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);

    if (newProductData.coverImage) {
      await utilsFile.deleteFile(newProductData.coverImage);
    }
    if (newProductData.thumbImage) {
      await utilsFile.deleteFile(newProductData.thumbImage);
    }
  });

  describe('Check out of stock behaviour', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Catalog > Products\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToProductsPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.catalogParentLink,
        boDashboardPage.productsLink,
      );

      await boProductsPage.closeSfToolBar(page);

      const pageTitle = await boProductsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsPage.pageTitle);
    });

    it('should click on \'New product\' button and check new product modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNewProductButton', baseContext);

      const isModalVisible = await boProductsPage.clickOnNewProductButton(page);
      expect(isModalVisible).to.equal(true);
    });

    it('should choose \'Standard product\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'chooseStandardProduct', baseContext);

      await boProductsPage.selectProductType(page, newProductData.type);

      const productTypeDescription = await boProductsPage.getProductDescription(page);
      expect(productTypeDescription).to.contains(boProductsPage.standardProductDescription);
    });

    it('should go to new product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToNewProductPage', baseContext);

      await boProductsPage.clickOnAddNewProduct(page);

      const pageTitle = await boProductsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
    });

    it('should create the product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createPackOfProducts', baseContext);

      await boProductsCreatePage.closeSfToolBar(page);

      const createProductMessage = await boProductsCreatePage.setProduct(page, newProductData);
      expect(createProductMessage).to.equal(boProductsCreatePage.successfulUpdateMessage);
    });

    it('should go to the Stocks tab', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToStocksTab', baseContext);

      await boProductsCreatePage.goToTab(page, 'stock');

      const isTabActive = await boProductsCreatePage.isTabActive(page, 'stock');
      expect(isTabActive).to.equal(true);
    });

    it('should click on View all stock movements', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickViewAllStockMovements', baseContext);

      page = await boProductsCreateTabStocksPage.clickViewAllStockMovements(page);

      const pageTitle = await boStockMovementsPage.getPageTitle(page);
      expect(pageTitle).to.equal(boStockMovementsPage.pageTitle);
    });

    it('should close the Stock Movements page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeStockMovementsPage', baseContext);

      page = await boStockMovementsPage.closePage(browserContext, page, 0);

      const pageTitle = await boProductsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
    });

    it('should fill Stocks values', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'fillStockValues', baseContext);

      await boProductsCreateTabStocksPage.setMinimalQuantity(page, 5);
      await boProductsCreateTabStocksPage.setStockLocation(page, 'Second floor');
      await boProductsCreateTabStocksPage.setLowStockAlertByEmail(page, true, 3);

      const message = await boProductsCreatePage.saveProduct(page);
      expect(message).to.equal(boProductsCreatePage.successfulUpdateMessage);
    });

    it('should fill When out of stock values', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'fillWhenOutOfStockValues', baseContext);

      await boProductsCreateTabStocksPage.setLabelWhenInStock(page, 'In stock');
      await boProductsCreateTabStocksPage.setLabelWhenOutOfStock(page, 'Out of stock');
      await boProductsCreateTabStocksPage.setAvailabilityDate(page, todayDate);

      const message = await boProductsCreatePage.saveProduct(page);
      expect(message).to.equal(boProductsCreatePage.successfulUpdateMessage);
    });

    it('should preview product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'previewProduct', baseContext);

      page = await boProductsCreatePage.previewProduct(page);

      const pageTitle = await foHummingbirdProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(newProductData.name);
    });

    it('should check the label \'In stock\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkLabelInStock', baseContext);

      const productAvailability = await foHummingbirdProductPage.getProductAvailabilityLabel(page);
      expect(productAvailability).to.contains('In stock');
    });

    it('should check the notification of minimum purchase order quantity', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkNotificationMinimumPurchase', baseContext);

      const minimumPurchaseLabel = await foHummingbirdProductPage.getMinimalProductQuantityLabel(page);
      expect(minimumPurchaseLabel).to.contains('The minimum purchase order quantity for the product is 5.');
    });

    it('should click on add to cart button', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnAddToCartButton', baseContext);

      // Add the product to the cart
      await foHummingbirdProductPage.clickOnAddToCartButton(page);

      const notificationsNumber = await foHummingbirdProductPage.getCartNotificationsNumber(page);
      expect(notificationsNumber).to.equal(5);
    });

    it('should close the blockCart modal by clicking outside the modal', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'closeBlockCartModal2', baseContext);

      const isQuickViewModalClosed = await foHummingbirdModalBlockCartPage.closeBlockCartModal(page, true);
      expect(isQuickViewModalClosed).to.equal(true);
    });

    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBackOffice', baseContext);

      // Go back to BO
      page = await foHummingbirdProductPage.closePage(browserContext, page, 0);

      const pageTitle = await boProductsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
    });

    it('should check the deny orders option', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDenyOrder', baseContext);

      await boProductsCreateTabStocksPage.setQuantityDelta(page, -300);
      await boProductsCreateTabStocksPage.setOptionWhenOutOfStock(page, 'Deny orders');

      const createProductMessage = await boProductsCreatePage.saveProduct(page);
      expect(createProductMessage).to.equal(boProductsCreatePage.successfulUpdateMessage);
    });

    it('should preview product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'previewProduct2', baseContext);

      // Click on preview button
      page = await boProductsCreatePage.previewProduct(page);

      const pageTitle = await foHummingbirdProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(newProductData.name);
    });

    it('should check that the Add to cart Button is disabled', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'tryAddProductToCart', baseContext);

      const isAddToCartButtonEnabled = await foHummingbirdProductPage.isAddToCartButtonEnabled(page);
      expect(isAddToCartButtonEnabled).to.equal(false);

      const productAvailability = await foHummingbirdProductPage.getProductAvailabilityLabel(page);
      expect(productAvailability).to.contains('Out of stock');
    });

    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goBackToBackOffice2', baseContext);

      // Go back to BO
      page = await foHummingbirdProductPage.closePage(browserContext, page, 0);

      const pageTitle = await boProductsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boProductsCreatePage.pageTitle);
    });

    it('should check the allow orders option and set Label when out of stock', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAllowOrder', baseContext);

      await boProductsCreateTabStocksPage.setOptionWhenOutOfStock(page, 'Allow orders');

      const createProductMessage = await boProductsCreatePage.saveProduct(page);
      expect(createProductMessage).to.equal(boProductsCreatePage.successfulUpdateMessage);
    });

    it('should preview product', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'previewProduct3', baseContext);

      // Click on preview button
      page = await boProductsCreatePage.previewProduct(page);

      const pageTitle = await foHummingbirdProductPage.getPageTitle(page);
      expect(pageTitle).to.contains(newProductData.name);
    });

    it('should check that the Add to cart Button is enabled and check the availability icon', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'addProductToCart', baseContext);

      const isAddToCartButtonEnabled = await foHummingbirdProductPage.isAddToCartButtonEnabled(page);
      expect(isAddToCartButtonEnabled).to.be.equal(true);

      const productAvailability = await foHummingbirdProductPage.getProductAvailabilityLabel(page);
      expect(productAvailability).to.be.contains('Out of stock');
    });
  });

  // Post-condition : Uninstall Hummingbird
  disableHummingbird(`${baseContext}_postTest_1`);

  // Post-condition: Delete created product
  deleteProductTest(newProductData, `${baseContext}_postTest_2`);
});
