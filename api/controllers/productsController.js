const cartsController = require("./cartsController");
const Sequelize = require("sequelize");
const pictures = require("./picturesController.js");
const Op = Sequelize.Op;
const db = require("../../database/models");

const productsController = {
  list: async (req, res) => {
    try {
      //busqueda por categoria
      if (req.query.category) {
        const { category } = req.query;
        const search = category.toLowerCase();
        const searchCategory = await db.products.findAll({
          where: { category_id: category },
        });
        if (searchCategory.length == 0) {
          return res.status(404).json({
            msg: "Products not found",
          });
        } else {
          return res.status(200).json(searchCategory);
        }
      }
      //busqueda product
      if (req.query.q) {
        let { q } = req.query;
        let search = q.toLowerCase();
        var product = await db.products.findAll({
          where: {
            [Op.or]: [
              { title: { [Op.like]: `%${search}%` } },
              { description: { [Op.like]: `%${search}%` } },
            ],
          },
        });
        if (product.length == 0) {
          return res.status(404).json({
            msg: "Products not found",
          });
        } else {
          return res.status(200).json(product);
        }
      }
      //listado de Productos
      let list = await db.products.findAll();
      if (list.length != 0) {
        return res.status(200).json(list);
      } else {
        return res.status(200).json({msg: "Not found products ",});
      }
    } catch (error) {
      return res.status(500).json({
        msg: "Error Database",
      });
    }
  },
  detail: async (req, res) => {
    try {
      //Producto segun id
      let searchById = await db.products.findByPk(req.params.id);
      res.send(searchById.dataValues);
    } catch (error) {
      res.status(404).json({
        msg: "Not found product",
      });
    }
  },
  create: async (req, res) => {
    //agregar un nuevo producto a la bd
    let {
      title = "",
      description = "",
      price = 0,
      category_id = 100,
      most_wanted = 0,
      stock = 1,
    } = req.body;
    if (!title || !price) {
      return res
        .status(400)
        .json({ msg: "Need more data" });
       
    } else {
      if(price < 0){
        return res
        .status(400)
        .json({ msg: "Price must be positive" });
        
      }
      let newProduct = {
        title,
        description,
        price,
        category_id,
        most_wanted,
        stock,
      };
      try {
        let product = await db.products.create(newProduct);
        res.status(200).json(product);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          msg: "Server Error",
        });
      }
    }
  },
  modify: async (req, res) => {
    try {
      const searchById = await db.products.findByPk(req.params.id);
      if (searchById != null) {
        let { id } = searchById;
        let { title, price, description, category_id, most_wanted, stock } =
          req.body;
        let newProduct = {
          id,
          title,
          price,
          description,
          category_id,
          most_wanted,
          stock,
        };
        let idProducto = req.params.id;
        await db.products.update(newProduct, { where: { id: idProducto } });

        res.status(200).json(newProduct);
      } else {
        res.status(404).json({
          msg: "Not found id",
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Error",
      });
    }
  },
  mostwanted: async (req, res) => {
    try {
      const searchMostWanted = await db.products.findAll({
        where: { most_wanted: true },
      });
      if (searchMostWanted.length == 0) {
        res.status(400).send("Not found products");
      } else {
        res.status(200).json(searchMostWanted);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Server Error",
      });
    }
  },
  deleted: async (req, res) => {
    const { id } = req.params;
    try {
      const element = await db.products.findByPk(id);
      if (element) {
        pictures.deletedByProduct(req, res, id);
        await element.destroy();
        return res.status(200).json({
          element,
          msg: "Product deleted successfully",
        });
      } else {
        res.status(401).json({
          msg: "Not found products",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Server Error",
      });
    }
  },
};
module.exports = productsController;
