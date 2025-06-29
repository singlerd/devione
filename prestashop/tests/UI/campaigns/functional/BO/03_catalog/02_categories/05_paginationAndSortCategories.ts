import testContext from '@utils/testContext';
import {expect} from 'chai';

// Import commonTests
import importFileTest from '@commonTests/BO/advancedParameters/importFile';
import bulkDeleteCategoriesTest from '@commonTests/BO/catalog/category';

import {
  boCategoriesPage,
  boDashboardPage,
  boLoginPage,
  type BrowserContext,
  type CategoryFilter,
  dataImportCategories,
  type Page,
  utilsCore,
  utilsFile,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_catalog_categories_paginationAndSortCategories';

/*
Pre-condition:
- Import list of categories
Scenario:
- Paginate between pages
- Sort categories table
Post-condition:
- Delete categories with bulk actions
 */
describe('BO - Catalog - Categories : Pagination and sort categories table', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfCategories: number = 0;

  // Variable used to create empty categories csv file
  const fileName: string = 'categories.csv';
  // Object used to delete imported categories
  const categoryData: CategoryFilter = {filterBy: 'name', value: 'category'};

  // Pre-condition: Import list of categories
  importFileTest(fileName, dataImportCategories.entity, `${baseContext}_preTest_1`);

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
    // Create csv file with all categories data
    await utilsFile.createCSVFile('.', fileName, dataImportCategories);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
    // Delete created csv file
    await utilsFile.deleteFile(fileName);
  });

  // 1 : Go to the categories page
  describe('Go to \'Catalog > Categories\' page', async () => {
    it('should login in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });

    it('should go to \'Catalog > Categories\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToCategoriesPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.catalogParentLink,
        boDashboardPage.categoriesLink,
      );
      await boDashboardPage.closeSfToolBar(page);

      const pageTitle = await boCategoriesPage.getPageTitle(page);
      expect(pageTitle).to.contains(boCategoriesPage.pageTitle);
    });

    it('should reset all filters and get number of categories in BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFirst', baseContext);

      numberOfCategories = await boCategoriesPage.resetAndGetNumberOfLines(page);
      expect(numberOfCategories).to.be.above(0);
    });
  });

  // 2 : Pagination
  describe('Pagination next and previous', async () => {
    it('should change the items number to 10 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo10', baseContext);

      const paginationNumber = await boCategoriesPage.selectPaginationLimit(page, 10);
      expect(paginationNumber).to.contains('(page 1 / 2)');
    });

    it('should click on next', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNext', baseContext);

      const paginationNumber = await boCategoriesPage.paginationNext(page);
      expect(paginationNumber).to.contains('(page 2 / 2)');
    });

    it('should click on previous', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnPrevious', baseContext);

      const paginationNumber = await boCategoriesPage.paginationPrevious(page);
      expect(paginationNumber).to.contains('(page 1 / 2)');
    });

    it('should change the items number to 50 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo50', baseContext);

      const paginationNumber = await boCategoriesPage.selectPaginationLimit(page, 50);
      expect(paginationNumber).to.contains('(page 1 / 1)');
    });
  });

  const tests = [
    {
      args:
        {
          testIdentifier: 'sortByIdDesc', sortBy: 'id_category', sortDirection: 'desc', isFloat: true,
        },
    },
    {
      args:
        {
          testIdentifier: 'sortByNameAsc', sortBy: 'name', sortDirection: 'asc', isFloat: false,
        },
    },
    {
      args:
        {
          testIdentifier: 'sortByNameDesc', sortBy: 'name', sortDirection: 'desc', isFloat: false,
        },
    },
    {
      args:
        {
          testIdentifier: 'sortByPositionDesc', sortBy: 'position', sortDirection: 'desc', isFloat: true,
        },
    },
    {
      args:
        {
          testIdentifier: 'sortByPositionAsc', sortBy: 'position', sortDirection: 'asc', isFloat: true,
        },
    },
    {
      args:
        {
          testIdentifier: 'sortByIdAsc', sortBy: 'id_category', sortDirection: 'asc', isFloat: true,
        },
    },
  ];

  // 3 : Sort categories
  describe('Sort categories table', async () => {
    tests.forEach((test) => {
      it(`should sort by '${test.args.sortBy}' '${test.args.sortDirection}' and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boCategoriesPage.getAllRowsColumnContent(page, test.args.sortBy);
        await boCategoriesPage.sortTable(page, test.args.sortBy, test.args.sortDirection);

        const sortedTable = await boCategoriesPage.getAllRowsColumnContent(page, test.args.sortBy);

        if (test.args.isFloat) {
          const nonSortedTableFloat: number[] = nonSortedTable.map((text: string): number => parseFloat(text));
          const sortedTableFloat: number[] = sortedTable.map((text: string): number => parseFloat(text));

          const expectedResult: number[] = await utilsCore.sortArrayNumber(nonSortedTableFloat);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTableFloat).to.deep.equal(expectedResult);
          } else {
            expect(sortedTableFloat).to.deep.equal(expectedResult.reverse());
          }
        } else {
          const expectedResult: string[] = await utilsCore.sortArray(nonSortedTable);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        }
      });
    });
  });

  // Pre-condition: Delete imported categories by bulk actions
  bulkDeleteCategoriesTest(categoryData, `${baseContext}_postTest_1`);
});
