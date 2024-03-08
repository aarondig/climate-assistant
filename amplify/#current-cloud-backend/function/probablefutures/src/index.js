

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
// exports.handler = async (event) => {
//     console.log(`EVENT: ${JSON.stringify(event)}`);
//     return {
//         statusCode: 200,
//     //  Uncomment below to enable CORS requests
//     //  headers: {
//     //      "Access-Control-Allow-Origin": "*",
//     //      "Access-Control-Allow-Headers": "*"
//     //  },
//         body: JSON.stringify('Hello from Lambda!'),
//     };
// };
const pfApiUrl = "https://graphql.probablefutures.org";
const pfTokenAudience = "https://graphql.probablefutures.com";
const pfTokenUrl = "https://probablefutures.us.auth0.com/oauth/token";

const clientId = "FQCzxCCBAh0wih1Yx0DFqheeldF0T6FD"
const clientSecret = "v6mbHDocvyWPM9pNYNBxvdZda1_yFq4DY_1QS5kVNWuGZGlDg4Lri89szt1KIe8W"


exports.handler = async (e) => {

    async function getPfToken() {
        const body = new URLSearchParams({
            'client_id': clientId,
            'client_secret': clientSecret,
            'audience': pfTokenAudience,
            'grant_type': 'client_credentials',
        });
        const response = await fetch(pfTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: body,
        });

        const data = await response.data;
        return data.access_token;
    }


async function getPfData() {
    console.log(e)
    const country = e.country;
    const address = e.address;
    const warmingScenario = `${e.warming_scenario !== undefined ? e.warming_scenario : 1.5}`;
    
        const variables = {};
        const location = `
            country: "${country}"
            address: "${address}"
        `;
    
        const query = `
            mutation {
                getDatasetStatistics(input: { ${location}
                        warmingScenario: "${warmingScenario}" 
                    }) {
                    datasetStatisticsResponses{
                        datasetId
                        midValue
                        name
                        unit
                        warmingScenario
                        latitude
                        longitude
                        info
                    }
                }
            }
        `;
    
    
            const access_token = await getPfToken();
            const url = `${pfApiUrl}/graphql`;
            const headers = {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ query, variables }),
            });
            const data = await response.json();
            return JSON.stringify(data);
           
    }
    
    return getPfData();
    }

