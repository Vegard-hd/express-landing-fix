const { LRUCache } = require("lru-cache");
require("dotenv").config();
const options = {
  max: 10,

  // for use with tracking overall storage size

  // how long to live in ms
  ttl: 1000 * 60 * 60 * 2,

  // return stale items before removing from cache?
  allowStale: false,

  updateAgeOnGet: false,
  updateAgeOnHas: false,
};

const cache = new LRUCache(options);
const axios = require("axios").default;
const requestData = {
  site_id: "vegardhaglund.dev",
  metrics: ["visitors", "visits", "pageviews", "visit_duration"],
  date_range: "all",
  // filters: [["is_not", "visit:country_name", [""]]],
  // dimensions: ["visit:country_name", "visit:city_name"],
};

const requestData7days = {
  site_id: "vegardhaglund.dev",
  metrics: ["visitors", "visits", "pageviews", "visit_duration"],
  date_range: "7d",
  // filters: [["is_not", "visit:country_name", [""]]],
  // dimensions: ["visit:country_name", "visit:city_name"],
};

const key = process.env.PLAUSIBLE_KEY;

async function getStats() {
  // @ts-ignore
  try {
    return await new Promise(async (resolve, reject) => {
      const getApiData = async (queryOptions) => {
        const { data } = await axios.post(
          process.env.PLAUSIBLE_URL,
          queryOptions,
          {
            headers: {
              setContentType: "application/json",
              Authorization: "Bearer " + key,
            },
          },
        );
        return await data;
      };
      // @ts-ignore
      const [data, data2] = await Promise.all([
        await getApiData(requestData),
        await getApiData(requestData7days),
      ]);
      // @ts-ignore
      const newData = {
        allTime: {
          // @ts-ignore
          visitors: data?.results[0]?.metrics[0] ?? 0,
          // @ts-ignore

          visits: data?.results[0]?.metrics[1] ?? 0,

          // @ts-ignore
          pageviews: data?.results[0]?.metrics[2] ?? 0,

          // @ts-ignore
          visitDuration: data?.results[0]?.metrics[3] ?? 0,
        },
        lastWeek: {
          // @ts-ignore
          visitors: data2?.results[0]?.metrics[0] ?? 0,
          // @ts-ignore

          visits: data2?.results[0]?.metrics[1] ?? 0,

          // @ts-ignore
          pageviews: data2?.results[0]?.metrics[2] ?? 0,

          // @ts-ignore
          visitDuration: data2?.results[0]?.metrics[3] ?? 0,
        },
      };
      resolve(newData);
    });
  } catch (error) {
    console.error("Something wring with API request to plausible API");
  }
}

module.exports = {
  // @ts-ignore
  async isCached(req, res, next) {
    try {
      let stats = cache.get("latest");
      if (!stats) {
        stats = await getStats();
        cache.set("latest", stats);
      }
      req.cache = stats;
      next();
    } catch (error) {
      next(error);
    }
  },
  async getProjectData(req, res, next) {
    try {
      let projects = cache.get("projects");
      if (!projects) {
        const { readFileSync } = require("fs");
        projects = JSON.parse(
          readFileSync("./projects.json", {
            encoding: "utf-8",
          }),
        );
        cache.set("projects", projects, { ttl: 1000 * 60 * 60 * 60 });
      }
      req.projects = projects;
      next();
    } catch (error) {
      next(error);
    }
  },
};
