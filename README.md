# SwiftCloud API

Please check out the API at https://swiftcloud-api.azurewebsites.net/graphql. You will need to generate an API key to make requests. Please see below for instructions.

## Data ETL

As the data exists in a [Google Sheet](https://docs.google.com/spreadsheets/d/1iNGwJWu4ghwM_jP3U81SRU9oneYqN4DTjW7j9t3lMh8/edit#gid=619956793), to ensure access even if the sheet is removed an [Azure serverless function](https://github.com/mattblr/swiftcloud-etl) is running every hour to check for updates to the sheet. If the sheet has been updated, it will run an ETL process to lift and shift the sheet data into a MongoDB.

## Generate API Key

Navigate to https://swiftcloud-api.azurewebsites.net and you will be greeted by a [login screen](https://github.com/mattblr/swiftcloud-app) - please use the details provided to login.
![Login screen](https://i.imgur.com/1wa0Ljd.png)

Next up you will probably want to change that password, so click the _Change Password_ option.

![](https://i.imgur.com/wkJH4U2.png)

Enter your old password, new password, and confirm.
![](https://i.imgur.com/SKJlYFN.png)

Great! Now we're secure, we can generate the API key. Hit that 'View API Key to have one generated if it's your first time, or view your current active key.

Once generated/loaded, you can copy the key but clicking the text box, or view onscreen with the visibility toggle.

![](https://i.imgur.com/QN7NZwi.png)

If you need a new key for any reason, hit that "Generate a new API key' button, confirm with your password and the old key will no longer work and you'll have a new one presented on screen.

![](https://i.imgur.com/CdKwhqV.png)

## Using the API

The API key will be required to be sent as a bearer token with each request.

The following queries are available:

## getListens

This query will return raw data as it exists in the database, options for pagination, and querying the data exist and are documented below.
|Parameter|Type|Description|Required
|--|--|--|--|
|pageSize|Int|For pagination, number of rows to return per page|Optional
|pageNumber|Int|For pagination, page number to return|Optional
|song|Array of Strings|Name of song or songs to search results for. _Part of searchInput object._|Optional
|artist|Array of Strings|Name of artist or artists to search results for. _Part of searchInput object._|Optional
|writer|Array of Strings|Name of writer or writer to search results for. _Part of searchInput object._|Optional
|album|Array of Strings|Name of album or albums to search results for. _Part of searchInput object._|Optional
|year|Array of Ints|Year or years to search results for. _Part of searchInput object._|Optional

**Sample Query**

    {
        getListens(searchInput:{album:"Fearless",  writer:[  "Liz Rose"]}){
    	    song
    	    artist
    		writer
    		album
    		year
    		plays{
    			date
    			plays
    		}
    	}
    }

**Sample Response**

    {
      "data": {
        "getListens": [
          {
            "song": "Fearless",
            "artist": "Taylor Swift",
            "writer": [
              "Taylor Swift",
              "Liz Rose",
              "Hillary Lindsey"
            ],
            "album": "Fearless",
            "year": 2008,
            "plays": [
              {
                "date": "June",
                "plays": 86
              },
              {
                "date": "July",
                "plays": 105
              },
              {
                "date": "August",
                "plays": 71
              }
            ]
          },
          {
            "song": "Tell Me Why",
            "artist": "Taylor Swift",
            "writer": [
              "Taylor Swift",
              "Liz Rose"
            ],
            "album": "Fearless",
            "year": 2008,
            "plays": [
              {
                "date": "June",
                "plays": 105
              },
              {
                "date": "July",
                "plays": 32
              },
              {
                "date": "August",
                "plays": 18
              }
            ]
          },
          {
            "song": "White Horse",
            "artist": "Taylor Swift",
            "writer": [
              "Taylor Swift",
              "Liz Rose"
            ],
            "album": "Fearless",
            "year": 2008,
            "plays": [
              {
                "date": "June",
                "plays": 100
              },
              {
                "date": "July",
                "plays": 51
              },
              {
                "date": "August",
                "plays": 64
              }
            ]
          },
          {
            "song": "You Belong with Me",
            "artist": "Taylor Swift",
            "writer": [
              "Taylor Swift",
              "Liz Rose"
            ],
            "album": "Fearless",
            "year": 2008,
            "plays": [
              {
                "date": "June",
                "plays": 101
              },
              {
                "date": "July",
                "plays": 69
              },
              {
                "date": "August",
                "plays": 6
              }
            ]
          }
        ]
      }
    }

## mostPopularSong

This query will return the most popular song (or songs, if they are equally popular) given the query parameters provided. Parameters are documented below.
|Parameter|Type|Description|Required
|--|--|--|--|
|month|String|Restricts calculations to a single month|Optional
|song|Array of Strings|Name of song or songs to search results for. _Part of searchInput object._|Optional
|artist|Array of Strings|Name of artist or artists to search results for. _Part of searchInput object._|Optional
|writer|Array of Strings|Name of writer or writer to search results for. _Part of searchInput object._|Optional
|album|Array of Strings|Name of album or albums to search results for. _Part of searchInput object._|Optional
|year|Array of Ints|Year or years to search results for. _Part of searchInput object._|Optional

**Sample Query**

    {
      mostPopularSong(month: "June", searchInput: {year: [2020, 2019]}) {
        song
        plays
      }
    }

**Sample Response**

    {
      "data": {
        "mostPopularSong": [
          {
            "song": "Soon You'll Get Better",
            "plays": 110
          }
        ]
      }
    }

## leastPopularSong

This query will return the least popular song (or songs, if they are equally popular) given the query parameters provided. Parameters are documented below.
|Parameter|Type|Description|Required
|--|--|--|--|
|month|String|Restricts calculations to a single month|Optional
|song|Array of Strings|Name of song or songs to search results for. _Part of searchInput object._|Optional
|artist|Array of Strings|Name of artist or artists to search results for. _Part of searchInput object._|Optional
|writer|Array of Strings|Name of writer or weiter to search results for. _Part of searchInput object._|Optional
|album|Array of Strings|Name of album or albums to search results for. _Part of searchInput object._|Optional
|year|Array of Ints|Year or years to search results for. _Part of searchInput object._|Optional

**Sample Query**

    {
      leastPopularSong(searchInput: {album: "Red"}) {
        song
        plays
      }
    }

**Sample Response**

    	{
      "data": {
        "leastPopularSong": [
          {
            "song": "Stay Stay Stay",
            "plays": 35
          }
        ]
      }
    }

## trendingHotCold

This query will return the songs which are trending the hottest and coldest over the 3 month period given the query parameters provided. Parameters are documented below.

The trend is calculated by finding the biggest positive and negative change in listens month on month as a percentage of the grand total of listens. The trend is returned as a value and can be interpreted as percentage change in listens over the period.
|Parameter|Type|Description|Required
|--|--|--|--|
|song|Array of Strings|Name of song or songs to search results for. _Part of searchInput object._|Optional
|artist|Array of Strings|Name of artist or artists to search results for. _Part of searchInput object._|Optional
|writer|Array of Strings|Name of writer or writer to search results for. _Part of searchInput object._|Optional
|album|Array of Strings|Name of album or albums to search results for. _Part of searchInput object._|Optional
|year|Array of Ints|Year or years to search results for. _Part of searchInput object._|Optional

**Sample Query**

    {
      trendingHotCold(searchInput: {album: "Folklore"}) {
        hot {
          song
          trend
        }
        cold {
          song
          trend
        }
      }
    }

**Sample Response**

    {
      "data": {
        "trendingHotCold": {
          "hot": {
            "song": "This Is Me Trying",
            "trend": 9.563796435050083
          },
          "cold": {
            "song": "Cardigan",
            "trend": -4.3213680100954335
          }
        }
      }
    }
