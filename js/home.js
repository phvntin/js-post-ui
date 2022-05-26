import postApi from './api/postApi'
import { setTextContent } from './utils'

function createPostItem(post) {
  if (!post) return

  try {
    // find template post
    const postTemplate = document.getElementById('postTemplate')
    if (!postTemplate) return

    const liElement = postTemplate.content.firstElementChild.cloneNode(true)
    if (!liElement) return

    // update title, desc, author, ...
    const thumbnail = liElement.querySelector('[data-id="thumbnail"]')
    if (thumbnail) thumbnail.src = post.imageUrl

    // const titleElement = liElement.querySelector('[data-id="title"]')
    // if (titleElement) titleElement.textContent = post.title
    setTextContent(liElement, '[data-id="title"]', post.title)

    // const descElement = liElement.querySelector('[data-id="description"]')
    // if (descElement) descElement.textContent = post.description
    setTextContent(liElement, '[data-id="description"]', post.description)

    // const authorElement = liElement.querySelector('[data-id="author"]')
    // if (authorElement) authorElement.textContent = post.author
    setTextContent(liElement, '[data-id="author"]', post.author)

    // attach events

    return liElement
  } catch (error) {
    console.log('Failed to create post element', error)
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostItem(post)
    ulElement.appendChild(liElement)
  })
}

;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    }
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('Get all failed', error)
    // show modal, toast error
  }
})()
