const db = require("../../database/models");




const categoryController ={
    list: async (req, res) => {
        try {
            const list = await db.category.findAll();
            if (list.length > 0) {
                res.status(200).json(list);
            }else{
                res.status(200).json({msg: "Category list is empty"});
            }
        } catch (errors) {
            res.status(500).json({msg: "Database error"});
            //console.log(errors);
        }
    },
    create: async (req, res) => {
        try {
            const {name = "Comida"} = req.body;
            const category ={
                name
            }
            let newCategory = await db.category.create(category);
            res.status(200).json(newCategory);
        } catch (errors) {
            //console.log(errors);
            res.status(500).json({msg: "Error creating category"});
        }
    },
    delete: async (req, res) => {
        const id  = req.params.id;
        try {        
            let deletedCategory = await db.category.findByPk(id);
            if(deletedCategory) {
                await db.category.destroy({
                    where:{id}
                })
                return res.status(200).json({ msg: "Deleted" });
            }else{
                return res.status(404).json({ msg: "Not found category" });
            }
        }catch (err) {
            //console.log(err);
            res.status(500).json({msg: "Error database"});
        }
    }
}
module.exports = categoryController;
