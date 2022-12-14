const { app, server } = require("../../server");
const request = require("supertest");
var sinon = require("sinon");
const db = require("../../database/models");

afterEach(() => {
	server.close();
});
const token = process.env.TOKEN;
const numberRandom = Math.floor(Math.random() * 9999);
describe("TEST USERS ENDPOINTS STATUS OK", () => {
	describe("GET", () => {
		test("Route status OK /users", async () => {
			const response = await request(app)
				.get("/api/v2/users")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(200);
		});
		test("Route status OK /users/id", async () => {
			const response = await request(app)
				.get("/api/v2/users/2")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(200);
		});
	});
	describe("POST", () => {
		test("Route status OK /users/login", async () => {
			const response = await request(app)
				.post("/api/v2/users/login")
				.send({
					username: "jeffg",
					password: "123456",
				})
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(200);
		});
	});
	describe("POST", () => {
		test("Route status OK /users", async () => {
			const response = await request(app)
				.post("/api/v2/users")
				.send({
					first_name: "Juan",
					last_name: "Ferreira",
					email: `JuanFerreira${numberRandom}@outlook.com`,
					username: `JuanFerreira${numberRandom}`,
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(201);
		});
	});
	describe("PUT", () => {
		test("Route status OK /users/login/id", async () => {
			const response = await request(app)
				.put("/api/v2/users/3")
				.send({
					first_name: "Lucas",
					last_name: "Rodrigo",
					email: `lucasRodrigo${numberRandom}@outlook.com`,
					username: "lucasRo",
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(200);
		});
	});
	describe("DELETE", () => {
		test("Route status OK /users/id", async () => {
			const newUser = await request(app)
				.post("/api/v2/users")
				.send({
					first_name: "Martin",
					last_name: "Hern??ndez",
					email: `MartinHer${numberRandom}@outlook.com`,
					username: "MartinHer",
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			const id = newUser._body.id;
			const response = await request(app)
				.delete(`/api/v2/users/${id}`)
				.auth(token, { type: "bearer" });
				expect(response.statusCode).toBe(200);
		});
	});
});

describe("TEST USERS ENDPOINTS STATUS ERROR", () => {
	describe("GET", () => {
		test("Route status ERROR /users/id", async () => {
			const response = await request(app)
				.get("/api/v2/users/9999")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(404);
		});
	});
	describe("POST", () => {
		test("Route status ERROR /users/login", async () => {
			const response = await request(app)
				.post("/api/v2/users/login")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(500);
		});
	});
	describe("POST", () => {
		test("Route status ERROR /users", async () => {
			const response = await request(app)
				.post("/api/v2/users")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(500);
		});
	});
	describe("PUT", () => {
		test("Route status ERROR /users/id", async () => {
			const response = await request(app)
				.put("/api/v2/users/")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(404);
		});
	});
	describe("DELETE", () => {
		test("Route status ERROR /users/id", async () => {
			const response = await request(app)
				.delete("/api/v2/users")
				.auth(token, { type: "bearer" });
			expect(response.statusCode).toBe(404);
		});
	});
});

describe("TEST USERS ENDPOINT DATA", () => {
	describe("GET", () => {
		test("Is array in /api/v2/users", async () => {
			const response = await request(app)
				.get("/api/v2/users")
				.auth(token, { type: "bearer" });
			expect(response.body).toBeInstanceOf(Array);
		});
		test("Data type in /api/v2/users", async () => {
			const response = await request(app)
				.get("/api/v2/users/")
				.auth(token, { type: "bearer" });
			response.body.forEach((user) => {
				expect(user).toEqual(
					expect.objectContaining({
						id: expect.any(Number),
						first_name: expect.any(String),
						last_name: expect.any(String),
						email: expect.any(String),
						username: expect.any(String),
						profile_pic: expect.any(String),
						role: expect.any(String),
					})
				);
			});
		});
		test("Data type in /api/v2/users/id", async () => {
			const response = await request(app)
				.get("/api/v2/users/2")
				.auth(token, { type: "bearer" });
			expect(response.body).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					username: expect.any(String),
					profile_pic: expect.any(String),
					role: expect.any(String),
				})
			);
		});
	});
	describe("POST", () => {
		test("Data type /api/v2/users", async () => {
			const response = await request(app)
				.post("/api/v2/users")
				.send({
					first_name: "Francisco",
					last_name: "Hern??ndez",
					email: `franHer${numberRandom}@outlook.com`,
					username: "fran",
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			expect(response.body).toEqual(
				expect.objectContaining({
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					username: expect.any(String),
					profile_pic: expect.any(String),
					id: expect.any(Number),
					role: expect.any(String),
				})
			);
		});
		test("Data type in /api/v2/users/login", async () => {
			const response = await request(app).post("/api/v2/users/login").send({
				username: "jeffg",
				password: "123456",
			});
			expect(response.body).toEqual(
				expect.objectContaining({
					success: expect.any(Boolean),
					message: expect.any(String),
					user: expect.objectContaining({
						idUser: expect.any(Number),
						username: expect.any(String),
					}),
					token: expect.any(String),
				})
			);
		});
	});
	describe("PUT", () => {
		test("Data type in /api/v2/users/3", async () => {
			const response = await request(app)
				.put("/api/v2/users/3")
				.send({
					first_name: "Fede",
					last_name: "Garc??a",
					email: `Fede12${numberRandom}@outlook.com`,
					username: "FedeGar",
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			expect(response.body).toEqual(
				expect.objectContaining({
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					username: expect.any(String),
					profile_pic: expect.any(String),
					password: expect.any(String),
					role: expect.any(String),
				})
			);
		});
	});
	describe("DELETE", () => {
		test("Data type in /api/v2/users/", async () => {
			const newUser = await request(app)
				.post("/api/v2/users")
				.send({
					first_name: "Lucas",
					last_name: "P??rez",
					email: `lucasPerez${numberRandom}llkk@outlook.com`,
					username: "Lucas",
					password: "123456",
					profile_pic: "https://ibb.co/zF5mrtX",
					role: "God",
				})
				.auth(token, { type: "bearer" });
			const id = newUser._body.id;
			const response = await request(app)
				.delete(`/api/v2/users/${id}`)
				.auth(token, { type: "bearer" });
			expect(response.body).toEqual(
				expect.objectContaining({
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					username: expect.any(String),
					profile_pic: expect.any(String),
					password: expect.any(String),
					role: expect.any(String),
				})
			);
		});
	});
});

describe("TEST USERS ENDPOINT ERROR SERVER", () => {
	test("List status ERROR SERVER /users", async () => {
		stub = sinon.stub(db.users, "findAll").throws();
		const response = await request(app)
			.get("/api/v2/users")
			.auth(token, { type: "bearer" });
		stub.restore();
		expect(response.statusCode).toBe(500);
	});
	test("ByID status ERROR SERVER /users/id", async () => {
		stub = sinon.stub(db.users, "findByPk").throws();
		const response = await request(app)
			.get("/api/v2/users/1")
			.auth(token, { type: "bearer" });
		stub.restore();
		expect(response.statusCode).toBe(500);
	});
	test("Delete status ERROR SERVER /users/id", async () => {
		let stub = sinon.stub(db.users, "findByPk").throws();
		const response = await request(app)
			.delete("/api/v2/users/4")
			.auth(token, { type: "bearer" });
		stub.restore();
		expect(response.statusCode).toBe(500);
	});
	test("Login status ERROR SERVER /users/login", async () => {
		stub = sinon.stub(db.users, "findOne").throws();
		const response = await request(app)
			.post("/api/v2/users/login")
			.send({
				username: "jeffg",
				password: "123456",
			})
			.auth(token, { type: "bearer" });
		expect(response.statusCode).toBe(500);
	});
	test("Created status ERROR SERVER /user", async () => {
		let stub = sinon.stub(db.users, "create").throws();
		const response = await request(app)
			.post("/api/v2/users")
			.send({
				first_name: "Juan",
				last_name: "S??nchez",
				email: `juanS??nchez${numberRandom}@outlook.com`,
				username: `Juan${numberRandom}`,
				password: "123456",
				profile_pic: "https://ibb.co/zF5mrtX",
				role: "God",
			})
			.auth(token, { type: "bearer" });
		stub.restore();
		expect(response.statusCode).toBe(500);
	});
	test("Modify status ERROR SERVER /users/id", async () => {
		let stub = sinon.stub(db.users, "update").throws();
		const response = await request(app)
			.put("/api/v2/users/3")
			.send({
				first_name: "Andr??s",
				last_name: "Gonz??lez",
				email: `Andr??sGo${numberRandom}@outlook.com`,
				username: "Gonza",
				password: "123456",
				profile_pic: "https://ibb.co/zF5mrtX",
				role: "God",
			})
			.auth(token, { type: "bearer" });
		stub.restore();
		expect(response.statusCode).toBe(500);
	});
});

describe("TEST TOKEN USERS", () => {
	test("ERROR", async () => {
		const response = await request(app)
			.get("/api/v2/users/")
			.auth("123", { type: "bearer" });
		expect(response.statusCode).toEqual(401);
	});
	test("OK", async () => {
		const response = await request(app)
			.get("/api/v2/users/")
			.auth(token, { type: "bearer" });
		expect(response.statusCode).toEqual(200);
	});
});

describe("TEST SPECIAL SITUATION", () => {
	test("ID IS INVALID", async () => {
		const response = await request(app).put(
			"/api/v2/users/ahdbabwwlaiwdbluawbd"
		);
		expect(response.statusCode).toEqual(400);
	});
});
