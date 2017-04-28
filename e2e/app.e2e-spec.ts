import { AngularExcelPage } from './app.po';

describe('angular-excel App', () => {
  let page: AngularExcelPage;

  beforeEach(() => {
    page = new AngularExcelPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
