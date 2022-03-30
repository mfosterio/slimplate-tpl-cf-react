# slimplate-tpl-cf-react

A Cloudflare Worker + React project-template for [slimplate](https://github.com/slimplate).

## get started

```sh
npm init slimplate myproject --react --cf
```

## why use this?

The idea of this project is to get up and running fast on Cloudflare Workers using the latest stuff, without a bunch of junk. Compare with remix, or maybe nextjs (although next doesn't run on cloudlfare edge-workers, yet.)

### slimplate features

- Code over config, with sensible defaults.
- Very light, brain-wise, and code-wise. Everything has a purpose, lots of comments, and everything can be easily reasoned about.
- Unified setup. All projects work the same basic way, have same layout, etc, but are easy to override antyhing, if you need to.
- All files are in your project, configure however you like, no hidden config or weird setup.
- Other similar frameworks wrap common ways of doing things to rebrand them. We don't.
- Speed of dev, build, and deploy are a top-priority, so you can iterate faster on your thing.
- Modern: you will need latest nodejs, but we will keep it all working with latest stuff, which you can benefit from.
- Working sourcemaps and dev-server for a happier dev-life. Many frameworks don't have this, but it takes a while to discover.
- Just use things how they work, in the best way. An example: use modern JS & CSS, and fallback to support older targets, if needed. ANother exmaple: just use regular cloudflare server-side API with no wrapping.

### this project's features

- Server-side, on CDN edge. Better for SEO. Very fast at rendering. Very cheap.
- ES6 worker modules (better for DO, nicer syntax.)
- faster than similar frameworks
- The latest cloudflare features.
- Websocket support, on cloudflare, right out of the gate.

> **DEAR DEV:** Below here is instructions for using the generated repo. The intent is that you remove the above text, and have a nice README

---
SNIP
---

# YOURS

Here is a clear purpose-statment.

[Here](https://cf-socket.konsumer.workers.dev/) is a link to this app deployed.


### your first minute

```sh
# project setup
git clone git@github.com:YOU/YOURS.git
cd YOURS
npm i

# now, go edit wrangler.toml

# start a local dev-server
npm start

# run local unit-tests and linting
npm test

# deploy on cloudflare
npm run deploy
```