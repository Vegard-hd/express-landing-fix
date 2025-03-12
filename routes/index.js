const express = require("express");
const router = express.Router();
require("dotenv").config();
const axios = require("axios").default;
const { LRUCache } = require("lru-cache");
const options = {
  max: 1,

  // for use with tracking overall storage size

  // how long to live in ms
  ttl: 30000,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options);

const requestData = {
  site_id: "vegardhaglund.dev",
  metrics: ["visitors", "visits", "pageviews", "visit_duration"],
  date_range: "all",
  // filters: [["is_not", "visit:country_name", [""]]],
  // dimensions: ["visit:country_name", "visit:city_name"],
};
const key = process.env.PLAUSIBLE_KEY;

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

async function getStats() {
  return await new Promise(async (resolve, reject) => {
    const { data } = await axios.post(
      "https://required.vegardhaglund.dev/api/v2/query",
      requestData,
      {
        headers: {
          setContentType: "application/json",
          Authorization: "Bearer " + key,
        },
      },
    );
    const newData = {
      visitors: data?.results[0]?.metrics[0] ?? 0,

      visits: data?.results[0]?.metrics[1] ?? 0,

      pageviews: data?.results[0]?.metrics[2] ?? 0,

      visitDuration: data?.results[0]?.metrics[3] ?? 0,
    };
    resolve(newData);
  });
}

router.get("/", async function (req, res, next) {
  let stats = cache.get("latest");
  console.log("iscached is ", stats);
  if (!stats) {
    stats = await getStats();
    cache.set("latest", stats);
    console.log("API data from cache used");
  }
  res.render("index", { stats: stats, formatSeconds: formatSeconds });
});

module.exports = router;
