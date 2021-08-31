import axios from "axios";

const API_KEY = process.env.NEW_RELIC_GRAPHQL_API_KEY;
const API_ENDPOINT = `https://api.newrelic.com/graphql`;
const NR_ACCOUNT_ID = process.env.NEW_RELIC_ACCOUNT_ID;

async function sendApiCall(query, chartType) {
  const data = {
    query: `{ 
      actor { 
        account(id: ${NR_ACCOUNT_ID}) { 
          nrql(query: "${query}") { 
            embeddedChartUrl(chartType: ${chartType}) 
          } 
        } 
      } 
    }`
  };
  const headers = {
    "Content-Type": "application/json",
    "API-Key": API_KEY
  };
  let response;
  try {
    response = await axios.post(API_ENDPOINT, data, { headers: headers });
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to send api call"
    };
  }

  return {
    success: true,
    message: "Successful",
    data: response.data.data
  };
}

class NewRelicApiService {
  constructor() {}

  async createReliefOrHighEmbedUrl(accountId) {
    // select count(*) from Transaction where appName = 'DialMyHigh-Prod'
    // and dispensaryAccountId = 1 and question1 is not null since 7 days ago facet question1
    const query = `select count(*) from Transaction where appName = 'DialMyHigh-Prod' and dispensaryAccountId = ${accountId} and question1 is not null since 7 days ago facet question1`;
    const response = await sendApiCall(query, "PIE");
    if (!response.success) {
      return response;
    }
    return {
      success: true,
      message: "Successful",
      embedUrl: response.data.actor.account.nrql.embeddedChartUrl
    };
  }

  async createFeelEmbedUrl(accountId) {
    // select count(*) from Transaction where appName = 'DialMyHigh-Prod'
    // and dispensaryAccountId = 1 since 7 days ago facet question2,question3,question4
    const query = `select count(*) from Transaction where appName = 'DialMyHigh-Prod' and dispensaryAccountId = ${accountId} since 7 days ago facet question2,question3,question4`;
    const response = await sendApiCall(query, "BAR");
    if (!response.success) {
      return response;
    }
    return {
      success: true,
      message: "Successful",
      embedUrl: response.data.actor.account.nrql.embeddedChartUrl
    };
  }

  async createStrainEmbedUrl(accountId) {
    // select count(*) from Transaction where appName = 'DialMyHigh-Prod'
    // and dispensaryAccountId = 1 since 7 days ago facet strainName
    const query = `select count(*) from Transaction where appName = 'DialMyHigh-Prod' and dispensaryAccountId = ${accountId} since 7 days ago facet strainName`;
    const response = await sendApiCall(query, "BAR");
    if (!response.success) {
      return response;
    }
    return {
      success: true,
      message: "Successful",
      embedUrl: response.data.actor.account.nrql.embeddedChartUrl
    };
  }
}

export default NewRelicApiService;
