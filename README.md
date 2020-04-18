# openbeats

OpenBeats is an open source Music streamer.

# Deployment Details

- microservices architecture
- monorepo implementation
- Kubernetes deployment
- custom domain with multi subdomain ingress controller for kubernetes services

# OpenBeats API Docs

**Auth**

_Register_

> https://api.openbeats.live/auth/register

```
method: post,
bodyType: JSON
JSON-Structure:

{
    "name": "name",
    "email": "email@email.com",
    "password": "password"
}

```

_Login_

> https://api.openbeats.live/auth/login

```
method: post,
bodyType: JSON
JSON-Structure:

{
    "email": "email@email.com",
    "password": "password"
}

```

_Forget Password_

> https://api.openbeats.live/auth/forgotpassword

```
method: post,
bodyType: JSON
JSON-Structure:

{
    "email": "email@email.com",
}

```

_Reset Password_

> https://api.openbeats.live/auth/resetpassword

```
method: post,
bodyType: JSON
JSON-Structure:

{
    "reset_password_token":"<reset_password_token>",
    "password":"<new_password>"
}

```

**User Playlist Endpoints**

_Create empty playlist_

> https://api.openbeats.live/playlist/userplaylist/create

```language
method: POST
bodyType: JSON
structure:
{
	"name": "playlistname",
	"userId": "user_id_get_from_auth"
}
```

_Add songs to playlist_

> https://api.openbeats.live/playlist/userplaylist/addsongs

```language
method: POST
bodyType: JSON
structure:
{
	"playlistId": "5e23496773d1d7231c86c05c",
	"songs":[
        <Array of songs - get from ytcat search result>
    ]
}

songs structure sample :=

{
    "title": "Ed Sheeran - Shape of You [Official Video]",
    "thumbnail": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBDr2laWVr1FOfo6vsZFHCQVOlH5w",
    "duration": "4:24",
    "videoId": "JGwWNGJdvx8",
    "channelName": "Ed Sheeran",
    "channelId": "/channel/UC0C-w0YjGpqDXGB8IHb662A",
    "uploadedOn": "2 years ago4,577,461,044 views",
    "views": "4,577,461,044 views",
    "description": "Tickets for the Divide tour here - http://www.edsheeran.com/tourStream or Download Shape Of You: https://atlanti.cr/2singles ..."
}
```

_Get All playlist metadata_

> https://api.openbeats.live/playlist/userplaylist/getallplaylistmetadata/<-USER-ID-GET-FROM-AUTH>

```language
method: GET
param: user id (get from auth)
```

_Get songs from playlist_

> https://api.openbeats.live/playlist/userplaylist/getplaylist/<-PLAYLIST-ID-GET-FROM-PLAYLIST-METADATA>

```language
method: GET
param: playlist id (get from playlist metadata endpoint *previous endpoint*)
```

_Change name of the playlist_

> https://api.openbeats.live/playlist/userplaylist/updatename

```language
method: POST
bodyType: JSON
structure:
{
	"playlistId": "<GET-FROM-PLAYLIST-ENDPOINT>",
	"name": "<NEW-NAME-FOR-PLAYLIST>"
}
```

_Delete song from playlist_

> https://api.openbeats.live/playlist/userplaylist/deletesong

```language
method: POST
bodyType: JSON
structure:
{
	"playlistId": "<GET-FROM-PLAYLIST-ENDPOINT>",
	"songId": "<GET-FROM-PLAYLIST-ENDPOINT>"
}
```

_Delete Entire playlist_

> https://api.openbeats.live/playlist/userplaylist/delete/<-PLAYLIST-ID->

```language
method: GET
param: playlist id ( get from playlist metadata endpoint or playlist endpoint *userPlaylist* )
```

---

**Opencc**

> https://api.openbeats.live/opencc/<-audio-id->

---

**fallback**

> https://api.openbeats.live/fallback/<-audio-id->

---

**downcc**

> https://api.openbeats.live/downcc/<-audio-id->?title=<-song-title->

```
**song-title**(query param)
due to redis integration , only stream url can be fetchef from redis
title can't be fetched, so send title in query to give user meaningful downloaded file.
**note:**
song-title should be uriencoded before appending it to query param to avoid spacing conflicts.

```

---

**ytcat**

> https://api.openbeats.live/ytcat?q=<-search-query->

---

**suggester**

> https://api.openbeats.live/suggester?k=<-keyword->

---

**TopCharts**

Get all charts metadata

> https://api.openbeats.live/playlist/topcharts/metadata

```
method: GET

```

Get chart Songs

> https://api.openbeats.live/playlist/topcharts/<-CHART-ID->

```
method: GET
params: CHART-ID can be obtained from top charts metadata.

```

**Recently Played**

_Get recently played for logged in user_

> https://api.openbeats.live/auth/metadata/recentlyplayed

```language
method: Get
```

**Album Endpoints**

_Create an album_

> https://api.openbeats.live/playlist/album/create

