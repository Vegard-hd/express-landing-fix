const express = require("express");
const router = express.Router();

const axios = require("axios").default;

const requestData = {
  site_id: "vegardhaglund.dev",
  metrics: ["visitors", "visits", "pageviews", "visit_duration"],
  date_range: "all",
  // filters: [["is_not", "visit:country_name", [""]]],
  // dimensions: ["visit:country_name", "visit:city_name"],
};
const key = "n2oLoogFTlcd1wQuNSn73ClXndcpEaeVaE2dxiD5vOsmXd5mxkD4vB7_mFE3cD3m";

// router.get("/stats", async function (req, res, next) {
//   try {
//     const { data } = await axios.post(
//       "https://required.vegardhaglund.dev/api/v2/query",
//       requestData,
//       {
//         headers: {
//           setContentType: "application/json",
//           Authorization: "Bearer " + key,
//         },
//       },
//     );
//     console.log("response is ", data?.results[0]?.metrics[0]);
//     res.render("stats", {
//       visitors: data?.results[0]?.metrics[0] ?? 0,
//       visits: data?.results[0]?.metrics[1] ?? 0,
//       pageviews: data?.results[0]?.metrics[2] ?? 0,
//       visitDuration: data?.results[0]?.metrics[3] ?? 0,
//     });
//   } catch (e) {
//     console.warn(e);
//     res.status(500).send("Error occurred");
//   }
// });

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
  const stats = await getStats();
  res.render("index", { stats: stats, formatSeconds: formatSeconds });
});

module.exports = router;
