const db = require("../../database/models");
const generateJWT = require("../../api/helpers/generateJWT");
const { createCart, removeCart } = require("./cartsController");

const userController = {
	login: async (req, res) => {
		try {
			const { username, password } = req.body;
			const user = await db.users.findOne({
				attributes: {
					exclude: ['password']
				},
				where: {
					username,
					password,
				}
			}
			);
			const token = await generateJWT(user.dataValues);
			return res.status(200).json({
				success: true,
				message: "Authorized",
				user: {
					idUser: user.id,
					username: user.username,
				},
				token,
			});
		} catch (error) {
			//console.log(error);
			return res.status(500).json({
				msg: "error",
				error,
			});
		}
	},
	list: async (req, res) => {
		try {
			const list = await db.users.findAll({
				attributes: { exclude: ['password'] }
			});

			if (list.length > 0) {
				res.status(200).json(list);
			} else {
				res.status(200).json({ msg: "Empy list" });
			}
		} catch (error) {
			//console.log(error);
			res.status(500).json({
				msg: "Error Database",
			});
		}
	},
	searchById: async (req, res) => {
		try {
			const searchById = await db.users.findByPk(req.params.id, {
				attributes: { exclude: ['password'] }
			});
			if (searchById != null) {
				return res.status(200).json(searchById);
			} else if (!isNaN(req.params.id)) {
				return res.status(404).json({ msg: "Not fund user" });
			} else {
				return res
					.status(400)
					.json({
						msg: `'${req.params.id}' that is not a valid id, try with something else numerical`,
					});
			}
		} catch (error) {
			//console.log(error);
			res.status(500).json({ msg: "Error server:" });
		}
	},
	createUser: async (req, res) => {
		try {
			let {
				email = "exaple@gmail.com",
				name = "pepito",
				password = "1234",
				first_name = "Anonymous",
				last_name = "Anonymous",
				profile_pic = "www.img.com",
				role = "Guest",
				username
			} = req.body;

			let newUser = {
				email,
				name,
				password,
				first_name,
				last_name,
				profile_pic,
				role,
				username
			};
			const userCreated = await db.users.create(newUser);
			await createCart(username);
			const {dataValues} = userCreated
			let userNotPassword = {
				id:dataValues.id,
				email:dataValues.email,
				name:dataValues.name,
				first_name:dataValues.first_name,
				last_name:dataValues.last_name,
				profile_pic:dataValues.profile_pic,
				role:dataValues.role,
				username:dataValues.username,
			};
			res.status(201).json(userNotPassword)
		} catch (error) {
			//console.log(error);
			res.status(500).json({ msg: "Error database" });
		}
	},
	modifyUser: async (req, res) => {
		try {
			let idUser = req.params.id;
			if (idUser && !isNaN(idUser)) {
				let newUser = {...req.body};
				await db.users.update(newUser, { where: { id: idUser } });
				res.json(newUser);
			} else if (!isNaN(idUser)) {
				return res.status(404).json({ msg: "Not found user" });
			} else {
				res
					.status(400)
					.json({
						msg: `'${idUser}' that is not a valid id, try with something else numerical`,
					});
			}
		} catch (error) {
			//console.log(error);
			res.status(500).json({ msg: "Error database" });
		}
	},
	delete: async (req, res) => {
		try {
			let idUser = req.params.id;
			if (idUser && !isNaN(idUser)) {
				const userDeleted = await db.users.findByPk(idUser);
				//await removeCart(idUser);
				if (userDeleted) {
					await db.users.destroy({
						where: {
							id: idUser
						}
					});
					return res.status(200).json(userDeleted);
				} else if(!isNaN(idUser) && userDeleted === 0){
					res.status(400).json({ msg: "Not fund user" });
				}
			}else if(isNaN(idUser)) {
				res
					.status(400)
					.json({
						msg: `'${req.params.id}' that is not a valid id, try with something else numerical`,
					});
			}
		} catch (error) {
			res.status(500).json({ msg: "Error database" });
			//console.log(error);
		}
	}
};

module.exports = userController;
