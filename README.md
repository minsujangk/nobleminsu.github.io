[Working Demo](https://nobleminsu.github.io)

> KAIST HCI 2017 Spring Project Sagam

**Project Sagam** aims at redesigning **fix request delivering** experience of KAIST house parents. We implemented only Sagam's interface, not students and other staff's interface.

# Installation

First you need to clone or download this repository

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

Open index.html with browser to see our results.

# Development

We used following frameworks

- [Vue](https://vuejs.org)
  - We use script `<script src="https://unpkg.com/vue"></script>` hosted by [unpkg.com](https://unpkg.com)
- [Bootstrap](https://getbootstrap.com)
  - [jQuery](http://jquery.com)

and part of following code snippet

- [Login Modal](https://bootsnipp.com/snippets/featured/modal-login-with-jquery-effects)

## Directory Structure

- **index.html** is entry file and it includes templates of all vue components including **App, Current, History, Edit Modal**
- **manage_request.js** declares all Components using templates in index.html
- **main.css** styles most of pages except login modal
- **login.html, login.css, login.js** is for handling login modal and it loaded via [jQuery load() function](http://api.jquery.com/load/)


# Usage

We supports only [ECMAScript 5 compliant browsers](http://caniuse.com/#feat=es5), because vue depends on ECMAScript 5 features that are un-shimmable in IE8.
