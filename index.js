const puppeteer = require('puppeteer');
const fs = require('fs');

const hashtag = '港鐵';
const username = 'cecilee32';  //cecilee32 dadalawdd
const password = 'cecil05';  //cecil05  dalaw01
const postsAmount = 5;

const clickPost = async (page, postsAmount) => {

    let items = [];

    while (items.length < postsAmount) {

        const topPosts = await page.$$('div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > article > div')

        for (const topPost of topPosts) {
            let postLink = "Null";
            let authorName = "Null";
            let caption = "Null";
            let likeCount = "Null";
            let commentCount = "Null";
            let postTime = "Null";

            try {
                postLink = await page.url()
            } catch (error) { console.log('postlink error') }

            try {
                authorName = await page.evaluate(
                    el => el.querySelector("article > div > div._aata > div > div > div._aasx > div._aat6 > ul > div > li > div > div > div._a9zr > h2 > div:nth-child(1) > span > a").textContent,
                    topPost
                );
            } catch (error) { console.log('author Name error') }

            try {
                caption = await page.evaluate(
                    el => el.querySelector("article > div > div._aata > div > div > div._aasx > div._aat6 > ul > div > li > div > div > div._a9zr > div._a9zs > span").textContent,
                    topPost
                );
            } catch (error) { console.log('caption error') }

            try {
                likeCount = await page.evaluate(
                    el => el.querySelector("article > div > div._aata > div > div > div._aasx > section._aam_._aat4 > div > div > div > a > div > span").textContent,
                    topPost
                );
            } catch (error) { console.log('likecount error') }

            try {
                commentCount = await page.evaluate(
                    el => el.querySelectorAll("article > div > div._aata > div > div > div._aasx > div._aat6 > ul > ul").length,
                    topPost
                );

                // if wanna get comment needs to add loop here

            } catch (error) { console.log('comment error') }

            try {
                postTime = await page.evaluate(
                    el => el.querySelector("article > div > div._aata > div > div > div._aasx > div._aat8 > div > div > a > div > time._aaqe").dateTime,
                    topPost
                );
            } catch (error) { console.log('postTime error') }

            if (authorName !== "Null") {
                items.push({ postLink, authorName, caption, likeCount, commentCount, postTime })
            }
        };

        await page.click("div._aaqg._aaqh > button", { delay: 50 });
        await page.waitFor(5000);
    }
    console.log(items);
    return items;
};

async function start() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });

    try {
        const page = await browser.newPage();
        await page.goto('https://www.instagram.com/accounts/login', { waitUntil: "networkidle2" });
        await page.waitFor(10000);

        let cookieBtn = true;
        while (cookieBtn) {
            const button = 'body > div.RnEpo.Yx5HN._4Yzd2 > div > div > button.aOOlW.HoLwm';
            if ((await page.$('body > div.RnEpo.Yx5HN._4Yzd2 > div > div > button.aOOlW.HoLwm')) !== null) {
                await page.click(button);
                await page.waitFor(7000);
                console.log('clicked cookie button');
            } else {
                cookieBtn = false;
                await page.type('input[name=username]', username, { delay: 200 });
                await page.waitFor(2000);
                await page.type('input[name=password]', password, { delay: 200 });
                await page.click('button[type=submit]', { delay: 50 });
                await page.waitFor(15000);
            }
        }

        let saveInfo = true;
        while (saveInfo) {
            const button = 'main > div > div > div > div > button';
            if ((await page.$('main > div > div > div > div > button')) !== null) {
                await page.click(button);
                console.log('clicked info not now');
                await page.waitFor(5000);
            } else {
                saveInfo = false;
                console.log('no save info not now');
            }
        }

        let notNow = true;
        while (notNow) {
            const button = 'button._a9--._a9_1';
            if ((await page.$('button._a9--._a9_1')) !== null) {
                await page.click(button);
                console.log('clicked noti not now');
                await page.waitFor(5000);
            } else {
                notNow = false;
                console.log('no noti not now');
            }
        }

        await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`, { waitUntil: "networkidle2" });
        await page.waitFor(7000);
        const firstPost = await page.waitForSelector('article > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1)')
        await firstPost.click();
        const items = await clickPost(page, postsAmount);
        fs.writeFileSync(`data/${hashtag}.json`, JSON.stringify(items));

    } catch (error) { console.log(error) }
}

start();