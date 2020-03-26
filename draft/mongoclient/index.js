var mongo = require('mongodb');
var url = "mongodb://localhost:27017";
var mydb = null;
const songCol = [{
        "_id": "1VBW6rdvRks",
        "title": "KidsCamp - Learn Shapes With Wooden Truck Toy Colors and Shapes Videos Collection for Kids Children",
        "thumbnail": "https://i.ytimg.com/vi/1VBW6rdvRks/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDJ_oMvLRzpZS1gLN9V5U4DMnsONA",
        "duration": "17:20",
        "videoId": "1VBW6rdvRks",
        "channelName": "KidsCamp - Education",
        "channelId": "/user/kidscamp",
        "uploadedOn": "1 year ago19,709,990 views",
        "views": "19,709,990 views",
        "description": "Subscribe to Kidscamp https://bit.ly/2JnzUDV To Download the HooplaKidz Plus App-https://applk.io/hooplakidz_plus Hi Kids!",
        "__v": 0
    },
    {
        "_id": "JGwWNGJdvx8",
        "title": "Ed Sheeran - Shape of You [Official Video]",
        "thumbnail": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAs8aX0ACEG9PZWCbmZtwXgSkEzng",
        "duration": "4:24",
        "videoId": "JGwWNGJdvx8",
        "channelName": "Ed Sheeran",
        "channelId": "/channel/UC0C-w0YjGpqDXGB8IHb662A",
        "uploadedOn": "3 years ago4,676,807,252 views",
        "views": "4,676,807,252 views",
        "description": "Tickets for the Divide tour here - http://www.edsheeran.com/tourStream or Download Shape Of You: https://atlanti.cr/2singles ...",
        "__v": 0
    },
    {
        "_id": "swamiasdf",
        "title": "Ed Sheeran - Shape of You [Official Video]",
        "thumbnail": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAs8aX0ACEG9PZWCbmZtwXgSkEzng",
        "duration": "4:24",
        "videoId": "JGwWNGJdvx8",
        "channelName": "Ed Sheeran",
        "channelId": "/channel/UC0C-w0YjGpqDXGB8IHb662A",
        "uploadedOn": "3 years ago4,676,807,252 views",
        "views": "4,676,807,252 views",
        "description": "Tickets for the Divide tour here - http://www.edsheeran.com/tourStream or Download Shape Of You: https://atlanti.cr/2singles ...",
        "__v": 0
    },
]

