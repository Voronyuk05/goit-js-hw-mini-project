import commentsTpl from './commentsTpl.hbs';

const BASE_URL = 'http://localhost:3000/comments'



export async function getComments() {
    try {
      const comments = await fetch(BASE_URL)
      const gotComments = await comments.json()
      return gotComments
    } catch (error) {
      console.error(error)
    }
    
}


export async function renderComments(id) {
    const commentsData = await getComments(id);
    const comments = document.querySelectorAll('.post')
    comments[id - 1].innerHTML = await commentsTpl(commentsData[id-1])
    const commentsList = document.querySelectorAll('.comments ul')[id-1]
    for (let commentData of commentsData) {
      if (commentData.postId == id) {
        commentsList.innerHTML += `<li>${commentData.body}</li>`
      }
    }
}


export async function createComment(event) {
  const commentText = event.target.elements.commentText.value
  const commentId = Number(event.target.id)

  const newComment = {
    body: commentText,
    postId: commentId
  }
  
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  }

  try {
    const comment =  await fetch(`${BASE_URL}`,options)
    const gotComment = await comment.json()
    return gotComment
  } catch (error) {
    console.error(error);
  }
}
