import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  boBrandAdressesCreatePage,
  boBrandsCreatePage,
  boBrandsPage,
  boBrandsViewPage,
  boDashboardPage,
  boLoginPage,
  type BrowserContext,
  FakerBrand,
  FakerBrandAddress,
  type Page,
  utilsFile,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_catalog_brandsAndSuppliers_brands_CRUDBrandAndAddress';

// CRUD Brand And Address
describe('BO - Catalog - Brands & suppliers : CRUD Brand and Address', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfBrands: number = 0;
  let numberOfBrandsAddresses: number = 0;

  const brandsTable: string = 'manufacturer';
  const addressesTable: string = 'manufacturer_address';
  const createBrandData: FakerBrand = new FakerBrand();
  const editBrandData: FakerBrand = new FakerBrand();
  const createBrandAddressData: FakerBrandAddress = new FakerBrandAddress({
    brandName: createBrandData.name,
    country: 'United States',
  });
  const editBrandAddressData: FakerBrandAddress = new FakerBrandAddress({
    brandName: editBrandData.name,
    country: 'France',
  });

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);

    // Create logos
    await Promise.all([
      utilsFile.generateImage(createBrandData.logo),
      utilsFile.generateImage(editBrandData.logo),
    ]);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);

    await Promise.all([
      utilsFile.deleteFile(createBrandData.logo),
      utilsFile.deleteFile(editBrandData.logo),
    ]);
  });

  it('should login in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

    await boLoginPage.goTo(page, global.BO.URL);
    await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

    const pageTitle = await boDashboardPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDashboardPage.pageTitle);
  });

  // GO to Brands Page
  it('should go to \'Catalog > Brands & Suppliers\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToBrandsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.catalogParentLink,
      boDashboardPage.brandsAndSuppliersLink,
    );
    await boBrandsPage.closeSfToolBar(page);

    const pageTitle = await boBrandsPage.getPageTitle(page);
    expect(pageTitle).to.contains(boBrandsPage.pageTitle);
  });

  it('should reset all filters', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFiltersFirst', baseContext);

    numberOfBrands = await boBrandsPage.resetAndGetNumberOfLines(page, brandsTable);
    expect(numberOfBrands).to.be.above(0);

    numberOfBrandsAddresses = await boBrandsPage.resetAndGetNumberOfLines(page, addressesTable);
    expect(numberOfBrandsAddresses).to.be.above(0);
  });

  // 1: Create Brand
  describe('Create Brand', async () => {
    it('should go to new brand page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddBrandPage', baseContext);

      await boBrandsPage.goToAddNewBrandPage(page);

      const pageTitle = await boBrandsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandsCreatePage.pageTitle);
    });

    it('should create brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createBrand', baseContext);

      const result = await boBrandsCreatePage.createEditBrand(page, createBrandData);
      expect(result).to.equal(boBrandsPage.successfulCreationMessage);

      const numberOfBrandsAfterCreation = await boBrandsPage.getNumberOfElementInGrid(page, brandsTable);
      expect(numberOfBrandsAfterCreation).to.be.equal(numberOfBrands + 1);
    });
  });

  // 2: Create Address for this Brand
  describe('Create Address associated to created Brand', async () => {
    it('should go to new brand address page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToAddAddressPage', baseContext);

      await boBrandsPage.goToAddNewBrandAddressPage(page);

      const pageTitle = await boBrandAdressesCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandAdressesCreatePage.pageTitle);
    });

    it('should create brand address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'createAddress', baseContext);

      const result = await boBrandAdressesCreatePage.createEditBrandAddress(page, createBrandAddressData);
      expect(result).to.equal(boBrandsPage.successfulCreationMessage);

      const numberOfBrandsAddressesAfterCreation = await boBrandsPage.getNumberOfElementInGrid(page, addressesTable);

      createBrandData.addresses += 1;
      expect(numberOfBrandsAddressesAfterCreation).to.be.equal(numberOfBrandsAddresses + 1);
    });
  });

  // 3 : View Brand and check Address Value in list
  describe('View Brand and check Address Value in list', async () => {
    it('should filter Brand list by name of brand created', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToViewCreatedBrand', baseContext);

      await boBrandsPage.filterBrands(page, 'input', 'name', createBrandData.name);

      const numberOfBrandsAfterFilter = await boBrandsPage.getNumberOfElementInGrid(page, brandsTable);
      expect(numberOfBrandsAfterFilter).to.be.at.most(numberOfBrands);

      const textColumn = await boBrandsPage.getTextColumnFromTableBrands(page, 1, 'name');
      expect(textColumn).to.contains(createBrandData.name);
    });

    it('should view brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'viewCreatedBrand', baseContext);

      await boBrandsPage.viewBrand(page, 1);

      const pageTitle = await boBrandsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(createBrandData.name);
    });

    it('should check existence of the associated address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddressOnCreatedBrand', baseContext);

      const numberOfAddressesInGrid = await boBrandsViewPage.getNumberOfAddressesInGrid(page);
      expect(numberOfAddressesInGrid).to.equal(createBrandData.addresses);

      const textColumn = await boBrandsViewPage.getTextColumnFromTableAddresses(page, 1, 1);
      expect(textColumn).to.contains(`${createBrandAddressData.firstName} ${createBrandAddressData.lastName}`);
    });

    it('should return brands Page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToBrandsPageAfterViewCreatedBrand', baseContext);

      await boBrandsViewPage.goToPreviousPage(page);

      const pageTitle = await boBrandsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandsPage.pageTitle);
    });

    it('should reset brands filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterViewCreatedBrand', baseContext);

      const numberOfBrandsAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, brandsTable);
      expect(numberOfBrandsAfterReset).to.be.equal(numberOfBrands + 1);
    });
  });

  // 4: Update Brand and verify Brand in Addresses list
  describe('Update Brand and verify Brand in Addresses list', async () => {
    it('should filter Brand list by name of brand created', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToUpdateBrand', baseContext);

      await boBrandsPage.filterBrands(page, 'input', 'name', createBrandData.name);

      const numberOfBrandsAfterFilter = await boBrandsPage.getNumberOfElementInGrid(page, brandsTable);
      expect(numberOfBrandsAfterFilter).to.be.at.most(numberOfBrands);

      const textColumn = await boBrandsPage.getTextColumnFromTableBrands(page, 1, 'name');
      expect(textColumn).to.contains(createBrandData.name);
    });

    it('should go to edit brand page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToEditBrandPage', baseContext);

      await boBrandsPage.goToEditBrandPage(page, 1);

      const pageTitle = await boBrandsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandsCreatePage.pageTitleEdit);
    });

    it('should edit brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'updateBrand', baseContext);

      const result = await boBrandsCreatePage.createEditBrand(page, editBrandData);
      expect(result).to.equal(boBrandsPage.successfulUpdateMessage);

      editBrandData.addresses += 1;
    });

    it('should check the updated Brand in Addresses list', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddressesListAfterUpdate', baseContext);

      await boBrandsPage.filterAddresses(page, 'input', 'name', editBrandData.name);

      const textColumn = await boBrandsPage.getTextColumnFromTableAddresses(page, 1, 'name');
      expect(textColumn).to.contains(editBrandData.name);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterAfterUpdateBrand', baseContext);

      // Reset Filter Brands
      const numberOfBrandsAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, brandsTable);
      expect(numberOfBrandsAfterReset).to.be.equal(numberOfBrands + 1);

      // Reset Filter Brand Address
      const numberOfBrandsAddressesAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, addressesTable);
      expect(numberOfBrandsAddressesAfterReset).to.be.equal(numberOfBrandsAddresses + 1);
    });
  });

  // 5: Update Address
  describe('Update Address', async () => {
    it('should filter Brand Address list by name of edited brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToUpdateAddress', baseContext);

      await boBrandsPage.filterAddresses(page, 'input', 'name', editBrandData.name);

      const textColumn = await boBrandsPage.getTextColumnFromTableAddresses(page, 1, 'name');
      expect(textColumn).to.contains(editBrandData.name);
    });

    it('should go to edit brand address page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToEditAddressPage', baseContext);

      await boBrandsPage.goToEditBrandAddressPage(page, 1);

      const pageTitle = await boBrandsCreatePage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandsCreatePage.pageTitleEdit);
    });

    it('should edit brand address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'updateAddress', baseContext);

      const result = await boBrandAdressesCreatePage.createEditBrandAddress(page, editBrandAddressData);
      expect(result).to.equal(boBrandsPage.successfulUpdateMessage);
    });

    it('should reset Brand Addresses filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterUpdateAddress', baseContext);

      const numberOfBrandsAddressesAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, addressesTable);
      expect(numberOfBrandsAddressesAfterReset).to.be.equal(numberOfBrandsAddresses + 1);
    });
  });
  // 6 : View Brand and check Address Value in list
  describe('View Brand and check Address Value in list', async () => {
    it('should filter Brand list by name of brand created', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToViewUpdatedBrand', baseContext);

      await boBrandsPage.filterBrands(page, 'input', 'name', editBrandData.name);

      const numberOfBrandsAfterFilter = await boBrandsPage.getNumberOfElementInGrid(page, brandsTable);
      expect(numberOfBrandsAfterFilter).to.be.at.most(numberOfBrands);

      const textColumn = await boBrandsPage.getTextColumnFromTableBrands(page, 1, 'name');
      expect(textColumn).to.contains(editBrandData.name);
    });

    it('should view brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'viewUpdatedBrand', baseContext);

      await boBrandsPage.viewBrand(page, 1);

      const pageTitle = await boBrandsViewPage.getPageTitle(page);
      expect(pageTitle).to.contains(editBrandData.name);
    });

    it('should check existence of the associated address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkAddressOnUpdatedBrand', baseContext);

      const numberOfAddressesInGrid = await boBrandsViewPage.getNumberOfAddressesInGrid(page);
      expect(numberOfAddressesInGrid).to.equal(editBrandData.addresses);

      const textColumn = await boBrandsViewPage.getTextColumnFromTableAddresses(page, 1, 1);
      expect(textColumn).to.contains(`${editBrandAddressData.firstName} ${editBrandAddressData.lastName}`);
    });

    it('should go back to brands Page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToBrandsPageAfterViewEditedBrand', baseContext);

      await boBrandsViewPage.goToPreviousPage(page);

      const pageTitle = await boBrandsPage.getPageTitle(page);
      expect(pageTitle).to.contains(boBrandsPage.pageTitle);
    });

    it('should reset filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterViewUpdatedBrand', baseContext);

      const numberOfBrandsAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, brandsTable);
      expect(numberOfBrandsAfterReset).to.be.equal(numberOfBrands + 1);
    });
  });

  // 7 : Delete Brand and verify that Address has no Brand associated
  describe('Delete Brand and verify that Address has no Brand associated', async () => {
    it('should filter Brand list by name of edited brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToDeleteBrand', baseContext);

      await boBrandsPage.filterBrands(page, 'input', 'name', editBrandData.name);

      const numberOfBrandsAfterFilter = await boBrandsPage.getNumberOfElementInGrid(page, brandsTable);
      expect(numberOfBrandsAfterFilter).to.be.at.most(numberOfBrands);

      const textColumn = await boBrandsPage.getTextColumnFromTableBrands(page, 1, 'name');
      expect(textColumn).to.contains(editBrandData.name);
    });

    it('should delete brand', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteBrand', baseContext);

      const result = await boBrandsPage.deleteBrand(page, 1);
      expect(result).to.be.equal(boBrandsPage.successfulDeleteMessage);
    });

    it('should check that the Brand Address is deleted successfully', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkDeletedBrandOnAddressList', baseContext);

      await boBrandsPage.filterAddresses(page, 'input', 'firstname', editBrandAddressData.firstName);
      await boBrandsPage.filterAddresses(page, 'input', 'lastname', editBrandAddressData.lastName);

      const textColumn = await boBrandsPage.getTextColumnFromTableAddresses(page, 1, 'name');
      expect(textColumn).to.contains('--');
    });

    it('should reset filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetBrandsListAfterDelete', baseContext);

      const numberOfBrandsAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, brandsTable);
      expect(numberOfBrandsAfterReset).to.be.equal(numberOfBrands);
    });
  });

  // 8 : Delete Address
  describe('Delete brand Address', async () => {
    it('should filter Brand Address list by firstName and lastName', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToDeleteAddress', baseContext);

      await boBrandsPage.filterAddresses(page, 'input', 'firstname', editBrandAddressData.firstName);
      await boBrandsPage.filterAddresses(page, 'input', 'lastname', editBrandAddressData.lastName);

      const textColumnFirstName = await boBrandsPage.getTextColumnFromTableAddresses(page, 1, 'firstname');
      expect(textColumnFirstName).to.contains(editBrandAddressData.firstName);

      const textColumnLastName = await boBrandsPage.getTextColumnFromTableAddresses(page, 1, 'lastname');
      expect(textColumnLastName).to.contains(editBrandAddressData.lastName);
    });

    it('should delete Brand Address', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'deleteAddress', baseContext);

      const result = await boBrandsPage.deleteBrandAddress(page, 1);
      expect(result).to.be.equal(boBrandsPage.successfulDeleteMessage);
    });

    it('should reset filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAddressesListAfterDelete', baseContext);

      const numberOfBrandsAddressesAfterReset = await boBrandsPage.resetAndGetNumberOfLines(page, addressesTable);
      expect(numberOfBrandsAddressesAfterReset).to.be.equal(numberOfBrandsAddresses);
    });
  });
});
