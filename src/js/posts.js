import postTpl from './postsTpl.hbs';
import returnPostTpl from './returnPostTpl.hbs'
import updateFormTpl from './updateFormTpl.hbs';
import {renderComments, createComment} from './comments';
const BASE_URL = 'http://localhost:3000/posts'

const refs = {
  postsContainer: document.getElementById('postsContainer'),
  createPostForm: document.querySelector('.createPostForm'),
  showCreatePostsBtn: document.querySelector('.side-bar-btn'),
  createPostContainer: document.querySelector('.createPostContainer')
}
refs.createPostForm.addEventListener('submit', createPost)

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('deletePostButton')) {
    const postId = event.target.getAttribute('data-id');
    await deletePost(postId)
  } else if (event.target.classList.contains('editPostButton')) {
    const postId = event.target.getAttribute('data-id');
    await showUpdateForm(postId)
  } else if (event.target.classList.contains('addComment')) {
    await renderComments(event.target.id)
  } else if (event.target.classList.contains('returnPostMenu')) {
    await returnToMainPost(event)
  }
})

document.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (event.target.classList.contains('updatePostForm')) {
    await updatePost(event)
  } else if (event.target.classList.contains('createCommentForm')) {
    await createComment(event)
    await renderComments(event.target.id)
  }
})


//Створення нового поста
async function getPosts() {
  try {
    const posts = await fetch(BASE_URL)
    const gotPosts = await posts.json()
    return gotPosts
  } catch (error) {
    console.error(error)
  }
  
}

//Повернення до оснви поста
async function returnToMainPost(event) {
  const postId = event.target.id -1
  const post = document.querySelectorAll('.post')[postId]
  const postData = await getPosts(postId);
  post.innerHTML = await returnPostTpl(postData[postId])
}

// Створення нового поста
async function createPost(event) {
  event.preventDefault()
  const title =  event.currentTarget.elements.titleInput.value
  const content = event.currentTarget.elements.contentInput.value

  const newPost = {
    title: title,
    text: content
  }
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPost)
  }
  try {
    const movie =  await fetch(`${BASE_URL}`,options)
    startApp()
  } catch (error) {
    console.error(error);
  }
}


// Оновлення поста
async function updatePost(event) {
  const title =  event.target.elements['titleInput'].value
  const content = event.target.elements['contentInput'].value
  const updatedPost = {
    title: title,
    text: content
  }
  const options = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedPost)
  }
  try {
    const movie =  await fetch(`${BASE_URL}/${event.target.id}`,options)
    const parcedMovie = await  movie.json()
    returnToMainPost(event)
    return parcedMovie
  } catch (error) {
    console.error(error);
  }
}

//Відкриття вікна для оновлення інформації про пост
async function showUpdateForm(id) {
  const postsData = await fetch(BASE_URL)
  const gotPostsData = await postsData.json()
  const postId = gotPostsData[id-1]
  const posts = document.querySelectorAll('.post')
  posts[id - 1].innerHTML = await updateFormTpl(postId)
}


// Видалення поста
async function deletePost(id) {
  const options = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
  }
  try {
      await fetch(`${BASE_URL}/${id}`,options)
      startApp()
  } catch(error) {
      console.log(error);
  }
}



// Оновлення відображення постів на сторінці
function renderPosts(posts) {
  refs.postsContainer.innerHTML =  postTpl(posts)
}


async function startApp() {
  const posts = await getPosts();
  renderPosts(posts);
}
startApp();


//Анімація сайд бару
refs.showCreatePostsBtn.addEventListener('click', () => {
  refs.createPostContainer.classList.toggle('show-create-post-container')
  const main = document.querySelector('main')
  main.classList.toggle('moveToMain')
})