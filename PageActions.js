
require('dotenv').config();
const password = process.env.password
const email = process.env.email

async function SingIn(page){
   page.click('#landing-page-app > div > div.header > div.inner > div.landing-navbar-base > div > div > div.nav-right > div > a:nth-child(5)');
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
   await page.waitForTimeout(3000)
   await page.waitForSelector('#navbar-right-container > div:nth-child(5) > a')
   await page.click('#navbar-right-container > div:nth-child(5) > a')
   await page.waitForSelector('body > div:nth-child(32) > div > div > ul > li:nth-child(5) > a')
   await page.click('body > div:nth-child(32) > div > div > ul > li:nth-child(5) > a')
 }
 module.exports = {SingIn, GoToSubmissions}