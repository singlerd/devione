import testContext from '@utils/testContext';
import {expect} from 'chai';

import {createAddressTest} from '@commonTests/BO/customers/address';
import {createCustomerB2BTest, bulkDeleteCustomersTest} from '@commonTests/BO/customers/customer';
import {disableB2BTest, enableB2BTest} from '@commonTests/BO/shopParameters/b2b';
import {createOrderByCustomerTest} from '@commonTests/FO/classic/order';

import {
  boDashboardPage,
  boLoginPage,
  boOrdersPage,
  boOutstandingPage,
  type BrowserContext,
  dataOrderStatuses,
  dataPaymentMethods,
  dataProducts,
  FakerAddress,
  FakerCustomer,
  FakerOrder,
  type Page,
  utilsCore,
  utilsDate,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_customers_outstanding_sortFilterOutstanding';

/*
Pre-condition:
- Enable B2B
- Create 3 B2B customers
- Create 3 addresses
- Create 3 orders in FO
- Update orders status to payment accepted
Scenario:
- Filter outstanding by: ID, Date, Customer, Company, Risk, Outstanding allowance
- Sort outstanding by: ID, Date, Customer, Company, Outstanding allowance DESC and ASC
Post-condition:
- Delete created customers by bulk actions
- Disable B2B
*/
describe('BO - Customers - Outstanding : Filter and sort the Outstanding table', async () => {
  let browserContext: BrowserContext;
  let page: Page;
  // Variable used to get the number of outstanding
  let numberOutstanding: number;

  // New B2B customers
  const createCustomerData1: FakerCustomer = new FakerCustomer();
  const createCustomerData2: FakerCustomer = new FakerCustomer();
  const createCustomerData3: FakerCustomer = new FakerCustomer();

  const customersData: FakerCustomer[] = [createCustomerData1, createCustomerData2, createCustomerData3];

  // Const used to get today date format
  const today: string = utilsDate.getDateFormat('yyyy-mm-dd');
  const dateToCheck: string = utilsDate.getDateFormat('mm/dd/yyyy');

  // Pre-Condition : Enable B2B
  enableB2BTest(baseContext);

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  describe('PRE-TEST: Create outstanding', async () => {
    it('should login to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'loginBO', baseContext);

      await boLoginPage.goTo(page, global.BO.URL);
      await boLoginPage.successLogin(page, global.BO.EMAIL, global.BO.PASSWD);

      const pageTitle = await boDashboardPage.getPageTitle(page);
      expect(pageTitle).to.contains(boDashboardPage.pageTitle);
    });
    customersData.forEach((customerData: FakerCustomer, index: number) => {
      const addressData: FakerAddress = new FakerAddress({
        email: customerData.email,
        country: 'France',
      });
      const orderByCustomerData: FakerOrder = new FakerOrder({
        customer: customerData,
        products: [
          {
            product: dataProducts.demo_1,
            quantity: 1,
          },
        ],
        deliveryAddress: addressData,
        paymentMethod: dataPaymentMethods.wirePayment,
      });

      // Pre-Condition : Create new B2B customer
      createCustomerB2BTest(customerData, `${baseContext}_preTest_createB2BAccount_${index}`);

      // Pre-Condition : Create new address
      createAddressTest(addressData, `${baseContext}_preTest_createAddress_${index}`);

      // Pre-condition : Create order from the FO
      createOrderByCustomerTest(orderByCustomerData, `${baseContext}_preTest_createOrder_${index}`);

      // Pre-Condition : Update order status to payment accepted
      describe('PRE-TEST : Update order status to payment accepted', async () => {
        it('should go to Orders > Orders page', async function () {
          await testContext.addContextItem(this, 'testIdentifier', `goToOrdersPage_${index}`, baseContext);

          if (index === 0) {
            await boDashboardPage.goToSubMenu(
              page,
              boDashboardPage.ordersParentLink,
              boDashboardPage.ordersLink,
            );
          } else {
            await boOrdersPage.reloadPage(page);
          }

          const pageTitle = await boOrdersPage.getPageTitle(page);
          expect(pageTitle).to.contains(boOrdersPage.pageTitle);
        });

        it('should update order status', async function () {
          await testContext.addContextItem(this, 'testIdentifier', `updateOrderStatus_${index}`, baseContext);

          const textResult = await boOrdersPage.setOrderStatus(page, 1, dataOrderStatuses.paymentAccepted);
          expect(textResult).to.equal(boOrdersPage.successfulUpdateMessage);
        });

        it('should check that the status is updated successfully', async function () {
          await testContext.addContextItem(this, 'testIdentifier', `checkStatusBO_${index}`, baseContext);

          const orderStatus = await boOrdersPage.getTextColumn(page, 'osname', 1);
          expect(orderStatus, 'Order status was not updated').to.equal(dataOrderStatuses.paymentAccepted.name);
        });
      });
    });
  });

  // Go to the outstanding page
  describe('Go to the outstanding page', async () => {
    it('should go to \'Customers > Outstanding\' page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'goToOutstandingPage', baseContext);

      await boDashboardPage.goToSubMenu(
        page,
        boDashboardPage.customersParentLink,
        boDashboardPage.outstandingLink,
      );

      const pageTitle = await boOutstandingPage.getPageTitle(page);
      expect(pageTitle).to.contains(boOutstandingPage.pageTitle);
    });
    it('should reset filter and get the outstanding number', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterOutstanding', baseContext);

      await boOutstandingPage.resetFilter(page);

      numberOutstanding = await boOutstandingPage.getNumberOutstanding(page);
      expect(numberOutstanding).to.be.above(0);
    });
  });

  /*
  Filter outstanding by:
  ID, Date, Customer, Company, Risk, Outstanding allowance
*/
  describe('Filter outstanding table', async () => {
    const filterTests = [
      {
        args: {
          filterType: 'input',
          testIdentifier: 'filterByID',
          filterBy: 'id_invoice',
          filterValue: '2',
        },
      },
      {
        args: {
          filterType: 'input',
          testIdentifier: 'filterByCustomer',
          filterBy: 'customer',
          filterValue: createCustomerData1.lastName,
        },
      },
      {
        args: {
          filterType: 'input',
          testIdentifier: 'filterByCompany',
          filterBy: 'company',
          filterValue: createCustomerData2.company,
        },
      },
      {
        args: {
          filterType: 'select',
          testIdentifier: 'filterByRisk',
          filterBy: 'risk',
          filterValue: createCustomerData3.riskRating,
        },
      },
      {
        args: {
          filterType: 'input',
          testIdentifier: 'filterOutstandingAllowance1',
          filterBy: 'outstanding_allow_amount',
          filterValue: createCustomerData1.allowedOutstandingAmount.toString(),
        },
      },
    ];
    filterTests.forEach((test, index: number) => {
      it(`should filter by ${test.args.filterBy}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier);

        await boOutstandingPage.filterTable(page, test.args.filterType, test.args.filterBy, test.args.filterValue);

        const numberOutstandingAfterFilter = await boOutstandingPage.getNumberOutstanding(page);
        expect(numberOutstandingAfterFilter).to.be.at.most(numberOutstanding);
      });

      it('should reset all filters and get the number of outstanding', async function () {
        await testContext.addContextItem(this, 'testIdentifier', `resetFilterAndGetNumberOfOutstanding1_${index}`);

        await boOutstandingPage.resetFilter(page);

        const numberOutstandingAfterReset = await boOutstandingPage.getNumberOutstanding(page);
        expect(numberOutstandingAfterReset).to.be.equal(numberOutstanding);
      });
    });

    it('should filter the outstanding table by \'Date from\' and \'Date to\'', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterByDate', baseContext);

      // Filter outstanding
      await boOutstandingPage.filterOutstandingByDate(page, today, today);

      // Check number of element
      const numberOfOutstandingAfterFilter = await boOutstandingPage.getNumberOutstanding(page);
      expect(numberOfOutstandingAfterFilter).to.be.at.most(numberOutstanding);

      for (let i = 1; i <= numberOfOutstandingAfterFilter; i++) {
        const textColumn = await boOutstandingPage.getTextColumn(page, 'date_add', i);
        expect(textColumn).to.contains(dateToCheck);
      }
    });

    it('should reset all filters and get the number of outstanding', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterAndGetNumberOfOutstanding2');

      await boOutstandingPage.resetFilter(page);

      const numberOutstandingAfterReset = await boOutstandingPage.getNumberOutstanding(page);
      expect(numberOutstandingAfterReset).to.be.equal(numberOutstanding);
    });
  });

  /*
    Sort outstanding by:
    ID, Date, Customer, Company, Outstanding allowance DESC and ASC
 */
  describe('Sort outstanding table', async () => {
    it('should filter outstanding table by outstanding allowance', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'filterByOutstandingAllowance2');

      await boOutstandingPage.filterTable(page, 'input', 'outstanding_allow_amount', '€');

      const numberOutstandingAfterFilter = await boOutstandingPage.getNumberOutstanding(page);
      expect(numberOutstandingAfterFilter).to.be.at.most(numberOutstanding);
    });
    const sortByOutstandingAllowance = [
      {
        args: {
          testIdentifier: 'sortByOutstandingAllowanceDesc',
          sortBy: 'outstanding_allow_amount',
          sortDirection: 'desc',
          isFloat: true,
        },
      },
      {
        args: {
          testIdentifier: 'sortByOutstandingAllowanceAsc',
          sortBy: 'outstanding_allow_amount',
          sortDirection: 'asc',
          isFloat: true,
        },
      },
    ];
    sortByOutstandingAllowance.forEach((test) => {
      it(`should sort by outstanding allowance ${test.args.sortDirection}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boOutstandingPage.getAllRowsColumnContent(page, 'outstanding_allow_amount');

        await boOutstandingPage.sortTable(page, 'outstanding_allow_amount', test.args.sortDirection);

        const sortedTable = await boOutstandingPage.getAllRowsColumnContent(page, 'outstanding_allow_amount');

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
          const expectedResult = await utilsCore.sortArray(nonSortedTable);

          if (test.args.sortDirection === 'asc') {
            expect(sortedTable).to.deep.equal(expectedResult);
          } else {
            expect(sortedTable).to.deep.equal(expectedResult.reverse());
          }
        }
      });
    });
    it('should reset all filters and get the number of outstanding', async function () {
      await testContext.addContextItem(this, 'testIdentifier', 'resetFilterAndGetNumberOfOutstanding3');

      await boOutstandingPage.resetFilter(page);

      const numberOutstandingAfterReset = await boOutstandingPage.getNumberOutstanding(page);
      expect(numberOutstandingAfterReset).to.be.equal(numberOutstanding);
    });

    const sortTests = [
      {
        args: {
          testIdentifier: 'sortByDateDesc', sortBy: 'date_add', sortDirection: 'desc', isDate: true,
        },
      },
      {args: {testIdentifier: 'sortByCustomerDesc', sortBy: 'customer', sortDirection: 'desc'}},
      {args: {testIdentifier: 'sortByCompanyDesc', sortBy: 'company', sortDirection: 'desc'}},
      {
        args: {
          testIdentifier: 'sortByDateAsc', sortBy: 'date_add', sortDirection: 'asc', isDate: true,
        },
      },
      {args: {testIdentifier: 'sortByCustomerAsc', sortBy: 'customer', sortDirection: 'asc'}},
      {args: {testIdentifier: 'sortByCompanyAsc', sortBy: 'company', sortDirection: 'asc'}},
      {
        args: {
          testIdentifier: 'sortByIdAsc', sortBy: 'id_invoice', sortDirection: 'asc', isFloat: true,
        },
      },
      {
        args: {
          testIdentifier: 'sortByIdDesc', sortBy: 'id_invoice', sortDirection: 'desc', isFloat: true,
        },
      },
    ];
    sortTests.forEach((test) => {
      it(`should sort by ${test.args.sortBy} ${test.args.sortDirection}`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', test.args.testIdentifier, baseContext);

        const nonSortedTable = await boOutstandingPage.getAllRowsColumnContent(page, test.args.sortBy);

        await boOutstandingPage.sortTable(page, test.args.sortBy, test.args.sortDirection);

        const sortedTable = await boOutstandingPage.getAllRowsColumnContent(page, test.args.sortBy);

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

  // Post-Condition: Delete created customers by bulk action
  customersData.forEach((customerData: FakerCustomer, index: number) => {
    bulkDeleteCustomersTest('email', customerData.email, `${baseContext}_postTest_${index + 1}`);
  });

  // Post-Condition : Disable B2B
  disableB2BTest(`${baseContext}_postTest_4`);
});
