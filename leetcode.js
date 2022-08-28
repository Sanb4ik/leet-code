const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();
const password = process.env.password
const email = process.env.email

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Leetcode');

const Leetcode = mongoose.model('Submissions', { name: String, runtime: String, language: String, url: String});

// const bus = new Auto({ name: 'KaMAZ' });
// bus.save().then(() => console.log('ppp'));

var Submission = {
  name:'',
  status:'',
  runtime:'',
  url:'',
  language:''
}

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

const chromeOptions = {
    headless:false,
    defaultViewport: null
};

let LeetcodeSubmissions = []

async function SingIn(page){
   page.click('#landing-page-app > div > div.header > div.inner > div.landing-navbar-base > div > div > div.nav-right > div > a:nth-child(5)');
   page.screenshot({path: 'leet1.png'})
  let str = email;
  let pass = password;
  await page.waitForSelector('#id_login');
  await page.focus('#id_login');
  await page.keyboard.type(str)
  await page.focus('#id_password')
  await page.keyboard.type(pass)
  await page.keyboard.press("Enter");
  await page.click('#signin_btn')
}

async function GoToSubmissions(page){
  await page.waitForTimeout(30000)
  await page.click('#navbar-right-container > div:nth-child(5) > a')  
  await page.click('body > div:nth-child(32) > div > div > ul > li:nth-child(5) > a')
}

async function SaveInMongo(_submission){
  if( _submission.runtime !== 'N/A' ){

    const mongo = new Leetcode({
       name: _submission.name,
       status: _submission.status,
       language: _submission.language,
       url: _submission.url
    });
    
    if (!!Leetcode.find({ name: _submission.name })) {
      {console.log("new submission", _submission.name)
      mongo.save().then(() => console.log('save success'));
    };
    } else console.log("exists", _submission.name);
    LeetcodeSubmissions.push(_submission);
  }
}

async function GetSubmission(page){
  await page.waitForTimeout(3000) 
  for (let i = 1; i < 21; i++) {
    let _submission = Object.create(Submission);
    _submission.name = await getName(page, i)
    _submission.status = await getStatus(page, i)
    _submission.runtime = await getRuntime(page, i)
    _submission.language = await getLanguage(page, i)
    _submission.url = 'https://leetcode.com'+ await getUrl(page, i)
    await SaveInMongo( _submission);
  }
}

async function CreateLeetcodeSubmissions(page, browser){
  while(true){
    try{
       let selector_disabled = '#submission-list-app > div > nav > ul > li.next.disabled'
       let selector_next = '#submission-list-app > div > nav > ul > li.next'
 
        if(await page.$(selector_disabled) === null){
           await page.click(selector_next)
           await GetSubmission(page)
         }
       else break;
     }
     catch(err) {
       await browser.close();
       break;
     }
   }
}
async function WriteFile(){
  for(let i = 0; i < LeetcodeSubmissions.length; i++) {
    fs.appendFileSync('./text.txt',JSON.stringify(LeetcodeSubmissions[i]) + '\n')
  }
}
async function main () {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto('https://leetcode.com');
  
  await SingIn(page)
  await GoToSubmissions(page)
  await GetSubmission(page)
  await CreateLeetcodeSubmissions(page, browser);

  console.log( LeetcodeSubmissions.length)
  await WriteFile()
  await browser.close();

};

main();
