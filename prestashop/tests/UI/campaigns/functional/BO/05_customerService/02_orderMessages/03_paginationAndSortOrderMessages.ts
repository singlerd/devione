import testContext from '@utils/testContext';
import {expect} from 'chai';

import {
  boDashboardPage,
  boLoginPage,
  boOrderMessagesPage,
  boOrderMessagesCreatePage,
  type BrowserContext,
  FakerOrderMessage,
  type Page,
  utilsCore,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_customerService_orderMessages_paginationAndSortOrderMessages';

/*
Create 11 order messages
Paginate between pages
Sort order messages table
Delete order messages with bulk actions
 */
describe('BO - Customer Service - Order Messages : Pagination and sort order messages', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfOrderMessages: number = 0;

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

  it('should go to \'Customer Message > Order Messages\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToOrderMessagesPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.customerServiceParentLink,
      boDashboardPage.orderMessagesLink,
    );
    await boDashboardPage.closeSfToolBar(page);

    const pageTitle = await boOrderMessagesPage.getPageTitle(page);
    expect(pageTitle).to.contains(boOrderMessagesPage.pageTitle);
  });

  it('should reset all filters and get number of order messages in BO', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFilterFirst', baseContext);

    numberOfOrderMessages = await boOrderMessagesPage.resetAndGetNumberOfLines(page);
    expect(numberOfOrderMessages).to.be.above(0);
  });

  describe('Create 10 order messages in BO', async () => {
    const tests: number[] = new Array(10).fill(0, 0, 10);
    tests.forEach((test: number, index: number) => {
      const createOrderMessageData: FakerOrderMessage = new FakerOrderMessage({
        name: `toSortAndPaginate${index}`,
      });

      it('should go to add new order message page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToNewOrderMessagePage${index}`, baseContext);

        await boOrderMessagesPage.goToAddNewOrderMessagePage(page);

        const pageTitle = await boOrderMessagesCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boOrderMessagesCreatePage.pageTitle);
      });

      it(`should create order message n°${index + 1}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createOrderMessage${index}`, baseContext);

        const textResult = await boOrderMessagesCreatePage.addEditOrderMessage(page, createOrderMessageData);
        expect(textResult).to.equal(boOrderMessagesPage.successfulCreationMessage);
      });

      it('should check the order messages number', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkOrderMessageNumber${index}`, baseContext);

        const numberOfOrderMessagesAfterCreation = await boOrderMessagesPage.getNumberOfElementInGrid(page);
        expect(numberOfOrderMessagesAfterCreation).to.be.equal(numberOfOrderMessages + 1 + index);
      });
    });
  });

  describe('Pagination next and previous', async () => {
    it('should change the items number to 10 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemsNumberTo10', baseContext);

      const paginationNumber = await boOrderMessagesPage.selectPaginationLimit(page, 10);
      expect(paginationNumber).to.contains('(page 1 / 2)');
    });

    it('should click on next', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnNext', baseContext);

      const paginationNumber = await boOrderMessagesPage.paginationNext(page);
      expect(paginationNumber).to.contains('(page 2 / 2)');
    });

    it('should click on previous', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'clickOnPrevious', baseContext);

      const paginationNumber = await boOrderMessagesPage.paginationPrevious(page);
      expect(paginationNumber).to.contains('(page 1 / 2)');
    });

    it('should change the items number to 50 per page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'changeItemsNumberTo50', baseContext);

      const paginationNumber = await boOrderMessagesPage.selectPaginationLimit(page, 50);
      expect(paginationNumber).to.contains('(page 1 / 1)');
    });
  });

  describe('Sort order messages table', async () => {
    const sortTests = [
      {
        args: {
          testIdentifier: 'sortByIDDesc', sortBy: 'id_order_message', sortDirection: 'desc', isFloat: true,
        },
      },
      {args: {testIdentifier: 'sortByNameDesc', sortBy: 'name', sortDirection: 'desc'}},
      {args: {testIdentifier: 'sortByNameAsc', sortBy: 'name', sortDirection: 'asc'}},
      {args: {testIdentifier: 'sortByMessageDesc', sortBy: 'message', sortDirection: 'desc'}},
      {args: {testIdentifier: 'sortByMessageAsc', sortBy: 'message', sortDirection: 'asc'}},
      {
        args: {
          testIdentifier: 'sortByIDAsc', sortBy: 'id_order_message', sortDirection: 'asc', isFloat: true,
        },
      },
    ];

    sortTests.forEach((test) => {
      it(`should sort by '${test.args.sortBy}' '${test.args.sortDirection}' and check result`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boOrderMessagesPage.getAllRowsColumnContent(page, test.args.sortBy);

        await boOrderMessagesPage.sortTable(page, test.args.sortBy, test.args.sortDirection);

        const sortedTable = await boOrderMessagesPage.getAllRowsColumnContent(page, test.args.sortBy);

        if (test.args.isFloat) {
          const nonSortedTableFloat: number[] = nonSortedTable.map((text: string): number => parseFloat(text));
          const sortedTableFloat: number[] = sortedTable.map((text: string): number => parseFloat(text));

          const expectedResult = await utilsCore.sortArrayNumber(nonSortedTableFloat);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTableFloat).to.deep.equal(expectedResult);
          } else {
            expect(sortedTableFloat).to.deep.equal(expectedResult.reverse());
          }
        } else {
          const expectedResult = await utilsCore.sortArray(nonSortedTable);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        }
      });
    });
  });

  describe('Delete order messages with Bulk Actions', async () => {
    it('should filter list by name', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterForBulkDelete', baseContext);

      await boOrderMessagesPage.filterTable(page, 'name', 'toSortAndPaginate');

      const textResult = await boOrderMessagesPage.getTextColumnFromTable(page, 1, 'name');
      expect(textResult).to.contains('toSortAndPaginate');
    });

    it('should delete order messages', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'BulkDelete', baseContext);

      const deleteTextResult = await boOrderMessagesPage.deleteWithBulkActions(page);
      expect(deleteTextResult).to.be.equal(boOrderMessagesPage.successfulMultiDeleteMessage);
    });

    it('should reset all filters', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterDelete', baseContext);

      const numberOfOrderMessagesAfterFilter = await boOrderMessagesPage.resetAndGetNumberOfLines(page);
      expect(numberOfOrderMessagesAfterFilter).to.be.equal(numberOfOrderMessages);
    });
  });
});
