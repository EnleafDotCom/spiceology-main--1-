# BF Starter Shopify Theme

## Workflow

### Set up local development environment

1. Clone this repository
2. `yarn install` in the project root folder on local
3. `yarn add @shopify/cli` to install the Shopify CLI. (https://www.npmjs.com/package/@shopify/cli)
4. `shopify login --store=store-name.myshopify.com` to authenticate and log in to the store
5. `yarn run start` to spin up the frontend and theme editor locally and follow the instructions there


### Sync a new branch from this repo to a theme on the store

1. Create the branch that you would like to generate a theme from
2. From the shopify admin, click "Online Store" from the left sidebar
3. Under "Theme library", click "Add Theme" and select "Connect from GitHub" from the options
4. Select your GitHub account, the repository, and desired branch
5. The shopify / github integration will then automatically generate a new theme using the code from the selected branch
    - from this point forward, any time the code for this branch is updated in the repo the corresponding theme will update as well.

### CI/CD Pipeline - Making updates to the website

We recommend, at minimum, to have a main branch and a staging branch, as well as themes on the Shopify admin integrated with each (see section above on syncing branches to a theme).

To make updates to the site, follow this workflow:

1. In your local development environment, switch to the staging branch - `git checkout staging`
2. Make desired changes to the theme code, and preview them locally to ensure they are ready for production
3. Add, commit, and push the changes to the staging branch
4. In the Shopify admin, duplicate the production theme. This duplicate theme will be used as a safety net in case an update needs to be rolled back quickly.
5. In GitHub, create a pull request for main (the "Compare & pull request" button should appear near the top of the repository - click this button and follow the instructions on the following page)
6. If there are merge conflicts between the two branches, GitHub will have flagged them and provided instructions on how to resolve them. You can resolve merge conflicts on GitHub or locally in your text editor, but it is recommended to do it locally.
    - After conflicts are resolved you will need to add, commit, and push the changes to the staging branch again and return to the pull request on GitHub.
7. If there are no merge conflicts, click the button to complete the merge
8. At this point, the shopify theme integrated with the main branch will update with the changes and the live site will be updated
9. If for some reason there is a site-breaking problem with the live site resulting from the update, publish the pre-update duplicate theme that you created in step 4. Use this duplicate theme for the live site while you work to identify and resolve any issues in the background.



## Code architecture

### Shopify OS2

#### Templates

- The most notable change with themes in Shopify OS2 is templating. We can now use JSON templates instead of liquid templates for greater flexibility in working with sections to build pages, blogs, collections, etc. Take a look at the structure of some of the JSON files in the `/templates` folder.

[Documentation](https://shopify.dev/themes/architecture/templates)

#### Metafields

- Metafields allow us to store additional information (beyond Shopify's built-in options) on Shopify resources such as products, collections, articles, etc. Shopify OS2 now provides the ability to create metafields directly through the Shopify admin, rather than using a third party app. To know more about metafields and understand how they are used in this site, see the documentation below.

[Documentation](https://shopify.dev/apps/metafields?itcat=partner_blog&itterm=shopify_online_store&shpxid=9658732a-F6F7-4C66-4A9A-8A86024AE19D)

### JavaScript

This site uses Alpine.js - a lightweight Javascript framework.

There are two main ways in which Alpine is used.

- for global state management we use the Alpine store. The scripts for the store are located at `src/scripts/stores/AlpineStore.js`. This file leverages the Shopify API and initializes all of the global functions for interacting with cart.

- for local functionality that does not require API requests, this site uses the Alpine x-data directive. X-data allows for all of the functionality and state for a componenent - let's say an accordion, for example - to be written and contained using within the html tags for that component. Alpines shorthand syntax also greatly reduces the amount of code that needs to be written for simple Javascript functions and enhances readability by keeping the markup, styles, and functionality of a component in one place.

[Alpine docs](https://alpinejs.dev/start-here)
[Alpine store](https://alpinejs.dev/globals/alpine-store)
[Alpine x-data](https://alpinejs.dev/directives/data)

For scripts that require more complex functionality but are not needed globally - such as a contact form that makes an API call, or scripts that require imports - this site uses Javascript modules. See `src/scripts/components/hero.js` for reference.

### CSS

The styling on this site is applied using a combination of Tailwind (a CSS utility class framework) and Sass.

Tailwind is mostly used for one-off sections + snippets. The markup for most of these sections is not repeated throughout the theme, so the utility classes will only need to be added once. Tailwind allows us to build pages quickly, helps reduce time spent toggling back and forth between files, and can make it easier to visualize components as the markup and styles are located in the same place.

[Tailwind documentation](https://tailwindcss.com/docs/installation)

Sass is used for global items like buttons, inputs, and anchors. The HTML for these items is used multiple times throughout the theme, so we can write significantly less code by storing the styles in a custom class rather than adding the same utility classes over and over again. This helps to ensure consistency in how components appear throughout the site and prevent the markup from getting unnecessarily cluttered.

Sass is also used when the styles needed are particularly complex (as is the case with some animations, for example).

Take a look through the files in `src/styles` to get a sense of how Sass is used in this theme.

[Sass documentation](https://sass-lang.com/documentation)
