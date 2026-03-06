# Adech Themes

Portable theme tokens for the Adech collection.

This package exposes Adech themes in multiple formats so they can be used across different kinds of projects.

Available formats include:

- JSON tokens
- CSS custom properties
- Tailwind CSS v4 theme variables
- Tailwind CSS v3 presets

At the moment, the package includes the `Superior` theme.

---

## Installation

```bash
npm install @adech/themes
````

---

## Available formats

The `Superior` theme is available through these public entry points:

* `@adech/themes/superior`
* `@adech/themes/superior/json`
* `@adech/themes/superior/css`
* `@adech/themes/superior/tailwind`
* `@adech/themes/superior/preset`

---

## 1. Use with CSS custom properties

Import the CSS file:

```css
@import "@adech/themes/superior/css";
```

This exposes variables like:

* `--adech-boulevard-1`
* `--adech-boulevard-2`
* `--adech-venomous-1`
* `--adech-swamp-4`

Example:

```css
@import "@adech/themes/superior/css";

body {
  background: var(--adech-boulevard-1);
  color: var(--adech-swamp-4);
}

.card {
  background: var(--adech-venomous-2);
  border: 2px solid var(--adech-venomous-4);
}
```

This option works well for:

* plain CSS projects
* Astro
* React
* Vue
* Svelte
* design systems based on CSS variables

---

## 2. Use with Tailwind CSS v4

Tailwind v4 uses theme variables defined with `@theme`.

Import Tailwind and then import the Adech theme file:

```css
@import "tailwindcss";
@import "@adech/themes/superior/tailwind";
```

This generates utilities based on the exported color tokens.

Example:

```html
<div class="bg-adech-boulevard-1 text-adech-swamp-4 border-2 border-adech-venomous-4">
  Superior palette example
</div>
```

Use this option when your project is already on Tailwind CSS v4.

---

## 3. Use with Tailwind CSS v3

Tailwind v3 supports reusable shared configurations through presets.

In your `tailwind.config.js`:

```js
module.exports = {
  presets: [require("@adech/themes/superior/preset")],
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"]
};
```

Then use the colors directly in your classes:

```html
<div class="bg-adech-boulevard-1 text-adech-swamp-4 border-2 border-adech-venomous-4">
  Superior palette example
</div>
```

Use this option if you need compatibility with Tailwind CSS v3 projects.

---

## 4. Use as JSON tokens

You can also consume the raw tokens in JavaScript:

```js
const superior = require("@adech/themes/superior/json");

console.log(superior);
```

Example structure:

```json
{
  "name": "Superior",
  "prefix": "adech",
  "subbranches": {
    "boulevard": {
      "1": "#C7DCFF",
      "2": "#B4D0FF",
      "3": "#A1C4FF",
      "4": "#8FB1F0"
    }
  }
}
```

This is useful for:

* scripts
* custom tooling
* token transformations
* theme previews
* documentation generators

---

## Theme structure

Adech Themes is a collection of independent themes.

Each theme contains its own palettes, also referred to internally as branches or subbranches.

The `Superior` theme currently includes palettes such as:

* `boulevard`
* `venomous`
* `swamp`

Tokens are currently named by palette and step, for example:

* `adech-boulevard-1`
* `adech-venomous-3`
* `adech-swamp-4`

This keeps the system simple today and leaves room to add semantic tokens later, such as `bg`, `fg`, `surface`, `border`, or `accent`.

---

## Example workflow

1. Install the package
2. Choose the theme you want to use
3. Choose the format you need
4. Import the public entry point
5. Use the exported colors in your project

---

## Roadmap

Future themes and token contracts may include:

* more Adech themes
* semantic tokens
* platform-specific exports
* IDE theme contracts
* design-token tooling integrations

---

## License

MIT
