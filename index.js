const puppeteer = require('puppeteer');

const CODE_POSTAL_SELECTOR = "#CPId";
const CODE_POSTAL_NUMBER = "75017";
const CODE_POSTAL_SUBMIT_SELECTOR = "#application > form > div:nth-child(2) > div > input";

const NUMBER_OF_APPLICANTS_SELECTOR = "#pane3 > div.motive_body > div > div.choice_motiveone > div > div.motive_quantity > select";
const NUMBER_OF_APPLICANTS_SUBMIT_SELECTOR = "#nextButtonId";

const SELECT_ARRONDISSEMENT = "#ISiteBeanKeySelect";

let ARRONDISSMENTS_VALUES = [
  // 'site50',
  // 'site49',
  // 'site45',
  // 'site48',
  // 'site46',
  // 'site37',
  // 'site51',
  // 'site40',
  // 'site47',
  // 'site24',
  // 'site7',
  // 'site10',
  // 'site3',
  // 'site26',
  // 'site38',
  // 'site1',
  // 'site25',
  // 'site30',
];
let increment_arrondissement = 0;


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://rdv-titres.apps.paris.fr/');
  await page.click(CODE_POSTAL_SELECTOR);
  await page.keyboard.type(CODE_POSTAL_NUMBER);
  await page.click(CODE_POSTAL_SUBMIT_SELECTOR);
  await page.waitForTimeout(1500);
  await page.select(NUMBER_OF_APPLICANTS_SELECTOR, "1");
  await page.click(NUMBER_OF_APPLICANTS_SUBMIT_SELECTOR);
  await page.waitForTimeout(1500);
  const selector_arrondissement = await page.$$(`${SELECT_ARRONDISSEMENT} option`);
  const ARRONDISSEMENT_LENGTH = selector_arrondissement.length;
  for(let tr of selector_arrondissement){
    const myValue = await page.evaluate(el => {
      // console.log(el.innerHTML)
      return el.value
    }, tr);
    if(myValue !== '') {
      ARRONDISSMENTS_VALUES.push(myValue)
    }
  }
  console.log(ARRONDISSMENTS_VALUES)

  await page.select(SELECT_ARRONDISSEMENT, ARRONDISSMENTS_VALUES[increment_arrondissement]);


  page.on('dialog', async dialog => {
    console.log(`${increment_arrondissement}...`);
    if(increment_arrondissement >= ARRONDISSEMENT_LENGTH - 1) {
      browser.close();
    }
    dialog.accept()
    increment_arrondissement++;
    myFunc();
  });

  var myFunc = async () => {
    console.log(increment_arrondissement);
    await page.select(SELECT_ARRONDISSEMENT, ARRONDISSMENTS_VALUES[increment_arrondissement]);
  };


})();