# Live Orthodox

A Christian debate site where common objections to Scripture are answered directly, and the deeper metaphysical questions behind belief get equal attention. Maintained by Unified, an Eastern Orthodox Christian.

## Viewing the site

No server or build step is required. Just open `index.html` in a browser.

The only requirement is that all the files below stay together in the same folder. The pages link to `style.css` and `script.js` using relative paths, so if those files are separated from the HTML, the site will load as plain unstyled text.

## Files

```
live-orthodox/
├── index.html      Home page
├── about.html       About Unified
├── articles.html    Essays, answering contradictions and metaphysical questions
├── contact.html      Contact page (email only)
├── style.css         All styling, colors, layout, animations
├── script.js          Nav toggle, scroll animations, article accordion, copy button
└── README.md          This file
```

## Editing content

- **Text**: open any `.html` file in a text editor and edit directly. Each page repeats the same nav and footer markup at the top and bottom.
- **Adding a new article**: in `articles.html`, copy one of the `<article class="essay glass reveal">` blocks, give it a new `id`, update the `data-category` to either `contradiction` or `metaphysics`, and fill in the title, excerpt, and body paragraphs.
- **Colors and fonts**: all of the color values and font names live at the top of `style.css` under `:root`. Changing a value there updates it across every page.
- **Email address**: the contact address appears in `contact.html`, in both the `mailto:` link and the copy button's `data-email` attribute.

## Hosting it online

The site is fully static, so it works on any static host. A few common options:

- **Netlify or Cloudflare Pages**: drag and drop the folder onto their dashboard.
- **GitHub Pages**: push the folder to a repository and enable Pages in the repo settings.

No configuration, build tools, or database are needed for any of these.
