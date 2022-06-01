import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import postApi from '../api/postApi'
import { setTextContent } from './common'

// to use relativeTime
dayjs.extend(relativeTime)

export function createPostItem(post) {
  if (!post) return

  // find template post
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update title, desc, author, ...
  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl

    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=Image+not+found'
    })
  }

  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', post.description)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

  // attach events
  // go to post detail when click on post item
  const postItem = liElement.firstElementChild
  if (postItem) {
    postItem.addEventListener('click', () => {
      window.location.assign(`/post-detail.html?id=${post.id}`)
    })
  }

  // add click event for edit button
  const editButton = liElement.querySelector('[data-id="edit"]')
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      // prevent event bubbling to parent
      e.stopPropagation()
      window.location.assign(`/add-edit-post.html?id=${post.id}`)
    })
  }

  // add click event for remove button
  const removeButton = liElement.querySelector('[data-id="remove"]')
  if (removeButton) {
    removeButton.addEventListener('click', (e) => {
      e.stopPropagation()
      handleRemovePost(post.id)
    })
  }

  return liElement
}

async function handleRemovePost(postId) {
  try {
    if (window.confirm('Are you sure you want to remove this post?')) {
      await postApi.remove(postId)

      window.location.reload()
    }
  } catch (error) {
    console.log('Failed to fetch Api', error)
  }
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostItem(post)
    ulElement.appendChild(liElement)
  })
}
