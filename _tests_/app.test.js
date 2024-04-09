/* FOR TESTING EXPRESS APP HTTP METHODS */
const request = require("supertest");
const app = require("../app");

describe("test the categories GET http method", () => {
    it("it should return 3 categories: \[\"clothing\",\"food\",\"instruments\"\]", async () => {
        const res = await request(app).get("/categories?seed=777");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("[\"clothing\",\"food\",\"instruments\"]");
    })
})

describe("test the categories GET http method", () => {
    it("it should return 3 categories: \[\"transportation\",\"technology\",\"places\"\]", async () => {
        const res = await request(app).get("/categories?seed=555");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("[\"transportation\",\"technology\",\"places\"]");
    })
})

describe("test the words GET http method", () => {
    it("it should return 1 word: \"fish\" of category: \"animals\"", async () => {
        const res = await request(app).get("/words?seed=777&category=animals");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("\"fish\"");
    })
})

describe("test the words GET http method", () => {
    it("it should return 1 word: \"harmonica\" of category: \"instruments\"", async () => {
        const res = await request(app).get("/words?seed=888&category=instruments");
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe("\"harmonica\"");
    })
})

