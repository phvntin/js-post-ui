# POST UI 📸

## Overview 🕵️

Build with vanilla javascript.

This website includes 3 pages:
- Home page: `index.html`
- Post detail: `post-detail.html`
- Add edit post: `add-edit-post.html`

### Libraries used
- [Bootstrap](https://getbootstrap.com/): Used for building responsive layout
- [Axios](https://github.com/axios/axios): Working with API
- [Dayjs](https://day.js.org/): Format date-time
- [Lodash](https://lodash.com/): Handle debounce 

## Features

### Home page
#### Render list of posts

- Use `Boostrap Carrousel` for slides.
- Fetch list of posts and render to UI.
- Sort list of post to show the latest post first.
- Support search post by `title post`.
- Support pagination to be able to to fetch posts by `previous page` and `next page`.

#### Handle event on each post item
- `Click`: Go to detail page.
- `Edit button click`: (Coming soon)
- `Delete button click`: (Coming soon)

### Post detail page
- Show detail post
- Integrate with `Lightbox` to view image when click on image 
  (Coming soon)

### Add - Edit post page
  (Coming soon)
  
> Created by [phvntin](https://github.com/phvntin)
