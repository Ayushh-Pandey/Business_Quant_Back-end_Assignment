const db = require("../services/database");
const expressAsyncHandler = require('express-async-handler')

const getData = expressAsyncHandler(async (req, res) => {
    let { ticker, column, period } = req.query;
    if (!ticker){
        const results = await db.query(`SELECT * FROM sample_historic_data `);
        return res.status(200).send(results)
    }
    
    try {
        let results
        if (ticker && !column && !period) {
            results = await db.query(`SELECT * FROM sample_historic_data WHERE ticker=?`, [ticker]);
            if (results.length === 0) {
                return res.status(200).send('No result found for this ticker')
            }
            res.status(200).send({ results });
        }
        else if (ticker && column) {
            results = await db.query(`SELECT ticker,date,${column} FROM sample_historic_data WHERE ticker=?`, [ticker]);
            if (period) {
                const currentYear = new Date().getFullYear();
                period = parseInt(period, 10);
                const finalResult = results.filter(function find(result) {
                    let lastYear = result.date.split('/');
                    lastYear = parseInt((lastYear[2]), 10);
                    if (currentYear - lastYear <= period) {
                        return result;
                    }
                });
                if(finalResult.length===0){
                    return res.status(200).send('No result found for this query try searching for other ticker')
                }
                    res.status(200).send({ finalResult })
            }
            else{
                res.status(200).send({results})
            }
        }

    } catch (error) {
        res.status(400).send( error.message )
    }

})

module.exports = { getData };
