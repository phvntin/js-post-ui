function showModal(modalElement) {
  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

// handle click for all images ---> Event delegation
// img click --> find all imgs with the same album
// determine index of selected img
// show modal with selected img
// handle prev / next click
export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if this modal is registered or not
  if (modalElement.dataset.registered) return

  const imageElement = document.querySelector(imgSelector)
  const prevButton = document.querySelector(prevSelector)
  const nextButton = document.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    // img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    console.log('detail image', { target, currentIndex, imgList })

    // show image at index
    showImageAtIndex(currentIndex)
    // show modal
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
  })

  nextButton.addEventListener('click', () => {
    // show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  // mark this modal is already registered
  modalElement.dataset.registered = 'true'
}