const userPls = [{
    "_id": "5e2cd595ed98b102f453ec8f",
    "createdAt": "1579981295316",
    "updatedAt": "1584248650513",
    "name": "Spotify Playlist",
    "createdBy": "5e22c4d1744dcb0369e667e5",
    "metaDataId": "4003b8a0-3fce-11ea-8bdc-9f907ef25759",
    "songs": [{
        "_id": "5e2cd597ed98b1014c53ec90",
        "title": "Dean Lewis - Be Alright (Lyrics)",
        "thumbnail": "https://i.ytimg.com/vi/OymVgai_PVg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDNKM7so-wIY70O99GastMuJXD1Cw",
        "duration": "3:16",
        "videoId": "OymVgai_PVg",
        "channelName": "Gold Coast Music",
        "channelId": "/channel/UC0aXGG4J16PmxgZo10Nzk6A",
        "uploadedOn": "1 year ago85,783,201 views",
        "views": "85,783,201 views",
        "description": "Subscribe To GoldCoastMusic For New Music Daily! https://www.youtube.com/c/goldcoastmusic Stream Dean Lewis - Be Alright ..."
    }, {
        "_id": "5e2cd5b7ed98b17d2653ec91",
        "title": "The Black Eyed Peas, J Balvin - RITMO (Bad Boys For Life) (Audio)",
        "thumbnail": "https://i.ytimg.com/vi/C9xrAJ_rmBw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLB_5Zklwz0SlR_8UfC9i6iSlGKcdA",
        "duration": "3:44",
        "videoId": "C9xrAJ_rmBw",
        "channelName": "Black Eyed Peas",
        "channelId": "/channel/UCBFaOy1_APEXEyA6Gws_Y1g",
        "uploadedOn": "3 months ago13,909,275 views",
        "views": "13,909,275 views",
        "description": "\"RITMO (Bad Boys For Life)\" single available at: https://smarturl.it/RITMO Follow Black Eyed Peas online Facebook: ..."
    }, {
        "_id": "5e2cd5cded98b1716753ec92",
        "title": "Kina - Can We Kiss Forever? (ft. Adriana Proenza)",
        "thumbnail": "https://i.ytimg.com/vi/qz7tCZE_3wA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCvIloea2aYnYVei-PjBDBvyk_dtg",
        "duration": "3:09",
        "videoId": "qz7tCZE_3wA",
        "channelName": "the bootleg boy",
        "channelId": "/channel/UC0fiLCwTmAukotCXYnqfj0A",
        "uploadedOn": "1 year ago66,338,272 views",
        "views": "66,338,272 views",
        "description": "'can we kiss forever?' by Kina Lofi/Chill Beats More sad and chill songs - http://bit.do/sad-lofi Stream/Purchase ..."
    }, {
        "_id": "5e2cd5ebed98b1986353ec93",
        "title": "Lil Nas X - Old Town Road (Official Video) ft. Billy Ray Cyrus",
        "thumbnail": "https://i.ytimg.com/vi/r7qovpFAGrQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAxwAqlEOPkKA3M4jPxQxxuH7VNmA",
        "duration": "2:38",
        "videoId": "r7qovpFAGrQ",
        "channelName": "Lil Nas X",
        "channelId": "/channel/UC_uMv3bNXwapHl8Dzf2p01Q",
        "uploadedOn": "6 months ago273,190,726 views",
        "views": "273,190,726 views",
        "description": "Week 17 version of Lil Nas X's Billboard #1 hit, “Old Town Road (Remix)” featuring Billy Ray Cyrus. Listen & Download “Old Town ..."
    }, {
        "_id": "5e2cd600ed98b1ae0e53ec94",
        "title": "Billie Eilish, Khalid - lovely",
        "thumbnail": "https://i.ytimg.com/vi/V1Pl8CzNzCw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAzcFF82krZ2AXJ_JFbxSXqceOmvA",
        "duration": "3:21",
        "videoId": "V1Pl8CzNzCw",
        "channelName": "Billie Eilish",
        "channelId": "/channel/UCiGm_E4ZwYSHV3bcW1pnSeQ",
        "uploadedOn": "1 year ago560,758,441 views",
        "views": "560,758,441 views",
        "description": "Listen to “lovely” (with Khalid): http://smarturl.it/lovelysingle Listen to “WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?"
    }, {
        "_id": "5e2cd614ed98b1437e53ec95",
        "title": "Dr. Dre ft. Snoop Dogg - Still D.R.E. (Official Video)",
        "thumbnail": "https://i.ytimg.com/vi/_CL6n0FJZpk/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLD5AL7AOiTQYN0nBJ-J5ukgWI2mYQ",
        "duration": "4:52",
        "videoId": "_CL6n0FJZpk",
        "channelName": "Dr. Dre",
        "channelId": "/channel/UCmHhviensDlGQeU8Yo80zdg",
        "uploadedOn": "8 years ago703,829,322 views",
        "views": "703,829,322 views",
        "description": "Get COMPTON the NEW ALBUM from Dr. Dre on Apple Music: http://smarturl.it/Compton Music video by Dr. Dre performing Still ..."
    }, {
        "_id": "5e2cd65ded98b180bb53ec96",
        "title": "Coolio - Gangsta's Paradise [Original] [HD Sound]",
        "thumbnail": "https://i.ytimg.com/vi/i_zsGdk62OY/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLB2Wdt5I2vL2lCDNM6zoAHef1-Pxg",
        "duration": "4:02",
        "videoId": "i_zsGdk62OY",
        "channelName": "Foxium",
        "channelId": "/user/TheMrFOXIUM",
        "uploadedOn": "7 years ago138,004 views",
        "views": "138,004 views",
        "description": "Coolio - Gangsta's Paradise [Original] [HD Sound]"
    }, {
        "_id": "5e2cd68aed98b1193653ecc9",
        "title": "blackbear - hot girl bummer (audio)",
        "thumbnail": "https://i.ytimg.com/vi/UHFhvVebr_E/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDNJgtYNe7wLtzDKHp8ecxN21jyXA",
        "duration": "3:06",
        "videoId": "UHFhvVebr_E",
        "channelName": "SurrealSelf Music",
        "channelId": "/user/joshjamesdavidriley",
        "uploadedOn": "5 months ago99,492 views",
        "views": "99,492 views",
        "description": "listen: https://smarturl.it/hotgirlbummer spotify: https://smarturl.it/hotgirlbummer/spotify apple music: ..."
    }, {
        "_id": "5e2cd6b8ed98b121e253ecca",
        "title": "Green Day - Boulevard of Broken Dreams HQ",
        "thumbnail": "https://i.ytimg.com/vi/-6NbgCkanp0/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCnl4r7fvwE7ctqg6D7JDL_lAweKA",
        "duration": "4:26",
        "videoId": "-6NbgCkanp0",
        "channelName": "ReadAndHear",
        "channelId": "/user/ReadAndHear",
        "uploadedOn": "7 years ago54,546 views",
        "views": "54,546 views",
        "description": ""
    }, {
        "_id": "5e2cd6ebed98b1e83353eccb",
        "title": "Maroon 5 - Memories (Audio)",
        "thumbnail": "https://i.ytimg.com/vi/qZjYggYSzc8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLALC1tFULouPpko9JLK9FVBdd2Gww",
        "duration": "3:11",
        "videoId": "qZjYggYSzc8",
        "channelName": "Maroon 5",
        "channelId": "/channel/UCBVjMGOIkavEAhyqpxJ73Dw",
        "uploadedOn": "4 months ago11,957,620 views",
        "views": "11,957,620 views",
        "description": "Memories” is out now. https://smarturl.it/MemoriesMaroon5 For more, visit: https://www.facebook.com/maroon5 ..."
    }, {
        "_id": "5e2cdceaed98b1620e53eccc",
        "title": "Vetri Kodi Kattu - Padayappa",
        "thumbnail": "https://i.ytimg.com/vi/PZJ3njHYy7I/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDZF9ofbj-_Xs2o31guguyfe1va1Q",
        "duration": "4:46",
        "videoId": "PZJ3njHYy7I",
        "channelName": "Satish Shyam",
        "channelId": "/channel/UCsY9Sc5RAR6bFKa7IIhZsag",
        "uploadedOn": "6 months ago1,189,563 views",
        "views": "1,189,563 views",
        "description": "Sriram."
    }, {
        "_id": "5e2d0b2aed98b10f9653ecd5",
        "title": "Vikram Vedha Songs | Tasakku Tasakku Video Song feat. Vijay Sethupathi | R. Madhavan | Sam C S",
        "thumbnail": "https://i.ytimg.com/vi/Rw3ePD8qLcc/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDo22qsugVdn1n-0dLF_D4H3cwJbg",
        "duration": "4:01",
        "videoId": "Rw3ePD8qLcc",
        "channelName": "Think Music India",
        "channelId": "/user/thinkmusicindia",
        "uploadedOn": "2 years ago18,313,961 views",
        "views": "18,313,961 views",
        "description": "Seethakaathi Official Trailer ▻ https://bit.ly/2PLkfV7 Seemaraja Songs Jukebox ▻ https://bit.ly/2vvcTc5 Watch Latest #Kollywood ..."
    }, {
        "_id": "5e2efc7e61efc534d4a0d2bc",
        "title": "Aayiram kannumay",
        "thumbnail": "https://i.ytimg.com/vi/IcTHBfdXILQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBejMYvTPmdomNqa1SKZJR9OWhlsQ",
        "duration": "3:11",
        "videoId": "IcTHBfdXILQ",
        "channelName": "SuperMusikluv",
        "channelId": "/user/SuperMusikluv",
        "uploadedOn": "7 years ago1,167,555 views",
        "views": "1,167,555 views",
        "description": "Thanks to thattathin marayath crew fr gifting this song more melodiously.. :)"
    }, {
        "_id": "5e2efe2b61efc5fa0da0d2bd",
        "title": "AAYIRAM KANNUMAAY...",
        "thumbnail": "https://i.ytimg.com/vi/DEv46uAMDxU/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBciE4GKp0x8DGtTkwivKAk0kBIDA",
        "duration": "5:06",
        "videoId": "DEv46uAMDxU",
        "channelName": "Seena siyad",
        "channelId": "/channel/UC3coYwliAj_h_FbWjhlln6w",
        "uploadedOn": "2 years ago32,624 views",
        "views": "32,624 views",
        "description": "Music-ജെറി അമൽദേവ് Lyricist-ബിച്ചു തിരുമല Singer- KS Chitra Year: 1985 Film-നോക്കെത്താ ദൂരത്ത് കണ്ണും..."
    }, {
        "_id": "5e2f813c61efc5ff55a0d2c4",
        "title": "Mukkathe Penne | Official Video Song HD | Ennu Ninte Moideen | Prithviraj | Parvathi",
        "thumbnail": "https://i.ytimg.com/vi/graP-a1MxN4/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCD9Y_fY--j86tdez1Hwz2pw_DqWg",
        "duration": "3:48",
        "videoId": "graP-a1MxN4",
        "channelName": "satyamvideos",
        "channelId": "/user/satyamvideos",
        "uploadedOn": "4 years ago21,896,054 views",
        "views": "21,896,054 views",
        "description": "Newton Movies Presents \"Ennu Ninte Moideen \" Written & Directed by R.S.Vimal Song - MUKKATHE PENNE Music - Gopi Sundar ..."
    }, {
        "_id": "5e2fafac61efc555f8a0d2ca",
        "title": "DMX - X Gon Give To Ya (Deadpool Song) [Official Music Video] Free Download HD",
        "thumbnail": "https://i.ytimg.com/vi/OH_Xf35mzLA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAFGM74mcwuzKoiMWJytjj_QZa57w",
        "duration": "3:52",
        "videoId": "OH_Xf35mzLA",
        "channelName": "Marcelo Manga",
        "channelId": "/channel/UCyCwbRB-f-G5J-telTk9X1w",
        "uploadedOn": "3 years ago63,646,805 views",
        "views": "63,646,805 views",
        "description": "Esta Es La Canción Oficial de Deadpool, espero que les guste *o* Link ◢ ◤ https://mega.nz/#!bk0AhJiZ!"
    }, {
        "_id": "5e319e3fea6a3f3be73be708",
        "title": "Give Me Some Sunshine Lyrical Video | 3 Idiots | Aamir Khan, R. Madhavan, Sharman Joshi",
        "thumbnail": "https://i.ytimg.com/vi/lcepEwfSUCI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBUO4TJVEfJE3k3XFDhvUIVowmQ8w",
        "duration": "4:26",
        "videoId": "lcepEwfSUCI",
        "channelName": "T-Series",
        "channelId": "/user/tseries",
        "uploadedOn": "1 year ago7,008,179 views",
        "views": "7,008,179 views",
        "description": "T-Series present Bollywood Movie 3 Idiots lyrical video song \"Give Me Some Sunshine\" movie starring Aamir Khan, Kareena ..."
    }, {
        "_id": "5e31b473ea6a3fbfda3be709",
        "title": "Kanne kalaimane tamil HD K.J.Yesudas with clear audio..",
        "thumbnail": "https://i.ytimg.com/vi/oNRpH0ET7F0/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDVeYYCPai-NKznoAjIT0uFuXY-CA",
        "duration": "4:11",
        "videoId": "oNRpH0ET7F0",
        "channelName": "Arun Kumar official",
        "channelId": "/channel/UCa9-L_FSZ2dQiCohlNRExew",
        "uploadedOn": "1 year ago1,275,393 views",
        "views": "1,275,393 views",
        "description": ""
    }, {
        "_id": "5e31b92857ea7ed9900f208c",
        "title": "Padaiyappa - Minsara Poove (1999) (audio song)",
        "thumbnail": "https://i.ytimg.com/vi/3pj38HmpLA0/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCEhDSbnov58Z_Z4wh3IRnC0sV8AQ",
        "duration": "6:20",
        "videoId": "3pj38HmpLA0",
        "channelName": "Sagar Vinod",
        "channelId": "/channel/UCcJ4fWY-cTe9NQagZwO_qjQ",
        "uploadedOn": "2 years ago715,447 views",
        "views": "715,447 views",
        "description": "Movie : Padayappa Music : A.R. Rahman Lyrics : Vairamuthu Singer : Srinivas, Nithyasree Mahadevan (Backing vocals by ..."
    }, {
        "_id": "5e33802a771c12bf278eeb13",
        "title": "Justin Bieber - As Long As You Love Me ft. Big Sean (Official Audio)",
        "thumbnail": "https://i.ytimg.com/vi/v-FVihIlU2g/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAuDvKXHBTBxtQygDSZREc2qteKXw",
        "duration": "3:50",
        "videoId": "v-FVihIlU2g",
        "channelName": "Justin Bieber",
        "channelId": "/channel/UCIwFjwMjI0y7PDBVEO9-bkQ",
        "uploadedOn": "7 years ago63,922,265 views",
        "views": "63,922,265 views",
        "description": "Justin Bieber - As Long As You Love Me: iTunes: http://smarturl.it/iALAYLM Justin has 8 #VEVOCertified videos and counting!"
    }, {
        "_id": "5e340214771c1256ce8eeb16",
        "title": "Kaadhalenum Thervezhuthi High Quality 7 1 Surround 4D Songs",
        "thumbnail": "https://i.ytimg.com/vi/WTziW2AqbnU/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDul0vkDx7XebFSCqqdlYqdQr-j8w",
        "duration": "6:37",
        "videoId": "WTziW2AqbnU",
        "channelName": "Tamil Echo Songs",
        "channelId": "/channel/UCbn-mU0m4TY9Ilz6kWPPAxQ",
        "uploadedOn": "1 year ago10,256 views",
        "views": "10,256 views",
        "description": ""
    }, {
        "_id": "5e340ad3771c123c858eeb17",
        "title": "Visiri Lyrics – Enai Noki Paayum Thota",
        "thumbnail": "https://i.ytimg.com/vi/sv9_VG6xA00/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCPEaX2mKCS5XpgabklV2js0hdP1w",
        "duration": "5:09",
        "videoId": "sv9_VG6xA00",
        "channelName": "Paattu Puthagam",
        "channelId": "/channel/UCennZNm1I26gg0f3Vh9UFHQ",
        "uploadedOn": "1 year ago95,345 views",
        "views": "95,345 views",
        "description": ""
    }, {
        "_id": "5e34bf5b771c12824c8eeb1a",
        "title": "Britney Spears - Toxic (Audio)",
        "thumbnail": "https://i.ytimg.com/vi/ICjG8t_SnSg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBsZdB3GMMpNy9FXy7d5sD9bsDasg",
        "duration": "3:20",
        "videoId": "ICjG8t_SnSg",
        "channelName": "Britney Jean Spears",
        "channelId": "/user/BritneySpearsSMEVEVO",
        "uploadedOn": "8 years ago8,406,314 views",
        "views": "8,406,314 views",
        "description": "Artista: Britney Spears Álbum: In The Zone Canción: Toxic."
    }, {
        "_id": "5e38e277379ffe1db97c0604",
        "title": "Britney Spears - ...Baby One More Time (Audio)",
        "thumbnail": "https://i.ytimg.com/vi/xSsjQBVaACw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDqEEQEgBxhc-MW6HWg6JTApPwF6g",
        "duration": "3:32",
        "videoId": "xSsjQBVaACw",
        "channelName": "Britney Jean Spears",
        "channelId": "/user/BritneySpearsSMEVEVO",
        "uploadedOn": "8 years ago626,742 views",
        "views": "626,742 views",
        "description": "Artista: Britney Spears Álbum: ...Baby One More Time Canción: ...Baby One More Time."
    }, {
        "_id": "5e361106379ffe81187c059d",
        "title": "DARBAR (Tamil) - Thani Vazhi (Lyric Video) | Rajinikanth | AR Murugadoss | Anirudh | Subaskaran",
        "thumbnail": "https://i.ytimg.com/vi/DS_zWuDq_RI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAGkCV6zKQ88Mfl49ezttjNV1nHmA",
        "duration": "3:41",
        "videoId": "DS_zWuDq_RI",
        "channelName": "divomovies",
        "channelId": "/user/divotamilmovies",
        "uploadedOn": "1 month ago6,367,011 views",
        "views": "6,367,011 views",
        "description": "Listen to it Exclusively on Gaana - https://gaana.com/album/darbar-tamil Presenting the Official Lyric Video of 'Thani Vazhi' from ..."
    }, {
        "_id": "5e413db0a82555c80efdb910",
        "title": "Mustafa Mustafa Song | Kadhal Desam Movie Songs | AR Rahman | Vineeth | Abbas | Tamil Hit Songs 2017",
        "thumbnail": "https://i.ytimg.com/vi/Fhgpf2ikOWY/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLABwE2P7GhwRfbv-EUcNXgnLc7afQ",
        "duration": "6:12",
        "videoId": "Fhgpf2ikOWY",
        "channelName": "APITamilSongs",
        "channelId": "/user/apitamilsongs",
        "uploadedOn": "2 years ago1,697,892 views",
        "views": "1,697,892 views",
        "description": "Tamil Hit Songs 2017. Mustafa Mustafa Song from Kadhal Desam Movie. Kadhal Desam Tamil movie ft. Vineeth, Abbas and Tabu, ..."
    }, {
        "_id": "5e417c4af480a474c02e8e75",
        "title": "Dance Monkey (Audio) - Tones And I",
        "thumbnail": "https://i.ytimg.com/vi/v3iwhItMjwA/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA7AtbuEHh5NDC4XZOVV6tQY2dkIg",
        "duration": "3:31",
        "videoId": "v3iwhItMjwA",
        "channelName": "familylyricschannel",
        "channelId": "/user/familylyricschannel",
        "uploadedOn": "3 months ago198,031 views",
        "views": "198,031 views",
        "description": "This is the audio for \"Dance Monkey\" by Tones And I. From the single, \"Dance Monkey\". This song was written by: Toni Watson."
    }, {
        "_id": "5e489cd0d603d406b7555b84",
        "title": "Roja   Chinna Chinna Asai | High Quality Audio | High Quality Audio",
        "thumbnail": "https://i.ytimg.com/vi/Qi4yrJ88ZTE/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAjXJWt6hp6VNXYnQW32WWPBopdQg",
        "duration": "4:54",
        "videoId": "Qi4yrJ88ZTE",
        "channelName": "The Mastering Project",
        "channelId": "/channel/UCjJY9L5Iy6MCsflooCsHfsw",
        "uploadedOn": "2 years ago105,164 views",
        "views": "105,164 views",
        "description": "A Playlist of High Quality Audio of A.R. Rahman. Hearing the genius of A.R. Rahman and H. Sridhar in all its true glory is ..."
    }, {
        "_id": "5e4a1701d603d424c1555b85",
        "title": "Master - Kutti Story Lyric | Thalapathy Vijay | Anirudh Ravichander | Lokesh Kanagaraj",
        "thumbnail": "https://i.ytimg.com/vi/gjnrtCKZqYg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDSD5i3rlUP0VYbQMv3ndK0kbLZyQ",
        "duration": "5:23",
        "videoId": "gjnrtCKZqYg",
        "channelName": "Sony Music South",
        "channelId": "/channel/UCn4rEMqKtwBQ6-oEwbd4PcA",
        "uploadedOn": "2 days ago13,505,381 views",
        "views": "13,505,381 views",
        "description": "#Thalapathy has a thought-provoking tale for all of you ! Presenting the rousing #KuttiStory from #Master loaded with his ..."
    }, {
        "_id": "5e4c1ce8d603d42514555b8d",
        "title": "Kikku Yerudhey - Padayappa",
        "thumbnail": "https://i.ytimg.com/vi/w9yV5tuC7bo/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA_YLmz5__J_65KOZ6MrpYBprtI9Q",
        "duration": "5:31",
        "videoId": "w9yV5tuC7bo",
        "channelName": "Satish Shyam",
        "channelId": "/channel/UCsY9Sc5RAR6bFKa7IIhZsag",
        "uploadedOn": "7 months ago2,379,525 views",
        "views": "2,379,525 views",
        "description": "Mano, Febi."
    }, {
        "_id": "5e4c211bd603d41ded555b8e",
        "title": "Loving strangers - Russian Red.",
        "thumbnail": "https://i.ytimg.com/vi/NgbcXig1TZ8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAf3QLgWit3XA-kg86PpE0m7uLFEg",
        "duration": "3:56",
        "videoId": "NgbcXig1TZ8",
        "channelName": "loveferdinand",
        "channelId": "/user/loveferdinand",
        "uploadedOn": "9 years ago4,001,682 views",
        "views": "4,001,682 views",
        "description": "Fántastico tema interpretado por Lourdes Hernández (Russian Red), que aparece en la banda sonora de la nueva película de ..."
    }, {
        "_id": "5e4c346ed603d437ad555b8f",
        "title": "Madrasapattinam - Pookkal Pookkum Tharunam (audio song)",
        "thumbnail": "https://i.ytimg.com/vi/aXFjcnP-pR8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAEBpwkENrhoJiFrnoMRfrrZyT6sA",
        "duration": "6:38",
        "videoId": "aXFjcnP-pR8",
        "channelName": "Sagar Vinod",
        "channelId": "/channel/UCcJ4fWY-cTe9NQagZwO_qjQ",
        "uploadedOn": "10 months ago19,619 views",
        "views": "19,619 views",
        "description": ""
    }, {
        "_id": "5e4d1c91d603d4ac19555b90",
        "title": "Titanic Theme Song • My Heart Will Go On • Celine Dion (8D Audio🎧)",
        "thumbnail": "https://i.ytimg.com/vi/9KSthcRX6SE/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLC3dGhWWkOzJMwpoMLTc8y4qlrbtQ",
        "duration": "4:14",
        "videoId": "9KSthcRX6SE",
        "channelName": "8D SOUNDS",
        "channelId": "/channel/UC5TTLXzvhIDbHagriuBasVQ",
        "uploadedOn": "1 year ago10,271,888 views",
        "views": "10,271,888 views",
        "description": "Donate Us: paypal.me/duckmedia0 Titanic Theme Song • My Heart Will Go On • Celine Dion (8D Audio) (Use headphones and ..."
    }, {
        "_id": "5e50b7acd603d42f82555b99",
        "title": "Enna Solla Pogirai | Ajith Kumar | A.R. Rahman | Tamil | Lyrical Video | HD Song",
        "thumbnail": "https://i.ytimg.com/vi/Xt3zsCUkzHg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBOA_Z7fYsYuI93qPU1K2a6FZsl-g",
        "duration": "6:02",
        "videoId": "Xt3zsCUkzHg",
        "channelName": "Saregama Tamil",
        "channelId": "/user/SaregamaTamil",
        "uploadedOn": "2 years ago3,750,137 views",
        "views": "3,750,137 views",
        "description": "Song Lyrics in English & Tamil - Kandukondain Kandukondain is one the Best Love Romantic Drama. Oscar award winner A.R. ..."
    }, {
        "_id": "5e5230d4d603d428b3555c44",
        "title": "Enna Sonna Full Audio - Arijit Singh, A.R. Rahman",
        "thumbnail": "https://i.ytimg.com/vi/vDCaDcuhwxE/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCNtF1wDs2hqf24h0AlT86W5VXhIQ",
        "duration": "3:34",
        "videoId": "vDCaDcuhwxE",
        "channelName": "Music Lover",
        "channelId": "/channel/UCmNzzKC309bVkWHGx85P2hw",
        "uploadedOn": "3 years ago30,441 views",
        "views": "30,441 views",
        "description": "Listen to the full audio of Enna Sonna from Ok Jaanu, sung by Arijit Singh, composed by AR Rahman, and written by Gulzar."
    }, {
        "_id": "5e54f596d603d44c06555c45",
        "title": "Apple Penne Nee Yaaro, Roja Kootam.(ஆப்பிள் பெண்ணே நீ யாரோ ஐஸ்க்ரீம் சிலையே) 1080p HD",
        "thumbnail": "https://i.ytimg.com/vi/PIPdwt5OnM8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDnzicvA36sgX8ekXoqprWHDf9L1w",
        "duration": "5:07",
        "videoId": "PIPdwt5OnM8",
        "channelName": "Gladwin xavier",
        "channelId": "/channel/UC0YtukhXZcq2E7JXV9W4fNw",
        "uploadedOn": "2 years ago183,921 views",
        "views": "183,921 views",
        "description": ""
    }, {
        "_id": "5e54f694d603d41f04555c48",
        "title": "Katre Poongatre Song | Priyamaana Thozhi Movie Songs | Madhavan | Sreedevi | SA Rajkumar",
        "thumbnail": "https://i.ytimg.com/vi/eczR_IE919s/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLACdAN4xKLuJ2ec2W13Uw5A4_Eb7Q",
        "duration": "4:24",
        "videoId": "eczR_IE919s",
        "channelName": "APITamilSongs",
        "channelId": "/user/apitamilsongs",
        "uploadedOn": "2 years ago10,741,088 views",
        "views": "10,741,088 views",
        "description": "Katre Poongatre Song from Priyamaana Thozhi Movie Songs. Priyamaana Thozhi movie ft. Madhavan, Jyothika, Sreedevi ..."
    }, {
        "_id": "5e55d923d603d44e0b555c4a",
        "title": "Charlie Puth - Dangerously [Official Audio]",
        "thumbnail": "https://i.ytimg.com/vi/Xc695u4RFeI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLANScSRwm8INelIDFV5NCqPVG7wUg",
        "duration": "3:20",
        "videoId": "Xc695u4RFeI",
        "channelName": "Charlie Puth",
        "channelId": "/channel/UCwppdrjsBPAZg5_cUwQjfMQ",
        "uploadedOn": "4 years ago13,946,220 views",
        "views": "13,946,220 views",
        "description": "Charlie Puth's debut album Nine Track Mind is available now! Download: http://smarturl.it/NineTrackMind Stream: ..."
    }, {
        "_id": "5e5d78f3154f42394d34d680",
        "title": "sakkarai nilave pen nilave",
        "thumbnail": "https://i.ytimg.com/vi/6oz8eeiEZKY/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCvRrqsAfRHpmIBAxZQCKSsbnftQg",
        "duration": "5:03",
        "videoId": "6oz8eeiEZKY",
        "channelName": "Prajeesh K Radhakrishnan",
        "channelId": "/user/PRAJI2801432",
        "uploadedOn": "9 years ago172,563 views",
        "views": "172,563 views",
        "description": ""
    }, {
        "_id": "5e5f3c11154f42860634d682",
        "title": "Anugraheethan Antony| Kamini Full Song |Sunny Wayne,Gouri G Kishan| KS Harisankar|Arun Muraleedharan",
        "thumbnail": "https://i.ytimg.com/vi/FLz9hCjELWk/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBhf7hl9zJdKs7KCiBwBGJPub49kw",
        "duration": "4:15",
        "videoId": "FLz9hCjELWk",
        "channelName": "Muzik247",
        "channelId": "/user/muzik247tz",
        "uploadedOn": "2 months ago8,725,051 views",
        "views": "8,725,051 views",
        "description": "Presenting the much awaited official video of #Kamini song from #AnugraheethanAntony, an upcoming Malayalam movie starring ..."
    }, {
        "_id": "5e5ffed00a7a637e8166bd14",
        "title": "Arabu Naadae | Vaali | Yuvan | Thottal Poo Malarum | Tamil | Lyrical Video | HD Song",
        "thumbnail": "https://i.ytimg.com/vi/-UFr_Qsf9VQ/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBf2OwRd3K-GrIW6fHKfn6P1I3wJg",
        "duration": "5:32",
        "videoId": "-UFr_Qsf9VQ",
        "channelName": "Saregama Tamil",
        "channelId": "/user/SaregamaTamil",
        "uploadedOn": "2 years ago322,145 views",
        "views": "322,145 views",
        "description": "Arabu Naadae Song Lyrics in English & Tamil - Super hit Love melody track of Vaali Lyrics from Thottal Poo Malarum Movie."
    }, {
        "_id": "5e6096e00a7a63b7fa66bd15",
        "title": "Kamini Violin Cover | Mulle Mulle | Anugraheethan Antony | Aathma #MulleMulle #Kamini #Harisankar",
        "thumbnail": "https://i.ytimg.com/vi/PDAtz6I2n2k/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAqeEZowvhjeGE5OtZlmzlBQKB7iQ",
        "duration": "2:05",
        "videoId": "PDAtz6I2n2k",
        "channelName": "Aathma",
        "channelId": "/channel/UCR6CtZcveV3SKn99nOx1ccA",
        "uploadedOn": "1 month ago41,930 views",
        "views": "41,930 views",
        "description": "Here we go. Our first upload of 2020. Presenting the Violin Cover for the much awaited 'Kamini...' from Anugraheethan Antony ..."
    }, {
        "_id": "5e60b1ed0a7a631d4d66bd16",
        "title": "Nanban song - Endhan Kan munne - Lyrics",
        "thumbnail": "https://i.ytimg.com/vi/55Rd9I39j4w/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA7Fv_7W1u2kFemTowZcqC3M8c_jA",
        "duration": "2:09",
        "videoId": "55Rd9I39j4w",
        "channelName": "TheVijayworld",
        "channelId": "/user/TheVijayworld",
        "uploadedOn": "8 years ago145,321 views",
        "views": "145,321 views",
        "description": "Nanban song - Endhan Kan munne - Lyrics."
    }, {
        "_id": "5e692d4a0a7a63efed66bf04",
        "title": "ale ale :: boys :: lyrics",
        "thumbnail": "https://i.ytimg.com/vi/MKKtmbqonZk/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCfB0Six2w-SFCh-VJHaOgV-iysdw",
        "duration": "6:22",
        "videoId": "MKKtmbqonZk",
        "channelName": "Vinny Vijoy",
        "channelId": "/user/vin13rockzz",
        "uploadedOn": "9 years ago124,149 views",
        "views": "124,149 views",
        "description": "a lovel song from boyzz.......... with sing along lyrics....enjoy.."
    }, {
        "_id": "5e6db74a3ae886fc3080b0f4",
        "title": "Koova (From \"Ondraga Originals\")",
        "thumbnail": "https://i.ytimg.com/vi/CyAe0gdwbrE/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAZmVieT4Wh1P-EGOO14RkS2Cxttg",
        "duration": "3:41",
        "videoId": "CyAe0gdwbrE",
        "channelName": "Chinnaponnu - Topic",
        "channelId": "/channel/UCOR0y64eVE8Q4NSKzt24pmw",
        "uploadedOn": "",
        "views": "330 views",
        "description": "Provided to YouTube by Divo TV Private Limited Koova (From \"Ondraga Originals\") · Chinnaponnu Koova (From \"Ondraga ..."
    }],
    "__v": "49",
    "thumbnail": "https://i.ytimg.com/vi/CyAe0gdwbrE/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAZmVieT4Wh1P-EGOO14RkS2Cxttg",
    "totalSongs": "45",
}, {
    "_id": "5e2cf383ed98b16cbb53eccd",
    "createdAt": "1579981295316",
    "updatedAt": "1582626235224",
    "name": "Romance ",
    "createdBy": "5e22c4d1744dcb0369e667e5",
    "metaDataId": "168f84b0-3fe0-11ea-8bdc-9f907ef25759",
    "songs": [{
        "_id": "5e2cf703ed98b128f353eccf",
        "title": "Yaen Ennai Pirindhaai (Lyric Video) | Adithya varma |  Dhruv Vikram, Banita Sandhu, Priya Anand | HD",
        "thumbnail": "https://i.ytimg.com/vi/psxr4XFNBeo/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBl5ywGfpWoVvXRzkwB_WsxTWPuUw",
        "duration": "3:19",
        "videoId": "psxr4XFNBeo",
        "channelName": "Adhi Studio",
        "channelId": "/channel/UCAr6NCCMF_tJry40I_oFNtA",
        "uploadedOn": "3 months ago5,970,764 views",
        "views": "5,970,764 views",
        "description": "Singer : Sid Sriram Lyrics : Radhan Directed by: Gireesaaya Produced by: Mukesh Mehta Story by: Sandeep Vanga Based on: ..."
    }, {
        "_id": "5e2cf7eded98b1a69553ecd0",
        "title": "Justin Bieber - Boyfriend (Official Audio)",
        "thumbnail": "https://i.ytimg.com/vi/xYoxBQ03wUQ/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBVFUgHhPQZqha4ucLhXcs5D791Zw",
        "duration": "2:53",
        "videoId": "xYoxBQ03wUQ",
        "channelName": "Justin Bieber",
        "channelId": "/channel/UCIwFjwMjI0y7PDBVEO9-bkQ",
        "uploadedOn": "7 years ago56,494,886 views",
        "views": "56,494,886 views",
        "description": "iTunes: http://smarturl.it/boyfriend Music video by Justin Bieber performing Boyfriend (Audio). © 2012 The Island Def Jam Music ..."
    }, {
        "_id": "5e2f856261efc53d56a0d2c6",
        "title": "Justin Bieber Feat. Ludacris - Baby (Official Audio) (2010)",
        "thumbnail": "https://i.ytimg.com/vi/ieWe5AW1uNY/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAa6SWpldAJKjSwX6oCq3LXg3Deww",
        "duration": "3:41",
        "videoId": "ieWe5AW1uNY",
        "channelName": "Justin B.",
        "channelId": "/channel/UC0cMLf4RQ5RkDH7_XKJWhIQ",
        "uploadedOn": "5 years ago470,523 views",
        "views": "470,523 views",
        "description": ""
    }, {
        "_id": "5e338aae771c12ac878eeb14",
        "title": "Justin Bieber - As Long As You Love Me ft. Big Sean (Official Audio)",
        "thumbnail": "https://i.ytimg.com/vi/v-FVihIlU2g/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAuDvKXHBTBxtQygDSZREc2qteKXw",
        "duration": "3:50",
        "videoId": "v-FVihIlU2g",
        "channelName": "Justin Bieber",
        "channelId": "/channel/UCIwFjwMjI0y7PDBVEO9-bkQ",
        "uploadedOn": "7 years ago63,922,265 views",
        "views": "63,922,265 views",
        "description": "Justin Bieber - As Long As You Love Me: iTunes: http://smarturl.it/iALAYLM Justin has 8 #VEVOCertified videos and counting!"
    }, {
        "_id": "5e482babd603d43198555ad9",
        "title": "Jeans - Poovukkul Olinthirukkum (1998) (audio song)",
        "thumbnail": "https://i.ytimg.com/vi/gE2zcl4hICg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDBRqpiANpv4nEpDRXFwFYSqKx_0Q",
        "duration": "6:56",
        "videoId": "gE2zcl4hICg",
        "channelName": "Sagar Vinod",
        "channelId": "/channel/UCcJ4fWY-cTe9NQagZwO_qjQ",
        "uploadedOn": "1 year ago963,975 views",
        "views": "963,975 views",
        "description": "Movie : Jeans Music : A.R. Rahman Lyrics : Vairamuthu Singer : Unnikrishnan, Sujatha."
    }, {
        "_id": "5e54f5bbd603d43aa2555c47",
        "title": "Apple Penne Nee Yaaro, Roja Kootam.(ஆப்பிள் பெண்ணே நீ யாரோ ஐஸ்க்ரீம் சிலையே) 1080p HD",
        "thumbnail": "https://i.ytimg.com/vi/PIPdwt5OnM8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDnzicvA36sgX8ekXoqprWHDf9L1w",
        "duration": "5:07",
        "videoId": "PIPdwt5OnM8",
        "channelName": "Gladwin xavier",
        "channelId": "/channel/UC0YtukhXZcq2E7JXV9W4fNw",
        "uploadedOn": "2 years ago183,921 views",
        "views": "183,921 views",
        "description": ""
    }],
    "__v": "7",
    "thumbnail": "https://i.ytimg.com/vi/PIPdwt5OnM8/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDnzicvA36sgX8ekXoqprWHDf9L1w",
    "totalSongs": "6",
}, {
    "_id": "5e2cfa1fed98b19dbd53ecd1",
    "createdAt": "1579981295316",
    "updatedAt": "1581122372174",
    "name": "Oldies",
    "createdBy": "5e22c4d1744dcb0369e667e5",
    "metaDataId": "078b8960-3fe4-11ea-8bdc-9f907ef25759",
    "songs": [{
        "_id": "5e2cfa31ed98b1be1853ecd3",
        "title": "Maankuyile Poonkuyile (Duet) - HQ Digital Audio - மாங்குயிலே பூங்குயிலே - Karagattakkaran",
        "thumbnail": "https://i.ytimg.com/vi/zO4bz-18qRI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAVBSFrMIVYsj-R9qDz6M65VOrGVQ",
        "duration": "4:24",
        "videoId": "zO4bz-18qRI",
        "channelName": "Kadar Majee",
        "channelId": "/channel/UCnSxRc2g9u7qfh_iAoGbffg",
        "uploadedOn": "2 years ago59,474 views",
        "views": "59,474 views",
        "description": "Movie - Karagattakkaaran, Music - Ilaiyaraja, Lyrics - Gangai Amaran, Singers - SP Balasubramaniam, S Janaki."
    }, {
        "_id": "5e2cfa5aed98b16f0d53ecd4",
        "title": "Oorai Therinchikitten - HQ Digital Audio (Remastered) - ஊரை தெரிஞ்சிக்கிட்டேன் - Padikkathavan",
        "thumbnail": "https://i.ytimg.com/vi/EPDM_zzXj4A/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLAAxz1RuIfWdJjc0A6znQSIhxipEA",
        "duration": "4:05",
        "videoId": "EPDM_zzXj4A",
        "channelName": "Kadar Majee",
        "channelId": "/channel/UCnSxRc2g9u7qfh_iAoGbffg",
        "uploadedOn": "2 years ago35,055 views",
        "views": "35,055 views",
        "description": "Movie - Padikkaadhavan (1985), Music - Ilaiyaraja, Lyrics - Vairamuthu, Singer - KJ Yesudas."
    }, {
        "_id": "5e2d67d551e0387f8f0b8a54",
        "title": "Paattu Paadava -Song With Lyrics | Gemini Ganesan, Vyjayanthimala | A.M. Rajah | Kannadasan |HD Song",
        "thumbnail": "https://i.ytimg.com/vi/q8qVxePZyMg/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDvdp2yQXMlS38ewedU7GMy7kysZw",
        "duration": "4:01",
        "videoId": "q8qVxePZyMg",
        "channelName": "Saregama Tamil",
        "channelId": "/user/SaregamaTamil",
        "uploadedOn": "2 years ago216,220 views",
        "views": "216,220 views",
        "description": "PAATTU PAADAVA Song With Lyrics in TAMIL & ENGLISH :: Start Singing the beautiful melody love song from the movie \"Then ..."
    }, {
        "_id": "5e31b477ea6a3f2ecc3be70a",
        "title": "Kanne kalaimane tamil HD K.J.Yesudas with clear audio..",
        "thumbnail": "https://i.ytimg.com/vi/oNRpH0ET7F0/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDVeYYCPai-NKznoAjIT0uFuXY-CA",
        "duration": "4:11",
        "videoId": "oNRpH0ET7F0",
        "channelName": "Arun Kumar official",
        "channelId": "/channel/UCa9-L_FSZ2dQiCohlNRExew",
        "uploadedOn": "1 year ago1,275,393 views",
        "views": "1,275,393 views",
        "description": ""
    }, {
        "_id": "5e36795d379ffe57e87c0600",
        "title": "Unna Nenachen Song | Apoorva Sagodharargal Tamil Movie | Kamal Hassan | Amala | Ilaiyaraaja Official",
        "thumbnail": "https://i.ytimg.com/vi/ZEQLi8hmK2g/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBRVfaIrQExlXGWuWgbR7F8YECA9g",
        "duration": "4:37",
        "videoId": "ZEQLi8hmK2g",
        "channelName": "Ilaiyaraaja Official",
        "channelId": "/channel/UCVlWr_LN9y80smEMr0KTBOA",
        "uploadedOn": "3 years ago159,654 views",
        "views": "159,654 views",
        "description": "Unna Nenachen Paattu song from the tamil blockbuster Apoorva Sagodharargal, starring Kamal Hassan and Goutami in lead."
    }, {
        "_id": "5e368552379ffe2eae7c0601",
        "title": "PAATTUM NAANE - Song With Lyrics | Sivaji Ganesan | Savitri | T.M. Soundararajan | K.V. Mahadevan",
        "thumbnail": "https://i.ytimg.com/vi/g7hEwtB32Kw/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLCdTUGOVowYJ6kb_IYYiQfsnySozQ",
        "duration": "6:14",
        "videoId": "g7hEwtB32Kw",
        "channelName": "Saregama Tamil",
        "channelId": "/user/SaregamaTamil",
        "uploadedOn": "2 years ago46,900 views",
        "views": "46,900 views",
        "description": "PAATTUM NAANE Song With Lyrics in TAMIL & ENGLISH :: Start Singing the motivational song from the movie \"Thiruvilayadal\" ..."
    }, {
        "_id": "5e3bfb22379ffe04647c0626",
        "title": "Nilave Vaa- Mouna raagam |S.P.B|Ilayaraja|Mani Rathnam",
        "thumbnail": "https://i.ytimg.com/vi/EM_QfSr7JCs/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLASJ6HB6l25BdDT7HK_2QIrEwtIZw",
        "duration": "4:36",
        "videoId": "EM_QfSr7JCs",
        "channelName": "Our Music",
        "channelId": "/channel/UC8DbyA58ufzXP3sI2RhJJLw",
        "uploadedOn": "3 years ago49,873 views",
        "views": "49,873 views",
        "description": ""
    }, {
        "_id": "5e3e0344f98e3000ad42820e",
        "title": "Keladi Kanmani - Nee Paathi Naan Paathi (1990) (audio song)",
        "thumbnail": "https://i.ytimg.com/vi/MZ8nxfarsHI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBBmQzpuSTRfVjrVahb6V2KathJHQ",
        "duration": "4:42",
        "videoId": "MZ8nxfarsHI",
        "channelName": "Sagar Vinod",
        "channelId": "/channel/UCcJ4fWY-cTe9NQagZwO_qjQ",
        "uploadedOn": "2 years ago37,620 views",
        "views": "37,620 views",
        "description": "Movie : Keladi Kanmani Music : Ilaiyaraaja Lyrics : Vaali Singer : K.J. Yesudas, Uma Ramanan."
    }],
    "__v": "8",
    "thumbnail": "https://i.ytimg.com/vi/MZ8nxfarsHI/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLBBmQzpuSTRfVjrVahb6V2KathJHQ",
    "totalSongs": "8",
}]

