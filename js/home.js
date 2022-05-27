import postApi from './api/postApi'
import { setTextContent } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'

// to use relativeTime
dayjs.extend(relativeTime)

function createPostItem(post) {
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

  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if (titleElement) titleElement.textContent = post.title
  setTextContent(liElement, '[data-id="title"]', post.title)

  // const descElement = liElement.querySelector('[data-id="description"]')
  // if (descElement) descElement.textContent = post.description
  setTextContent(liElement, '[data-id="description"]', post.description)

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author
  setTextContent(liElement, '[data-id="author"]', post.author)

  // calculate timespan
  // dayjs(post.updatedAt).fromNow()
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  // attach events

  return liElement
}

function renderPostList(postList) {
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

function renderPagination(pagination) {
  const ulPagination = document.getElementById('pagination')
  if (!pagination || !ulPagination) return

  // calc total pages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and total pages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enable/disable prev link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  // check if enable/disable next link
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query param
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    // fecth API
    //re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('Failed to fecth post list', error)
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  console.log('Prev link')

  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()
  console.log('Next link')

  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function registerPagination() {
  // bind click event for prev/next link
  const ulPagination = document.getElementById('pagination')
  if (!ulPagination) return

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick)
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.firstElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }
}

function registerUrl() {
  const url = new URL(window.location)

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

function registerSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return

  //set default values from query params
  // title_like
  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like')
  }

  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    // attach click event for links
    registerPagination()
    registerSearch()

    // set default pagination (_page, _limit) on URL
    registerUrl()

    // render post list based URL params
    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('Get all failed', error)
    // show modal, toast error
  }
})()
