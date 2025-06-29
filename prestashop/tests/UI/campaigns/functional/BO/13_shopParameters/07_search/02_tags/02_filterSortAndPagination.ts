import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  boDashboardPage,
  boLoginPage,
  boSearchPage,
  boTagsPage,
  boTagsCreatePage,
  type BrowserContext,
  dataLanguages,
  dataProducts,
  FakerSearchTag,
  type Page,
  utilsCore,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_shopParameters_search_tags_filterSortAndPagination';

/*
Create 21 tags
Filter tags by : Id, Language, Name, Products
Sort tags by : Id, Language, Name, Products
Pagination next and previous
Delete by bulk actions
 */
describe('BO - Shop Parameters - Search : Filter, sort and pagination tag in BO', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfTags: number = 0;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

    await boLoginPage.goTo(page, global.BO.URL);
    await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

    const pageTitle = await boDashboardPage.getPageTitle(page);
    expect(pageTitle).to.contains(boDashboardPage.pageTitle);
  });

  it('should go to \'ShopParameters > Search\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSearchPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.shopParametersParentLink,
      boDashboardPage.searchLink,
    );

    const pageTitle = await boSearchPage.getPageTitle(page);
    expect(pageTitle).to.contains(boSearchPage.pageTitle);
  });

  it('should go to \'Tags\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToTagsPage', baseContext);

    await boSearchPage.goToTagsPage(page);
    numberOfTags = await boTagsPage.getNumberOfElementInGrid(page);

    const pageTitle = await boTagsPage.getPageTitle(page);
    expect(pageTitle).to.contains(boTagsPage.pageTitle);
  });

  // 1 - Create tag
  describe('Create 21 tags in BO', async () => {
    const creationTests: number[] = new Array(21).fill(0, 0, 21);

    creationTests.forEach((test: number, index: number) => {
      const tagData: FakerSearchTag = new FakerSearchTag({
        name: `todelete${index}`,
        language: dataLanguages.english.name,
        products: dataProducts.demo_19.name,
      });

      it('should go to add new tag page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToAddTagPage${index}`, baseContext);

        await boTagsPage.goToAddNewTagPage(page);

        const pageTitle = await boTagsCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boTagsCreatePage.pageTitleCreate);
      });

      it(`should create tag n° ${index + 1} and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createTag${index}`, baseContext);

        const textResult = await boTagsCreatePage.setTag(page, tagData);
        expect(textResult).to.contains(boTagsPage.successfulCreationMessage);

        const numberOfElementAfterCreation = await boTagsPage.getNumberOfElementInGrid(page);
        expect(numberOfElementAfterCreation).to.be.equal(numberOfTags + 1 + index);
      });
    });
  });

  // 2 - Filter tags
  describe('Filter tags table', async () => {
    const tests = [
      {args: {testIdentifier: 'filterById', filterBy: 'id_tag', filterValue: '5'}},
      {args: {testIdentifier: 'filterByLanguage', filterBy: 'l!name', filterValue: dataLanguages.english.name}},
      {args: {testIdentifier: 'filterByName', filterBy: 'a!name', filterValue: 'todelete10'}},
      {args: {testIdentifier: 'filterByProducts', filterBy: 'products', filterValue: '0'}},
    ];

    tests.forEach((test) => {
      it(`should filter by ${test.args.filterBy} '${test.args.filterValue}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        await boTagsPage.filterTable(page, test.args.filterBy, test.args.filterValue);

        const numberOfLinesAfterFilter = await boTagsPage.getNumberOfElementInGrid(page);
        expect(numberOfLinesAfterFilter).to.be.at.most(numberOfTags + 21);

        for (let row = 1; row <= numberOfLinesAfterFilter; row++) {
          const textColumn = await boTagsPage.getTextColumn(page, row, test.args.filterBy);
          expect(textColumn).to.contains(test.args.filterValue);
        }
      });

      it('should reset all filters', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `${test.args.testIdentifier}Reset`, baseContext);

        const numberOfLinesAfterReset = await boTagsPage.resetAndGetNumberOfLines(page);
        expect(numberOfLinesAfterReset).to.equal(numberOfTags + 21);
      });
    });
  });

  // 3 - Sort tags table
  describe('Sort tags table', async () => {
    const sortTests = [
      {
        args: {
          testIdentifier: 'sortByIdDesc', sortBy: 'id_tag', sortDirection: 'down', isFloat: true,
        },
      },
      {
        args: {
          testIdentifier: 'sortByLanguageAsc', sortBy: 'l!name', sortDirection: 'up',
        },
      },
      {
        args: {
          testIdentifier: 'sortByLanguageDesc', sortBy: 'l!name', sortDirection: 'down',
        },
      },
      {
        args: {
          testIdentifier: 'sortByNameAsc', sortBy: 'a!name', sortDirection: 'up',
        },
      },
      {
        args: {
          testIdentifier: 'sortByNameDesc', sortBy: 'a!name', sortDirection: 'down',
        },
      },
      {
        args: {
          testIdentifier: 'sortByProductAsc', sortBy: 'products', sortDirection: 'up', isFloat: true,
        },
      },
      {
        args: {
          testIdentifier: 'sortByProductDesc', sortBy: 'products', sortDirection: 'down', isFloat: true,
        },
      },
      {
        args: {
          testIdentifier: 'sortByIdAsc', sortBy: 'id_tag', sortDirection: 'up', isFloat: true,
        },
      },
    ];

    sortTests.forEach((test) => {
      it(`should sort by '${test.args.sortBy}' '${test.args.sortDirection}' and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boTagsPage.getAllRowsColumnContent(page, test.args.sortBy);

        await boTagsPage.sortTable(page, test.args.sortBy, test.args.sortDirection);

        const sortedTable = await boTagsPage.getAllRowsColumnContent(page, test.args.sortBy);

        if (test.args.isFloat) {
          const nonSortedTableFloat: number[] = nonSortedTable.map((text: string): number => parseFloat(text));
          const sortedTableFloat: number[] = sortedTable.map((text: string): number => parseFloat(text));

          const expectedResult: number[] = await utilsCore.sortArrayNumber(nonSortedTableFloat);

          if (test.args.sortDirection === 'up') {
            expect(sortedTableFloat).to.deep.equal(expectedResult);
          } else {
            expect(sortedTableFloat).to.deep.equal(expectedResult.reverse());
          }
        } else {
          const expectedResult = await utilsCore.sortArray(nonSortedTable);

          if (test.args.sortDirection === 'up') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        }
      });
    });
  });

  // 4 - Pagination
  describe('Pagination next and previous', async () => {
    it('should change the items number to 20 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo20', baseContext);

      const paginationNumber = await boTagsPage.selectPaginationLimit(page, 20);
      expect(paginationNumber).to.equal('1');
    });

    it('should click on next', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNext', baseContext);

      const paginationNumber = await boTagsPage.paginationNext(page);
      expect(paginationNumber).to.equal('2');
    });

    it('should click on previous', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnPrevious', baseContext);

      const paginationNumber = await boTagsPage.paginationPrevious(page);
      expect(paginationNumber).to.equal('1');
    });

    it('should change the items number to 50 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemNumberTo50', baseContext);

      const paginationNumber = await boTagsPage.selectPaginationLimit(page, 50);
      expect(paginationNumber).to.equal('1');
    });
  });

  // 5 : Delete tags created by bulk actions
  describe('Delete tags with Bulk Actions', async () => {
    it('should filter list by name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterForBulkDelete', baseContext);

      await boTagsPage.filterTable(page, 'a!name', 'todelete');

      const numberOfLinesAfterFilter = await boTagsPage.getNumberOfElementInGrid(page);

      for (let i = 1; i <= numberOfLinesAfterFilter; i++) {
        const textColumn = await boTagsPage.getTextColumn(page, i, 'a!name');
        expect(textColumn).to.contains('todelete');
      }
    });

    it('should delete tags with Bulk Actions and check result', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'bulkDeleteTags', baseContext);

      const deleteTextResult = await boTagsPage.bulkDelete(page);
      expect(deleteTextResult).to.be.contains(boTagsPage.successfulMultiDeleteMessage);
    });
  });
});
