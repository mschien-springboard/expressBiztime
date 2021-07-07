/** Tests for companies. */

const request = require("supertest");

const app = require("../app");
const { createData } = require("../_test-common");
const db = require("../db");

// before each test, clean out data
beforeEach(createData);

afterAll(async () => {
  await db.end()
})

describe("GET /", function () {

  test("It should respond with array of industries", async function () {
    const response = await request(app).get("/industries");
    expect(response.body).toEqual({
      "industries": [
        {
          "title": "Consumer Electronics",
          "code": "apple"
        },
        {
          "title": "Hardware",
          "code": "apple"
        },
        {
          "title": "Hardware",
          "code": "ibm"
        },
        {
          "title": "Machine Learning",
          "code": "ibm"
        },
        {
          "title": "Software",
          "code": "apple"
        },
        {
          "title": "Software",
          "code": "ibm"
        }
      ]
    });
  });


describe("GET /ce", function () {

  test("It return company info", async function () {
    const response = await request(app).get("/industries/ce");
    expect(response.body).toEqual(
      {
        "company": {
          "code": "apple",
          "name": "Apple",
          "description": "Maker of OSX.",
          "invoices": [
            {
              "id": 1
            },
            {
              "id": 2
            }
          ],
          "industries": [
            "Consumer Electronics",
            "Hardware",
            "Software"
          ]
        }
      }
    );
  });

//   test("It should return 404 for no-such-company", async function () {
//     const response = await request(app).get("/companies/blargh");
//     expect(response.status).toEqual(404);
//   })
// });


// describe("POST /", function () {

//   test("It should add company", async function () {
//     const response = await request(app)
//       .post("/companies")
//       .send({ name: "TacoTime", description: "Yum!" });

//     expect(response.body).toEqual(
//       {
//         "company": {
//           code: "tacotime",
//           name: "TacoTime",
//           description: "Yum!",
//         }
//       }
//     );
//   });

//   test("It should return 500 for conflict", async function () {
//     const response = await request(app)
//       .post("/companies")
//       .send({ name: "Apple", description: "Huh?" });

//     expect(response.status).toEqual(500);
//   })
// });


// describe("PUT /", function () {

//   test("It should update company", async function () {
//     const response = await request(app)
//       .put("/companies/apple")
//       .send({ name: "AppleEdit", description: "NewDescrip" });

//     expect(response.body).toEqual(
//       {
//         "company": {
//           code: "apple",
//           name: "AppleEdit",
//           description: "NewDescrip",
//         }
//       }
//     );
//   });

//   test("It should return 400 for missing data", async function () {
//     const response = await request(app)
//         .put("/companies/blargh")
//         .send({name: "Blargh"});

//     expect(response.status).toEqual(400);
//   });

// });


// describe("DELETE /", function () {

//   test("It should delete company", async function () {
//     const response = await request(app)
//         .delete("/companies/apple");

//     expect(response.body).toEqual({ msg: `Deleted Company: apple` });
//   });

//   test("It should return 404 for no-such-comp", async function () {
//     const response = await request(app)
//         .delete("/companies/blargh");

//     expect(response.status).toEqual(404);
//   });
});

