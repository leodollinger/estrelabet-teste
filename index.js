import puppeteer from 'puppeteer';

    

async function bot(){
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--incognito',
            '--disable-web-security',
        ],
        ignoreHTTPSErrors: true,
        headless: false
    });
    const page = await browser.newPage();
    try{
        await page.goto('https://estrelabet.com/ptb/bet/detail-search');
        await page.waitForSelector("#dropSelectSportype > li:nth-child(1) > a");
    } catch {
        await page.goto('https://estrelabet.com/ptb/bet/detail-search');
        await page.waitForSelector("#dropSelectSportype > li:nth-child(1) > a");
    }
    await new Promise(r => setTimeout(r, 5000));
    await page.waitForSelector("#cookies-bottom-modal > div > div.flex-container.content > a");
    await page.evaluate(() => document.querySelector("#cookies-bottom-modal > div > div.flex-container.content > a").click());
    await page.waitForSelector("#dropSelectSportype > li:nth-child(1) > a");
    await page.evaluate(() => document.querySelector("#dropSelectSportype > li:nth-child(1) > a").click());
    await page.waitForSelector("#BRA");
    await page.evaluate(() => document.querySelector("#BRA").click());
    await page.waitForSelector(".btn.search-btn");
    await page.evaluate(() => document.querySelector(".btn.search-btn").click());

    await page.waitForSelector("#container-main > fixture-detail-search > div > div:nth-child(3)");
    let matches = await page.evaluate(() => {
        let gamesDays = document.querySelectorAll("#container-main > fixture-detail-search > div > div");
        let searchTeam = 'cruzeiro';
        
        let matchesFound = [];
        
        for(let i = 0; i < gamesDays.length; i++){
            if(i > 1){
                games = gamesDays[i];
                date = games.querySelector("div.modul-header > span").innerText.split(' ')[1];
                everyGameOnDate = games.querySelectorAll("div.modul-content > div > div.fixture-body.flex-container.even.ng-star-inserted");
                for(let j = 0; j < everyGameOnDate.length; j++){
                    let currMatch = everyGameOnDate[j];
                    if(currMatch.textContent.toLowerCase().search(searchTeam.toLowerCase()) !== -1){
                        let opposingTeam = '';
                        let matchTeams = currMatch.querySelector(".element.flex-item.match.ng-star-inserted").innerText.split('\n');
                        for(let z = 0; z < everyGameOnDate.length; z++){
                            if(matchTeams[z].toLowerCase().search(searchTeam.toLowerCase()) == -1){
                                opposingTeam = matchTeams[z];
                                break;
                            }
                        }
                        let allOdds = currMatch.querySelector(".bet-type.bt-col-1.element.flex-container.flex-item.ng-star-inserted");
                        let odds = allOdds.querySelectorAll('.bet-btn');
                        let winOdd = '';
                        let tieOdd = '';
                        let defeatOdd = '';
                        for(let z = 0; z < odds.length; z++){
                            let currOdd = odds[z];
                            let oddName = currOdd.querySelector(".bet-btn-text").innerText.toLowerCase();
                            let oddNumber = currOdd.querySelector(".bet-btn-odd").innerText;
                            if(oddName == searchTeam.toLowerCase())
                                winOdd = oddNumber;
                            else if(oddName == "empate")
                                tieOdd = oddNumber;
                            else
                                defeatOdd = oddNumber;
                        }
        
                        let matchData = {
                            "opposingTeam": opposingTeam,
                            "date": date,
                            "time": currMatch.querySelector(".element.date.date-color").innerText,
                            "winOdd": parseFloat(winOdd),
                            "tieOdd": parseFloat(tieOdd),
                            "defeatOdd": parseFloat(defeatOdd),
                        };
                        matchesFound.push(matchData);
                    }
                }
            }
        }
        
        return matchesFound;
    })

    // Print the full title
    console.log(matches[0]);

    await browser.close();
}

bot();