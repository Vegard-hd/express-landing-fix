const express = require("express");
const router = express.Router();
const { isCached, getProjectData } = require("../middleware/middlewares");
require("dotenv").config();
function formatSeconds(seconds) {
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

router.get("/", isCached, getProjectData, async function (req, res, next) {
  try {
    // @ts-ignore
    // @ts-ignore
    const stats = req.cache;
    res.render("index", {
      stats: stats,
      formatSeconds: formatSeconds,
      // @ts-ignore
      darkmode: req.darkmode,
      // @ts-ignore
      projects: req?.projects ?? [],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