const songsCol = async (songs) => {
    const songCollection = await mydb.collection("songs");
    await songCollection.insertMany([...songs], {
        ordered: false
    })
}

const userPlaylist = async (userPlaylists) => {
    const userPlaylistCollection = await mydb.collection("userPlaylists");
    // insert initial docs
    await userPlaylistCollection.insertMany([...userPlaylists], {
        ordered: false
    })
}

const coreProcess = async () => {
    const songCollection = await mydb.collection("songs");
    const userPlaylistCollection = await mydb.collection("userPlaylists");
    let playlistData = await userPlaylistCollection.find({}).toArray();
    playlistData.forEach(async (item, key) => {
        let songs = item.songs;
        try {
            await songsCol(songs);
        } catch (error) {}
        songs = await songs.map(item => item.videoId);
        console.log(item._id);
        console.log(songs)
        const data = await userPlaylistCollection.updateOne({
            _id: item._id
        }, {
            $set: {
                songs: songs
            }
        })
        console.log(data)
    })
}

const main = async () => {
    try {
        // db connection
        const dba = await mongo.connect(url, {
            useUnifiedTopology: true
        });
        mydb = dba.db("mydb");
        if (mydb) console.log("connected to db! " + url);
        // db operations
        const userPlaylistCollection = null;
        const songCollection = null;
        try {
            userPlaylistCollection = await userPlaylist(userPls);
        } catch (error) {}
        try {
            songCollection = await songsCol(songCol);
        } catch (error) {}

        await coreProcess();
        // releasing db
        dba.close();
    } catch (error) {
        console.log(error.message);
    }
}
main();