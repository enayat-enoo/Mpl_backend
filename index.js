
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const teams=require('./teams.json')
const cors=require('cors')
require('dotenv').config()

app.use(cors());

app.get('/', (req, res) => {  
    res.json(teams)
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})
