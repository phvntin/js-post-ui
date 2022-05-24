import axiosClient from './api/axiosClient'
import postApi from './api/postApi'

console.log('Hello')

async function main() {
  // const respone = await axiosClient.get('/posts')
  try {
    const queryParams = {
      _page: 1,
      _limit: 5,
    }
    const data = await postApi.getAll(queryParams)
    console.log(data)
  } catch (error) {}
}

main()
