import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

async function main() {
  // const respone = await axiosClient.get('/posts')
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log(data)
  } catch (error) {
    console.log('Get all failed', error)
    // show modal, toast error
  }
}

main()
