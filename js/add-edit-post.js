import postApi from './api/postApi'
import { initPostForm } from './utils'

// MAIN
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          author: '',
          description: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: (formValues) => console.log('Submit', formValues),
    })
  } catch (error) {
    console.log('Failed to fetch post detail', error)
  }
})()
