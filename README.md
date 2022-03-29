# slimplate-tpl-cf-react

A Cloudflare Worker + React project-template for [slimplate](https://github.com/slimplate).

## get started

```sh
npm init slimplate myproject --react --cf
```

## why use this?

The idea of this project is to get up and running fast on Cloudflare Workers using the latest stuff, without a bunch of junk. Compare with remix, or maybe nextjs (although next doesn't run on cloudlfare edge-workers, yet.)

- Server-side, on CDN edge. Better for SEO. Very fast at rendering. Very cheap.
- Very light, brain-wise. Everything has a sensible purpose, comments, and can be easily reasoned about.
- Local watching dev-server that actually works.
- ES6 worker modules (better for DO, nicer syntax.)
- The latest cloudflare features.
- All files are in your project, configure however you like, no hidden config or weird config.
- Incredibly fast to biuld, dev, and deploy, thanks to esbuild & cloudflare.
- Other similar frameworks wrap common ways of doing things to rebrand them. We don't.
