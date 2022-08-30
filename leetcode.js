const puppeteer = require('puppeteer');
const fs = require('fs');
var Actions = require('./PageActions.js');
var Geters = require('./PageGeters.js');
var DB = require('./DB_func.js');

var Submission = {
  name:'',
  status:'',
  runtime:'',
  url:'',
  language:''
}

const chromeOptions = {
    headless:false,
    defaultViewport: null
};

let LeetcodeSubmissions = []

async function GetSubmission(page){
  await page.waitForTimeout(3000) 
  for (let i = 1; i < 21; i++) {
    let _submission = Object.create(Submission);
    
    let runtime = await Geters.getRuntime(page, i)
    if(runtime !=='N/A'){
      _submission.name = await Geters.getName(page, i)
      _submission.status = await Geters.getStatus(page, i) 
      _submission.runtime = parseInt(runtime)
      console.log(_submission.runtime)
      _submission.language = await Geters.getLanguage(page, i)
      _submission.url = 'https://leetcode.com'+ await Geters.getUrl(page, i)
    await DB.CreateMongoObject( _submission );
    if(LeetcodeSubmissions.find( s => s.name === _submission.name ) === undefined )
      LeetcodeSubmissions.push(_submission);
    }
  }
}

async function CreateAll_Submissions(page, browser){
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
  fs.truncateSync('js.txt',0, err => {
    if(err) throw err; // не удалось очистить файл
    console.log('Файл успешно очищен');
 });
 fs.truncateSync('mysql.txt',0, err => {
  if(err) throw err; // не удалось очистить файл
  console.log('Файл успешно очищен');
});
  for(let i = 0; i < LeetcodeSubmissions.length; i++) {
    if(LeetcodeSubmissions[i].language === 'javascript')
    fs.appendFileSync('./js.txt',LeetcodeSubmissions[i].name +': '+ LeetcodeSubmissions[i].url + '  ')
    if( LeetcodeSubmissions[i].language === 'mysql')
    fs.appendFileSync('./mysql.txt',LeetcodeSubmissions[i].name +': '+ LeetcodeSubmissions[i].url + '  ')

  }
}

async function main () {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto('https://leetcode.com');
  
  await Actions.SingIn(page) // signin
  await Actions.GoToSubmissions(page) // go to submissions tables
  await GetSubmission(page)// get submissions information in first and everyone table
  await CreateAll_Submissions(page, browser); //invite everyone table
  await WriteFile()
  console.log("close")
  await browser.close();
};

main();
