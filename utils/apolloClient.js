import {ApolloClient, InMemoryCache, gql} from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/nonitmittal/openshelf-opendesk-subgraph";

export async function executeQuery(query) {
    const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache()
    });

    return await client
        .query({
            query: gql(query)
        })
        .then(data => {
            console.log("Data fetched from Subgraph!", data);
            return data.data;
        })
        .catch(error => {
            console.log("Error fetching data: ", error);
        });
}