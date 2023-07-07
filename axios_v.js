import axios from 'axios';
let data = JSON.stringify({
    "requestBody": {
        "betTypeGroupLimit": 20,
        "bragiUrl": "https://bragi.sportingtech.com/"
    },
    "device": "d",
    "languageId": 23
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://estrelabet.com/api-v2/fixture/category-details/d/23/estrelabet/null/false/no-ante/20/soccer/brazil',
    headers: { 
        'Accept': 'application/json, text/plain, */*', 
        'Accept-Language': 'pt,en-US;q=0.9,en;q=0.8', 
        'Connection': 'keep-alive', 
        'Content-Type': 'application/json', 
        'Origin': 'https://estrelabet.com', 
        'Referer': 'https://estrelabet.com/ptb/bet/soccer/brazil', 
        'Sec-Fetch-Site': 'same-origin', 
        'bragiurl': 'https://bragi.sportingtech.com/', 
        'Cookie': '__nxquid=sSDJfRcKyJcZkndaKGWjsNU7Hi3RWA==0014'
    },
    data : data
};

let responseData = await axios.request(config).then((response) => {
    return response.data;
}).catch((error) => {
    console.log(error);
});

let apiData = responseData.data[0]

let myTeam = "cruzeiro",
    opposingTeam = null,
    dateTime = null,
    dateTimeStr = null,
    winOdd = null,
    tieOdd = null,
    defeatOdd = null,
    matchesFound = [];

for(let x = 0; x < apiData.cs[0].sns.length; x++){
    let liga = apiData.cs[0].sns[x]
    for(let y = 0; y < liga.fs.length; y++){
        let partidas = liga.fs[y]
        if(partidas.acN.toLowerCase() == myTeam.toLowerCase() || partidas.hcN.toLowerCase() == myTeam.toLowerCase()){
            let timeStamp = partidas.fsd
            dateTime = new Date(timeStamp)
            
            dateTimeStr = [dateTime.getDate(),
            dateTime.getMonth()+1,
            dateTime.getFullYear()].join('/')+' '+
            [dateTime.getHours(),
            dateTime.getMinutes(),
            dateTime.getSeconds()].join(':');

            for(let z = 0; z < partidas.btgs[0].fos.length; z++){
                let odds = partidas.btgs[0].fos[z]
                if(odds.hSh.toLowerCase() == myTeam.toLowerCase())
                    winOdd = odds.hO
                else if(odds.hSh == "Empate")
                    tieOdd = odds.hO
                else{
                    defeatOdd = odds.hO
                    opposingTeam = odds.hSh
                }
            }
            let matchData = {
                "opposingTeam": opposingTeam,
                "dateTimeStr": dateTimeStr,
                "timeStamp": timeStamp,
                "winOdd": parseFloat(winOdd),
                "tieOdd": parseFloat(tieOdd),
                "defeatOdd": parseFloat(defeatOdd),
            }
            matchesFound.push(matchData);
        }
    }
}

let nextMatch = null,
    minTS = null

for (let index = 0; index < matchesFound.length; index++) {
    let element = matchesFound[index];
    if(index == 0){
        nextMatch = element
        minTS = element.timeStamp
    } else if(element.timeStamp < minTS){
        nextMatch = element
        minTS = element.timeStamp
    }
}

console.log(nextMatch)
console.log('end');