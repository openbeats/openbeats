# openbeats

OpenBeats is an open source Music streamer.

# Deployment Details
- microservices architecture
- monorepo implementation
- Kubernetes deployment
- custom domain with multi subdomain ingress controller for kubernetes services

# OpenBeats API Docs

**Auth**

*Register*
>https://api.openbeats.live/auth/register

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
*Login*
>https://api.openbeats.live/auth/login

```
method: post,
bodyType: JSON
JSON-Structure:

{
    "email": "email@email.com",
    "password": "password" 
}

```

**User Playlist Endpoints**

*Create empty playlist*

>https://api.openbeats.live/playlist/userplaylist/create
```language
method: POST
bodyType: JSON
structure:
{
	"name": "playlistname",
	"userId": "user_id_get_from_auth"
}
```
*Add songs to playlist*

>https://api.openbeats.live/playlist/userplaylist/addsongs
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

*Get All playlist metadata*

>https://api.openbeats.live/playlist/userplaylist/getallplaylistmetadata/<-USER-ID-GET-FROM-AUTH>

```language
method: GET
param: user id (get from auth)
```
*Get songs from playlist*

>https://api.openbeats.live/playlist/userplaylist/getplaylist/<-PLAYLIST-ID-GET-FROM-PLAYLIST-METADATA>

```language
method: GET
param: playlist id (get from playlist metadata endpoint *previous endpoint*)
```
*Change name of the playlist*

>https://api.openbeats.live/playlist/userplaylist/updatename
```language
method: POST
bodyType: JSON
structure:
{
	"playlistId": "<GET-FROM-PLAYLIST-ENDPOINT>",
	"name": "<NEW-NAME-FOR-PLAYLIST>"
}
```

*Delete song from playlist*

>https://api.openbeats.live/playlist/userplaylist/deletesong
```language
method: POST
bodyType: JSON
structure:
{
	"playlistId": "<GET-FROM-PLAYLIST-ENDPOINT>",
	"songId": "<GET-FROM-PLAYLIST-ENDPOINT>"
}
```
*Delete Entire playlist*

>https://api.openbeats.live/playlist/userplaylist//delete/<-PLAYLIST-ID->
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

> https://api.openbeats.live/downcc/<-audio-id->

---

**ytcat**

> https://api.openbeats.live/ytcat?q=<-search-query->

---

**suggester**

> https://api.openbeats.live/suggester?k=<-keyword->

---

<!-- **getcharts**

to get all charts

> https://api.openbeats.live/getcharts

to get chart in specified language

> https://api.openbeats.live/getcharts?lang=<-language-> -->
