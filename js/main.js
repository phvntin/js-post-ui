import axiosClient from './api/axiosClient'
console.log(axiosClient)
console.log('Hello')

async function main() {
  const respone = await axiosClient.get('/posts')
  console.log(respone)
}

main()
