import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  boCMSPagesPage,
  boCMSPagesCreatePage,
  boDashboardPage,
  boLoginPage,
  type BrowserContext,
  FakerCMSPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_design_pages_pages_pagination';

/*
Create 11 pages
Paginate between pages
 */
describe('BO - design - Pages : Pagination of Pages table', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfPages: number = 0;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  // Pre-condition : Create 11 pages
  describe('PRE-TEST: Create 11 pages in BO', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Design > Pages\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCmsPagesPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.designParentLink,
        boDashboardPage.pagesLink,
      );
      await boCMSPagesPage.closeSfToolBar(page);

      const pageTitle = await boCMSPagesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCMSPagesPage.pageTitle);
    });

    it('should reset all filters and get number of pages in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterFirst', baseContext);

      numberOfPages = await boCMSPagesPage.resetAndGetNumberOfLines(page, 'cms_page');
      if (numberOfPages !== 0) {
        expect(numberOfPages).to.be.above(0);
      }
    });

    const tests = new Array(11).fill(0, 0, 11);
    tests.forEach((test: number, index: number) => {
      const createPageData: FakerCMSPage = new FakerCMSPage({title: `todelete${index}`});

      it('should go to add new page page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToNewPagePage${index}`, baseContext);

        await boCMSPagesPage.goToAddNewPage(page);

        const pageTitle = await boCMSPagesCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boCMSPagesCreatePage.pageTitleCreate);
      });

      it(`should create page n°${index + 1}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createPage${index}`, baseContext);

        const textResult = await boCMSPagesCreatePage.createEditPage(page, createPageData);
        expect(textResult).to.equal(boCMSPagesPage.successfulCreationMessage);
      });
    });

    it('should check the pages number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'checkPagesNumber', baseContext);

      const numberOfPagesAfterCreation = await boCMSPagesPage.getNumberOfElementInGrid(page, 'cms_page');
      expect(numberOfPagesAfterCreation).to.be.equal(numberOfPages + 11);
    });
  });

  // Test pagination
  describe('Pagination next and previous', async () => {
    it('should change the items number to 10 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemsNumberTo10', baseContext);

      const paginationNumber = await boCMSPagesPage.selectPagesPaginationLimit(page, 10);
      expect(paginationNumber).to.contain('(page 1 / 2)');
    });

    it('should click on next', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNext', baseContext);

      const paginationNumber = await boCMSPagesPage.paginationPagesNext(page);
      expect(paginationNumber).to.contain('(page 2 / 2)');
    });

    it('should click on previous', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnPrevious', baseContext);

      const paginationNumber = await boCMSPagesPage.paginationPagesPrevious(page);
      expect(paginationNumber).to.contain('(page 1 / 2)');
    });

    it('should change the items number to 50 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemsNumberTo50', baseContext);

      const paginationNumber = await boCMSPagesPage.selectPagesPaginationLimit(page, 50);
      expect(paginationNumber).to.contain('(page 1 / 1)');
    });
  });

  // POST-TEST : Delete the 11 pages with bulk actions
  describe('POST-TEST: Delete pages with Bulk Actions', async () => {
    it('should filter list by title', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterForBulkDelete', baseContext);

      await boCMSPagesPage.filterTable(page, 'cms_page', 'input', 'meta_title', 'todelete');

      const textResult = await boCMSPagesPage.getTextColumnFromTableCmsPage(page, 1, 'meta_title');
      expect(textResult).to.contains('todelete');
    });

    it('should delete pages', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'BulkDelete', baseContext);

      const deleteTextResult = await boCMSPagesPage.deleteWithBulkActions(page, 'cms_page');
      expect(deleteTextResult).to.be.equal(boCMSPagesPage.successfulMultiDeleteMessage);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterDelete', baseContext);

      const numberOfPagesAfterFilter = await boCMSPagesPage.resetAndGetNumberOfLines(page, 'cms_page');
      expect(numberOfPagesAfterFilter).to.be.equal(numberOfPages);
    });
  });
});
