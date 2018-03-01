import { protractor, browser, element, by, Key } from 'protractor';

export class AngularExcelPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeadingText() {
    return element(by.css('app-root h1')).getText();
  }

  getCellElements() {
    return element.all(by.css('cell'));
  }

  setCellInput(cellId: string, text: string) {
    const input = element(by.css(`cell[id="${cellId}"] input`))
    return input.clear()
      .then(() => input.sendKeys(text + Key.TAB)); // add tab to move focus out of the input
  }

  getCellOutput(cellId: string) {
    return element(by.css(`cell[id="${cellId}"] .output`)).getText();
  }
}
