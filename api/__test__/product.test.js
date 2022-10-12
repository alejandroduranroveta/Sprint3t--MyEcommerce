const { app, server } = require("../../server");
const request = require("supertest");
var sinon = require("sinon");
const db = require('../../database/models');

afterEach(() => {
  server.close();
});

const token = process.env.TOKEN
const tokenVencido = process.env.TOKEN_VENCIDO

describe("TEST EXITO 200 ", () => {
  describe("GET", () => {
    test("get /products", async () => {
      const response = await request(app)
        .get("/api/v2/products")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });

    test("get /products/ID", async () => {
      const response = await request(app)
        .get("/api/v2/products/1")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });

    test("get /search", async () => {
      const response = await request(app)
        .get("/api/v2/products/search?q=a")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });
    test("get /category", async () => {
      const response = await request(app)
        .get("/api/v2/products?category=1")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });

    test("get /mostwanted", async () => {
      const response = await request(app)
        .get("/api/v2/products/mostwanted")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });
    test("get /:id/pictures", async () => {
      const response = await request(app)
        .get("/api/v2/products/1/pictures")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });
  });
  var Idproducts;
  describe("POST", () => {
    test("/products", async () => {
      const response = await request(app)
        .post("/api/v2/products")
        .send({
          title: "unProducto",
          description: "1",
          category_id: 1,
          price: 1,
          stock: 1,
          most_wanted: 1,
        })
        .auth(token, { type: "bearer" });
      Idproducts = response._body.id;

      expect(response.statusCode).toBe(200);
    });
  });
  describe("PUT", () => {
    test("/products", async () => {
      const response = await request(app)
        .put(`/api/v2/products/${Idproducts}`)
        .send({
          title: "unProductoModificado",
          description: "1",
          category_id: 1,
          price: 1,
          stock: 1,
          most_wanted: 1,
        })
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE", () => {
    test("delete producto con sus pictures   ", async () => {
      const response = await request(app)
        .delete(`/api/v2/products/${Idproducts}`)
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("TOKEN VENCIDO ", () => {
  describe("GET", () => {
    test("ruta /products espera 401", async () => {
      const response = await request(app)
        .get("/api/v2/products")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
    test("ruta /search espera 401", async () => {
      const response = await request(app)
        .get("/api/v2/products/search/?q=&")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
    test("ruta /category espera 401", async () => {
      const response = await request(app)
        .get("/api/v2/products?category=1")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });

    test("ruta /mostwanted espera 401", async () => {
      const response = await request(app)
        .get("/api/v2/products/mostwanted")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
  });
  describe("POST", () => {
    test("POST/products espera 401", async () => {
      const response = await request(app)
        .post("/api/v2/products")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
  });
  describe("PUT", () => {
    test("PUT/products espera 401", async () => {
      const response = await request(app)
        .put("/api/v2/products/10")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
  });

  describe("DELETE", () => {
    test("DELETE/products espera 401", async () => {
      const response = await request(app)
        .delete("/api/v2/products/1")
        .auth(tokenVencido, { type: "bearer" });
      expect(response.statusCode).toBe(401);
    });
  });
});

describe("GET 404 TEST =", () => {
  describe("GET", () => {
    test.skip("lista de todos los productos vacia ", async () => {
      const response = await request(app)
        .get("/api/v2/products")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(404);
    });
    test("id producto not found ", async () => {
      const response = await request(app)
        .get("/api/v2/products/98989898")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(404);
    });
    test("/search sin resultados", async () => {
      const response = await request(app)
        .get("/api/v2/products/search?q=*")
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(404);
    });
  });
  test("/category sin resultados ", async () => {
    const response = await request(app)
      .get("/api/v2/products?category=6868686")
      .auth(token, { type: "bearer" });
    expect(response.statusCode).toBe(404);
  });
});

describe("PUT 400 TEST", () => {
  test("id invalido para modificar ", async () => {
    const response = await request(app)
      .put("/api/v2/products/9898")
      .send({
        title: "un product",
        price: 1,
      })
      .auth(token, { type: "bearer" });
    expect(response.statusCode).toBe(404);
  });
  test("id null para modificar ", async () => {
    const response = await request(app)
      .put("/api/v2/products/a")
      .send({
        title: "un product",
        price: 1,
      })
      .auth(token, { type: "bearer" });
    expect(response.statusCode).toBe(404);
  });
});
describe("NEED CORRECT INFO TEST - ERROR 400", () => {
  describe("POST - c", () => {
    test("sin titulo - se espera 400 ", async () => {
      const response = await request(app)
        .post("/api/v2/products")
        .send({
          title: "",
          price: 1,
        })
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(400);
    });
    test("sin precio - se espera 400 ", async () => {
      const response = await request(app)
        .post("/api/v2/products")
        .send({
          title: "sin precio",
        })
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(400);
    });
    test("precio negativo - se espera 400 ", async () => {
      const response = await request(app)
        .post("/api/v2/products")
        .send({
          title: "sin precio",
          price: -2,
        })
        .auth(token, { type: "bearer" });
      expect(response.statusCode).toBe(400);
    });

    test("ruta /products", async () => {
      const response = await request(app).post("/api/v2/products").send({
        title: "productinho",
        description: "una description",
        price: 10,
        category_id: 696969,
        most_wanted: 0,
        stock: 1,
      });
      expect(response.statusCode).toBe(400);
    });
    test("ruta /products", async () => {
      const response = await request(app).post("/api/v2/products").send({
        title: "productinho",
        description: "",
        price: -1,
        category_id: 1999999,
        most_wanted: 0,
        stock: -1,
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("PUT", () => {
    test("Route status-ruta /products", async () => {
      const response = await request(app).put("/api/v2/products/696969");
      expect(response.statusCode).toBe(400);
    });
  });
  describe("DELETE", () => {
    test("Route status-ruta /products", async () => {
      const response = await request(app).delete("/api/v2/products/696969");
      expect(response.statusCode).toBe(400);
    });
  });
});

describe("TEST FAIL  - Interrupcion ", () => {
  describe("GET", () => {
    test("get /products", async () => {
      let stub = sinon.stub(db.products, 'findAll').throws();
      const response = await request(app)
        .get("/api/v2/products")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });

    test("get /products/ID", async () => {
      let stub = sinon.stub(db.products, 'findByPk').throws();
      const response = await request(app)
        .get("/api/v2/products/3")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(404);
    });

    test("get /search", async () => {
      let stub = sinon.stub(db.products, 'findAll').throws();
      const response = await request(app)
        .get("/api/v2/products/search?q=alcon")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });
    test("get /category", async () => {
      let stub = sinon.stub(db.products, 'findAll').throws();
      const response = await request(app)
        .get("/api/v2/products?category=1")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });

    test("get /mostwanted", async () => {
      let stub = sinon.stub(db.products, 'findAll').throws();
      const response = await request(app)
        .get("/api/v2/products/mostwanted")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });
    test("get /:id/pictures", async () => {
      let stub = sinon.stub(db.pictures, 'findAll').throws();
      const response = await request(app)
        .get("/api/v2/products/2/pictures")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });
  });

  describe("POST", () => {
    test("/products", async () => {
      let stub = sinon.stub(db.products, 'create').throws();
      const response = await request(app)
        .post("/api/v2/products")
        .send({
          title: "unProducto",
          description: "1",
          category_id: 1,
          price: 1,
          stock: 1,
          most_wanted: 1,
        })
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });
  });
  describe("PUT", () => {
    test("/products", async () => {
      let stub = sinon.stub(db.products, 'update').throws();
      const response = await request(app)
        .put("/api/v2/products/1")
        .send({
          title: "unProductoModificado",
          description: "1",
          category_id: 1,
          price: 1,
          stock: 1,
          most_wanted: 1,
        })
        .auth(token, { type: "bearer" });
        stub.restore();
        expect(response.statusCode).toBe(500);
    });
  });
  describe("DELETE", () => {
    test("error 500 delete products", async () => {
      let stub = sinon.stub(db.products, 'findByPk').throws();
      const response = await request(app)
        .delete("/api/v2/products/1")
        .auth(token, { type: "bearer" });
        stub.restore();
      expect(response.statusCode).toBe(500);
    });
  });
});

