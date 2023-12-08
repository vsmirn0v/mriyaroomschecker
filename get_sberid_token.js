const fs = require('fs');
const puppeteer = require('puppeteer-core');
const phone = '+79850021602';
const how_often_check_token_expired = 10 * 60 * 1000; //  check if .nlb_token file is missing once every 10 minutes

async function monitorCookies(url, cookieName, phoneNumber, timeout) {
    const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', args: ['--no-sandbox'], headless: "new" });
    const page = await browser.newPage();
    
    await page.goto(url);
    await page.waitForSelector('[data-testid="phoneNumber-input"]', { visible: true, timeout: 0 });

    // Enter the phone number into the input field
    await page.type('[data-testid="phoneNumber-input"]', phoneNumber);

    // Click the submit button
    await page.click('[data-testid="phoneNumber-nextButton"]');

    // Wait for navigation or any other event that occurs after button click
    // You might need to adjust this depending on the website's behavior
    await page.waitForSelector('[data-testid="confirmOptions-push"]', { visible: true, timeout: 0 });

    await page.click('[data-testid="confirmOptions-push"]');

    let previousCookieValue = null;
    let cookieCheckInterval = setInterval(async () => {
        const cookies = await page.cookies();
        const targetCookie = cookies.find(cookie => cookie.name === cookieName);

        if (targetCookie && targetCookie.value !== previousCookieValue) {
            console.log(`Cookie ${cookieName} changed:`, targetCookie);
            previousCookieValue = targetCookie.value;
            fs.writeFileSync('.nlb_token', targetCookie.value, 'utf8');
            console.log(`Cookie ${cookieName} saved to .nlb_token`);

            clearInterval(cookieCheckInterval);
            clearTimeout(timeoutId);
            await browser.close();
        }
    }, 1000); // Check every 1 second

    let timeoutId = setTimeout(async () => {
        clearInterval(cookieCheckInterval);
        console.log(`Cookie ${cookieName} was not set within the timeout period.`);
        await browser.close();
    }, timeout);
}


function checkAndRetrieveToken(url, cookieName, phoneNumber) {
    if (!fs.existsSync('.nlb_token')) {
        console.log('.nlb_token file not found, retrieving token...');
        monitorCookies(url, cookieName, phoneNumber,  5 * 60 * 1000); // timeout sberid token retreival to 5 minutes.
    }
}

checkAndRetrieveToken('https://cube-api-reservation.mriyaresort.com/api/v1/users/sberID-login-form?hotel_alias=mriya', 'nlb_token', phone)
// Periodic check for the file (e.g., every 5 minutes)
setInterval(() => checkAndRetrieveToken('https://cube-api-reservation.mriyaresort.com/api/v1/users/sberID-login-form?hotel_alias=mriya', 'nlb_token', phone), how_often_check_token_expired);


