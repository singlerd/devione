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
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_customerService_orderMessages_filterAndBulkDeleteOrderMessages';

/*
Create 2 order messages
Filter by name and message and check result
Delete order messages with bulk actions
 */
describe('BO - Customer Service - Order Messages : Filter and bulk delete order messages', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  let numberOfOrderMessages: number = 0;

  const firstOrderMessageData: FakerOrderMessage = new FakerOrderMessage({name: 'todelete'});
  const secondOrderMessageData: FakerOrderMessage = new FakerOrderMessage({name: 'todelete2'});

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
    await boOrderMessagesPage.closeSfToolBar(page);

    const pageTitle = await boOrderMessagesPage.getPageTitle(page);
    expect(pageTitle).to.contains(boOrderMessagesPage.pageTitle);
  });

  it('should reset all filters', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'resetFirst', baseContext);

    numberOfOrderMessages = await boOrderMessagesPage.resetAndGetNumberOfLines(page);
    expect(numberOfOrderMessages).to.be.above(0);
  });

  // 1: Create 2 order message
  describe('Create 2 order messages', async () => {
    [
      {args: {orderMessageToCreate: firstOrderMessageData}},
      {args: {orderMessageToCreate: secondOrderMessageData}},
    ].forEach((test, index: number) => {
      it('should go to new order message page', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `goToNewOrderMessagePage${index + 1}`, baseContext);

        await boOrderMessagesPage.goToAddNewOrderMessagePage(page);

        const pageTitle = await boOrderMessagesCreatePage.getPageTitle(page);
        expect(pageTitle).to.contains(boOrderMessagesCreatePage.pageTitle);
      });

      it('should create order message', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `createOrderMessage${index + 1}`, baseContext);

        const result = await boOrderMessagesCreatePage.addEditOrderMessage(page, test.args.orderMessageToCreate);
        expect(result).to.equal(boOrderMessagesPage.successfulCreationMessage);

        const numberOfOrderMessagesAfterCreation = await boOrderMessagesPage.getNumberOfElementInGrid(page);
        expect(numberOfOrderMessagesAfterCreation).to.be.equal(numberOfOrderMessages + index + 1);
      });
    });
  });

  // 2: filter order Messages
  describe('Filter order messages table', async () => {
    [
      {args: {testIdentifier: 'filterName', filterBy: 'name', filterValue: secondOrderMessageData.name}},
      {args: {testIdentifier: 'filterMessage', filterBy: 'message', filterValue: secondOrderMessageData.message}},
    ].forEach((test) => {
      it(`should filter by ${test.args.filterBy} '${test.args.filterValue}'`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `${test.args.testIdentifier}`, baseContext);

        await boOrderMessagesPage.filterTable(page, test.args.filterBy, test.args.filterValue);

        const numberOfOrderMessagesAfterFilter = await boOrderMessagesPage.getNumberOfElementInGrid(page);
        expect(numberOfOrderMessagesAfterFilter).to.be.at.most(numberOfOrderMessages + 1);

        const textColumn = await boOrderMessagesPage.getTextColumnFromTable(page, 1, test.args.filterBy);
        expect(textColumn).to.contains(test.args.filterValue);
      });

      it('should reset filters and check number of order messages', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `${test.args.testIdentifier}Reset`, baseContext);

        const numberOfOrderMessagesAfterReset = await boOrderMessagesPage.resetAndGetNumberOfLines(page);
        expect(numberOfOrderMessagesAfterReset).to.be.equal(numberOfOrderMessages + 2);
      });
    });
  });

  // 3: Delete order messages with bulk actions
  describe('Delete order messages with bulk actions', async () => {
    it(`should filter by name '${firstOrderMessageData.name}'`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterToBulkDelete', baseContext);

      await boOrderMessagesPage.filterTable(page, 'name', firstOrderMessageData.name);

      const textColumn = await boOrderMessagesPage.getTextColumnFromTable(page, 1, 'name');
      expect(textColumn).to.contains(firstOrderMessageData.name);
    });

    it('should delete order messages', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'bulkDelete', baseContext);

      const result = await boOrderMessagesPage.deleteWithBulkActions(page);
      expect(result).to.be.equal(boOrderMessagesPage.successfulMultiDeleteMessage);
    });

    it('should reset filters and check number of order messages', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetAfterBulkDelete', baseContext);

      const numberOfOrderMessagesAfterReset = await boOrderMessagesPage.resetAndGetNumberOfLines(page);
      expect(numberOfOrderMessagesAfterReset).to.be.equal(numberOfOrderMessages);
    });
  });
});
