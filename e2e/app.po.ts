import { protractor, browser, element, by, Key } from 'protractor';

export class AngularExcelPage {
  navigateTo() {
    return browser.get('/');
  }

  addDelay(delay: number = 10) {
    var origFn = browser.driver.controlFlow().execute;
    browser.driver.controlFlow().execute = (...args) => {
      // queue wait to adjust the execution speed
      origFn.call(browser.driver.controlFlow(), () => {
        return protractor.promise.delayed(delay);
      });

      return origFn.apply(browser.driver.controlFlow(), args);
    };
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
