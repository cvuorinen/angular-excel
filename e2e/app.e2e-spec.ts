import { AngularExcelPage } from './app.po';
import { browser } from 'protractor';

describe('angular-excel App', () => {
  let page: AngularExcelPage;

  beforeEach(() => {
    page = new AngularExcelPage();
    //page.addDelay();
  });

  it('should display heading', () => {
    page.navigateTo();
    expect(page.getHeadingText()).toEqual('Angular Excel');
  });

  it('should display a table of cells', () => {
    page.navigateTo();
    expect(page.getCellElements().count()).toBe(12);
  });

  it('should evaluate math expression and display result', () => {
    const cellId = 'A1';
    page.navigateTo();
    page.setCellInput(cellId, '2+2');

    expect(page.getCellOutput(cellId)).toBe('4');
  });

  it('should reference value from another cell', () => {
    const cell1Id = 'A1';
    const cell2Id = 'A2';
    page.navigateTo();
    page.setCellInput(cell1Id, '3');
    page.setCellInput(cell2Id, cell1Id);

    expect(page.getCellOutput(cell2Id)).toBe('3');
  });

  it('should evaluate function call', () => {
    const cell1Id = 'A1';
    const cell2Id = 'A2';
    page.navigateTo();
    page.setCellInput(cell1Id, '3');
    page.setCellInput(cell2Id, `sum(${cell1Id},2)`);

    expect(page.getCellOutput(cell2Id)).toBe('5');
  });

  it('should re-evaluate expression when referenced cell changes', () => {
    const cell1Id = 'A1';
    const cell2Id = 'A2';
    page.navigateTo();
    //browser.pause();
    page.setCellInput(cell1Id, '2');
    page.setCellInput(cell2Id, `${cell1Id}*2`);

    expect(page.getCellOutput(cell2Id)).toBe('4');

    page.setCellInput(cell1Id, '7');

    expect(page.getCellOutput(cell2Id)).toBe('14');
  });

  it('should cascade re-evaluation throught multiple cell changes', () => {
    const cell1Id = 'A1';
    const cell2Id = 'A2';
    const cell3Id = 'A3';
    page.navigateTo();
    page.setCellInput(cell1Id, '2');
    page.setCellInput(cell2Id, `${cell1Id}+2`);
    page.setCellInput(cell3Id, `sum(${cell1Id},${cell2Id},2)`);

    expect(page.getCellOutput(cell3Id)).toBe('8');

    page.setCellInput(cell1Id, '7');

    expect(page.getCellOutput(cell3Id)).toBe('18');
  });
});
