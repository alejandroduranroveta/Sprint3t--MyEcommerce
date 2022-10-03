const express = require('express');

const app = express();
app.use(express.json());

app.get('/products',(req,res) =>{
    res.status(200).json([{
        id: 1,
        name: 'Product 1',
        price: 100,
        mostwanted: true,
    },{
        id: 2,
        name: 'Product 2',
        price: 200,
        mostwanted: false,
    }]);
});

app.put('/products/:id', (req,res) =>{
    let body = req.body;
    let validName = typeof body.name === 'string';
    let validPrice = typeof body.price === 'number';
    let validMostwanted = typeof body.mostwanted === 'boolean';
    let valid = validName && validPrice && validMostwanted;
    
    valid ? res.sendStatus(200) : res.sendStatus(400);
})

module.exports = app;