import forEachNode from '../utils/forEachNode'

const sideBarLinks = document.querySelectorAll('.faq-category-sidebar-title')
const faqQuestions = document.querySelectorAll('.faq-question')

// reveal / hide answer on click
forEachNode(faqQuestions, (question) => {
  question.addEventListener('click', () => {
    let answer = question.querySelector('.faq-answer')
    let questionClosed = question.querySelector('.faq-question-closed')
    let questionOpened = question.querySelector('.faq-question-opened')

    answer.classList.toggle('active')
    questionClosed.classList.toggle('hidden')
    questionOpened.classList.toggle('hidden')
  })
})

// show active sidebar link
forEachNode(sideBarLinks, (sideBarLink) => {
  sideBarLink.addEventListener('click', () => {
    let activeLinkIndex = sideBarLink.dataset.index
    forEachNode(sideBarLinks, (link) => {
      if (link.dataset.index === activeLinkIndex) {
        if (!link.classList.contains('active')) {
          link.classList.add('active')
        }
      } else {
        if (link.classList.contains('active')) {
          link.classList.remove('active')
        }
      }
    })
  })
})
