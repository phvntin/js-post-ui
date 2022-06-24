import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValue(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="author"]', formValues?.author)
  setFieldValue(form, '[name="description"]', formValues?.description)

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl)
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const formValues = {}

  // query each input and add to formValues object
  ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) formValues[name] = field.value
  })

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author.')
      .test(
        'at-least-two-words',
        'Please enter at least two words.',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please random a background image.')
      .url('Please enter a valid URL.'),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous errors
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        // ignore if the field is already logged
        if (errorLog[name]) continue

        // set field error and mark as logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  // add was validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving ...'
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    // randomID
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    // build URL
    // set imageUrl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false

  // init events
  initRandomImage(form)

  setFormValue(form, defaultValues)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // Preven other submission
    if (submitting) {
      console.log('Already submitting')
      return
    }

    // show loading / disabled button
    showLoading(form)

    submitting = true
    // get form data
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id
    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    // always hideloading no matter valid or not valid

    hideLoading(form)
    submitting = false
  })
}