```language
method: POST
bodyType: JSON
structure:
{
	"name": "<NAME-OF-AN-ALBUM>",
	"userId": "<CAPTAINAPP-LOGINED-USER-ID>",
    "songs": "<ARRAY-OF-SONG-OBJECT>"
    "searchTags": "<ARRAY-OF-SEARCH-TAG-ID>",
    "featuringArtists": "<ARRAY-OF-FEATURING-ARTIST-TAG-ID>",
    "albumBy": "<ARTIST-ID>"(If album is specific to a particular Artist),
}
```

_Get All album_

> https://api.openbeats.live/playlist/album/all

```language
method: Get
query param: page and limit
```

_Get All album by search tag_

> https://api.openbeats.live/playlist/album/:searchtag/findbysearchtag

```language
method: Get
Route params: searchtag
```

_Get specific album_

> https://api.openbeats.live/playlist/album/<:id>

```language
method: Get
Route params: <ALBUM-ID>
query params: edit=true(If called for update will populate searchTag and featuring artist and also album by)
```

_Update an album_

> https://api.openbeats.live/playlist/album/<:id>

```language
method: PUT
Route params: <ALBUM-ID>
bodyType: JSON
structure:
{
	"name": "<NAME-OF-AN-ALBUM>",
	"userId": "<CAPTAINAPP-LOGINED-USER-ID>",
    "songs": "<ARRAY-OF-SONG-OBJECT>"
    "searchTags": "<ARRAY-OF-SEARCH-TAG-ID>",
    "featuringArtists": "<ARRAY-OF-FEATURING-ARTIST-TAG-ID>",
    "albumBy": "<ARTIST-ID>"(If album is specific to a particular Artist),
}
```

_delete album_

> https://api.openbeats.live/playlist/album/<:id>

```language
method: DELETE
Route params: <ALBUM-ID>

```

**Artist Endpoints**

_Create an artist_

> https://api.openbeats.live/playlist/artist/create

```language
method: POST
bodyType: JSON
structure:
{
	"name": "<NAME-OF-AN-ARTIST>",
	"thumbnail": "<IMAGE-URL-OF-ARTIST>"
}
```

_Fetch an artist by artistId or startsWith(return 10 docs only)_

> https://api.openbeats.live/playlist/artist/fetch

```language
method: GET
query param: tagId or startsWith(string case insensitive)
```

_Get All artist_

> https://api.openbeats.live/playlist/artist/all

```language
method: Get
query param: page and limit
```

_Update an artist_

> https://api.openbeats.live/playlist/artist/:id

```language
method: PUT
Route params: <ARTIST-ID>
bodyType: JSON
structure:
{
	"name": "<NAME-OF-AN-ARTIST>",
	"thumbnail": "<IMAGE-URL-OF-ARTIST>
}
```

_delete artist_

> https://api.openbeats.live/playlist/artist/<:id>

```language
method: DELETE
Route params: <ARTIST-ID>
```

_Album releases by an artist_

> https://api.openbeats.live/playlist/artist/<:id>/releases

```language
method: GET
Route params: <ARTIST-ID>
```

_Album featuring by an artist_

> https://api.openbeats.live/playlist/artist/<:id>/featuring

```language
method: GET
Route params: <ARTIST-ID>
```

**SearchTag Endpoints**

_Create an SearchTag_

> https://api.openbeats.live/playlist/searchtag/create

```language
method: POST
bodyType: JSON
structure:
{
	"searchVal": "<VALUE-OR-KEYWORD-TO-SEARCH>",
}
```

_Get all SearchTag_

> https://api.openbeats.live/playlist/searchtag/all

```language
method: GET
query param: page and limit
```

_Fetch seaechtag by seaechtagID or startsWith(return 10 docs only)_

> https://api.openbeats.live/playlist/searchtag/fetch

```language
method: GET
query param: searchId or startsWith(string-case insensitive)
```

_Update an searchtag_

> https://api.openbeats.live/playlist/searchtag/:id

```language
method: PUT
Route params: <ARTIST-ID>
bodyType: JSON
structure:
{
    "searchVal": "<VALUE-OR-KEYWORD-TO-SEARCH>"
}
```

_delete searchtag_

> https://api.openbeats.live/playlist/searchtag/<:id>

```language
method: DELETE
Route params: <ARTIST-ID>
```
**Mycollections Endpoints**

_Add an Album to the user collection_

> https://api.openbeats.live/auth/metadata/mycollections

```language
method: POST
bodyType: JSON
structure:
{
	"userId": "<USER-ID>",
	"albumId": "<ALBUM-ID>",
}
```

_Get all The Albums in the Collections_

> https://api.openbeats.live/auth/metadata/mycollections(?meatadata=true)

```language
method: GET
header: "x-auth-token: user-auth-token" (mandatory)
queryParams: ?meatadata=true => for only getting albums Ids without population
```
_Remove an Album from the Collections_

> https://api.openbeats.live/auth/metadata/mycollections

```language
method: DELETE
bodyType: JSON
structure:
{
	"userId": "<USER-ID>",
	"albumId": "<ALBUM-ID>",
}
```