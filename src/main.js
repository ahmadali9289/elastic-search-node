const elastic = require("./elastic");
const server  = require("./server");
const data    = require("./data");
                require("dotenv").config();

(async function main() {
  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {
    await elastic.esclient.indices.delete({index: elastic.index});
    const elasticIndex = await elastic.esclient.indices.exists({index: elastic.index});

    if (!elasticIndex.body) {
      await elastic.createIndex(elastic.index);
      await elastic.setQuotesMapping();
      await data.populateDatabase()
      console.log('Populating data on elasticsearch...')
    }

    server.start();
  }
})();