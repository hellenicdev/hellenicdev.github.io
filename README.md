# HellenicDev — Portfolio website

[![Website](https://img.shields.io/badge/website-hellenicdev.eu-19336e?style=flat-square)](https://hellenicdev.eu) [![License: BSD 3-Clause](https://img.shields.io/badge/license-BSD%203--Clause-blue?style=flat-square)](LICENSE) [![Deploy](https://github.com/hellenicdev/hellenicdev.github.io/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/hellenicdev/hellenicdev.github.io/actions/workflows/deploy-pages.yml)

The source of **[hellenicdev.eu](https://hellenicdev.eu)**: the home of HellenicDev, an independent developer from Greece building open-source web apps, browser games and small AI tools.

## What's on the site

- **Projects**: a grid of every live project (games, tools and AI apps), each linking to its own page under `hellenicdev.eu/<project>`
- **Codriver**: an AI web assistant with jokes, riddles, weather, news and a guessing game (`codriver/`)
- **Currency converter**: a small Flask app (`currency-converter/`)
- AI support agent, contact links, newsletter sign-up and the Substack feed
- Installable PWA with an offline page (`sw.js`, `offline.html`)
- Consent-gated analytics: Google Analytics only loads after Cookiebot consent (`js/consent-analytics.js`, shared by every project page)

## Structure

| Path | What it is |
| --- | --- |
| `index.html`, `style.min.css`, `script.min.js` | The home page (edit `style.css` / `script.js`, then re-minify) |
| `css/`, `js/` | Shared theme, components and scripts used by Codriver and the currency converter, plus the consent-gated analytics snippet |
| `404.html`, `offline.html`, `privacy-policy.html` | Error, offline and privacy pages |
| `codriver/` | Codriver front end and its Python back end |
| `currency-converter/` | Flask currency converter |
| `server.py`, `render.yaml` | Small Python back end deployed on Render |
| `netlify/`, `netlify.toml` | Netlify functions and security headers |
| `sitemap.xml`, `robots.txt`, `manifest.json` | SEO and PWA files |

## Run locally

```sh
git clone https://github.com/hellenicdev/hellenicdev.github.io.git
cd hellenicdev.github.io
python3 -m http.server 8000
```

Then open <http://localhost:8000>. The back ends (`server.py`, `codriver/backend`, `currency-converter`) are optional and have their own `requirements.txt`.

## Deployment

Every push to `main` deploys to GitHub Pages through [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The custom domain is `hellenicdev.eu`.

## Tech

- HTML5, CSS3 and vanilla JavaScript (no framework)
- Service worker for offline support
- Python (Flask / Gunicorn) for the small back ends
- GitHub Pages, Render and Netlify

## License

BSD 3-Clause. See [LICENSE](LICENSE).

## Credits

Made by [HellenicDev](https://hellenicdev.eu) (Panos).

- [YouTube](https://www.youtube.com/@hellenicdev) · [Discord](https://discord.gg/tHwtmrB9xw) · [Reddit](https://reddit.com/u/hellenicdev) · [Substack](https://hellenicdev.substack.com) · [Email](mailto:ikonpanos@gmail.com)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/S6S31XB030)
