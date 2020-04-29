const {google} = require('googleapis');
const express = require('express');
const app = express();

app.get('/:date', async(req, res) => {
    const date = req.params.date;
    const result = await getData(date);
    let response;
    if(result) {
        response = {
            status: "success",
            data: {
                result : result
            }
        };
    }
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(response))
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

async function getData(date) {
    const auth = await google.auth.getClient ({
        scopes : ['https://www.googleapis.com/auth/spreadsheets']
    });
    const api = google.sheets({version: 'v4', auth});
    const response = await api.spreadsheets.values.get({
        spreadsheetId: '1V3kpzpHbT6IkJsMbOxbttBKiu_ct94x26adVDMsJjY0',
        range: 'database!A:E'
    });
    for(let row of response.data.values) {
        if(row[0] == date) {
            return {
                date : row[0],
                infected: row[1],
                remedied: row[2],
                hospitalized: row[3],
                deceased: row[4],
            }
        }
    }
}