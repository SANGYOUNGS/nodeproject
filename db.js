const { MongoClient } =require("mongodb");

const url = process.env.DB_URL;
let connetDB = new MongoClient(url).connect()

module.exports = connetDB