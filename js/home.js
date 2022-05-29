import postApi from './api/postApi'
import { registerPagination, registerSearch, renderPostList, renderPagination } from './utils'

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
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('Failed to fecth post list', error)
  }
}

// MAIN()
;(async () => {
  try {
    const url = new URL(window.location)

    // update search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    // attach click event for links
    registerPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    registerSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('Get all failed', error)
    // show modal, toast error
  }
})()
