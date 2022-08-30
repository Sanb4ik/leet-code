async function getName(page, i){
    let selector = `#submission-list-app > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`
    if(await page.waitForSelector(selector) !== null){
      return page.$eval(selector, (el) => el.innerText);
    }
   return "";
  }
  
  async function getStatus(page, i){
    let selector = `#submission-list-app > div > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`
    if(await page.waitForSelector(selector) !== null){
      return page.$eval(selector, (el) => el.innerText);
    }
   return "";
  }
  
  async function getRuntime(page, i){
    let selector = `#submission-list-app > div > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`
    if(await page.waitForSelector(selector) !== null){
      return page.$eval(selector, (el) => el.innerText);
    }
   return "";
  }
  
  async function getLanguage(page, i){
    let selector = `#submission-list-app > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`
    if(await page.waitForSelector(selector) !== null){
      return page.$eval(selector, (el) => el.innerText);
    }
   return "";
  }
  
  async function getUrl(page, i) {
    let selector = `#submission-list-app > div > table > tbody > tr:nth-child(${i}) > td:nth-child(3) > a`;
    if(await page.waitForSelector(selector) !== null){
      return page.$eval(selector, (el) => el.getAttribute("href"));
    }
   return "";
  }
  module.exports = {getName, getLanguage, getUrl, getRuntime, getStatus}