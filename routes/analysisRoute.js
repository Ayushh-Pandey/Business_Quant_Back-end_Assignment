const express = require("express");
const router = express.Router();

const {getData} = require("../controllers/analysisController");

router.get("/",getData);

module.exports = router