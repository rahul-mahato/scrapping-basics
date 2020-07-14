const puppeteer = require('puppeteer');

exports.login = async (email, pass) => {
  let loginPage =
    'https://kiittnp.in/ea19b38134d463acc8c7b66744a481847ab4b/login.html';
  console.log(email, pass);
  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  //   await page.screenshot({ path: 'tnpLogin.png' });

  await page.goto(loginPage, { waitUntil: 'networkidle2' });
  await page.type('#usr.email', email);
  await page.type('#pwd.pass', pass);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('#login'),
  ]);
  console.log(1);
  //   await page.screenshot({ path: 'tnp.png' });
  debugger;

  const notices = await getNotices(page);
  browser.close();
  return notices;
};

const getNotices = async (page) => {
  console.log(2);

  //   await page.screenshot({ path: 'notices.png' });
  const notices = await page.$('.notice-header');

  let data = await page.evaluate(async () => {
    let notice = await document.querySelector('.notice-header').innerText;
    // const noticeArray = [];
    // for (let i = 0; i < notice.length; i++) {
    //   let elem = await noticeArray.push(notice[i].innerText);
    // }

    return {
      notice,
    };
  });

  return data;

  //   browser.close();
};
