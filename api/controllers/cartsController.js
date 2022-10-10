const { sequelize } = require('../../database/models');
const db = require('../../database/models');

const createCart = async username => {
    let user_id = await getCartIdFromUsername(username);
    await db.carts.create({
        user_id
    }).then(r => {
        return r;
    }).catch(err => console.log(err))
}

const removeCart = async userId => {
    await emptyCart(userId);
    await db.carts.destroy({
        where: {
            user_id: userId
        }
    })
}

const getCartIdFromUsername = async username => {
    try {
        let user = await db.users.findOne({
            attributes: ["id"],
            where: {
                username
            }
        })
        return user.id;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const emptyCart = async userId => {
    const carts_id = await getCartIdByUserId(userId);
    await db.carts_has_products.destroy({
        where: {
            carts_id
        }
    })
}

const getCartIdByUserId = async userId => {
    const cart = await db.carts.findOne({
        attributes: ['id'],
        where: {
            user_id: userId
        }
    })
    return cart.dataValues.id
}
const cartById = async (req, res) => {
    const { id } = req.dataToken;
    const carts_id = await getCartIdByUserId(id);

    try {
        let cart = await db.carts.findByPk(carts_id);
        let items = await db.carts_has_products.findAll({
            where: {
                carts_id
            }
        });
        cart = cart.dataValues;
        cart.cart = [];
        items.forEach(i => {
            let obj = i.dataValues;
            cart.cart.push({
                product : obj.products_id,
                quantity : obj.quantity
            })
        })
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server error'
        })
    }
}

const editCart = async (req, res) => {
    const { id } = req.dataToken;
    const cart = req.body.cart;
    let error = false;
    await db.carts_has_products.destroy({
        where: {
            carts_id: id
        }
    });
    try {
        let currentTime = new Date();
        const products = await db.products.findAll();
        const productList = [];
        products.forEach(p => {
            productList.push(p.dataValues)
        });

        if(cart && cart.length > 0){
        cart.forEach(c => {
            let product = productList.find(p => p.id == c.product);
            if(!product){
                error = true;
                return res.status(404).json({
                    msg : `Producto de id ${c.product} no existe.`
                })
            }
            else if(product.stock >= c.quantity){
                db.carts_has_products.create({
                    products_id: c.product,
                    carts_id: id,
                    quantity: c.quantity,
                    add_date: currentTime
                })
            }else{
                error = true;
                return res.status(400).json({
                    msg: `No hay suficiente del producto ${product.title}, hay stock de: ${product.stock}`
                })
            }
        })};
        if(!error){
            res.status(200).json({
                msg: 'Cart updated'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'Server error'
        })
    }
}

module.exports = { cartById, editCart, createCart, removeCart };