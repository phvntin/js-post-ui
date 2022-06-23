import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  // console.log('Submit', formValues)
  try {
    // check add/edit mode
    // check id in form values
    // call API
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show success message
    toast.success('Saved post successfully')
    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 3000)
  } catch (error) {
    console.log('Failed to saved post', error)
    toast.error(`Error: ${error.message}`)
  }
}

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
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('Failed to fetch post detail', error)
  }
})()
