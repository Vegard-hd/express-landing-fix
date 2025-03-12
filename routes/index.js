const express = require("express");
const router = express.Router();
require("dotenv").config();
const { isCached } = require("../middleware/middlewares");

function formatSeconds(seconds = 10000) {
  let remaindingMinutes = 0;
  let hour = 0;
  const remainder = seconds % 60;
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) {
    remaindingMinutes = minutes % 60;
    hour = Math.floor(minutes / 60);
  } else {
    remaindingMinutes = minutes;
  }
  return `${hour}h ${minutes}m ${remainder}s`;
}

router.get("/stats", isCached, async function (req, res, next) {
  try {
    // @ts-ignore
    const stats = req.cache;
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get("/", isCached, async function (req, res, next) {
  try {
    // @ts-ignore
    const stats = req.cache;
    res.render("index", { stats: stats, formatSeconds: formatSeconds });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
