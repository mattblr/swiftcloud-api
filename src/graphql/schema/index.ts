const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Play {
    date: String!
    plays: Int!
}

type Listen {
    song: String!
    artist: String!
    writer: [String!]
    album: String!
    year: Int!
    plays: [Play!]
}

type TopSong {
    song: String!
    plays: Int!
}

type TrendItem {
    song: String!
    trend: Float!
}

type Trend {
    hot: TrendItem
    cold: TrendItem
}

type User {
    _id: ID!
    email: String!
    password: String!
    name: String
}

input UserInput {
    email: String!
    password: String!
    name: String
}

input SearchInput {
    song:[String]
    artist: [String]
    writer: [String]
    album: [String]
    year:[Int]
}

type APIKey {
    key: String!
    active: Boolean!
    user: String!
}


type AuthData {
    userId: ID!
    token: String!
    email: String!
    name: String
    tokenExpiration: Int!
}

type RootQuery {
    login(email:String!, password:String!):AuthData!
    retrieveAPIKey: String
    getListens(pageSize: Int, pageNumber:Int, sortBy: String, reverseSort: Boolean, searchInput: SearchInput): [Listen!]
    mostPopularSong(month:String, searchInput: SearchInput): [TopSong!]
    leastPopularSong(month:String, searchInput: SearchInput): [TopSong!]
    trendingHotCold(searchInput: SearchInput): Trend!
}

type RootMutation {
    createUser(userInput: UserInput!): User
    createAPIKey: APIKey
    generateNewAPIKey(password:String!): String
    changePassword(password:String!, newPassword:String!):String!
}


schema {
    query: RootQuery
    mutation: RootMutation
}
`);
