# openbeats

OpenBeats is an open source Music streamer.

# Deployment Details
- micoservices architecture
- monorepo implementation
- Kubernetes deployment
- custom domain with multi subdomain ingress controller for kubernetes services

---

# OpenBeats API Docs

---
**Auth**

Register
>https://api.openbeats.live/auth/register

```
reqType: post,
bodyType: JSON
JSON-Structure:

{
    "name": "name",
    "email": "email@email.com",
    "password": "password" 
}

```
Login
>https://api.openbeats.live/auth/login

```
reqType: post,
bodyType: JSON
JSON-Structure:

{
    "email": "email@email.com",
    "password": "password" 
}

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

**getcharts**

to get all charts

> https://api.openbeats.live/getcharts

to get chart in specified language

> https://api.openbeats.live/getcharts?lang=<-language->

---
