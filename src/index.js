const API_URL = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
  setupImagePreview();
}

document.addEventListener("DOMContentLoaded", main);


function setupImagePreview() {
  const imageInput = document.getElementById("new-image");
  const preview = document.getElementById("image-preview");

  imageInput.addEventListener("input", () => {
    const url = imageInput.value;
    if (url) {
      preview.src = url;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  });
}


function addNewPostListener() {
  const form = document.getElementById("new-post-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newPost = {
      title: document.getElementById("new-title").value,
      author: document.getElementById("new-author").value,
      content: document.getElementById("new-content").value,
      image: document.getElementById("new-image").value
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(post => {
        renderPost(post);
        form.reset();
        document.getElementById("image-preview").style.display = "none";

  displayPosts(); 
  switchToSplitLayout();
      })
      
  });
}


function displayPosts() {
  fetch(API_URL)
    .then(response => response.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

if (posts.length > 0) {
        switchToSplitLayout(); 
      }

      posts.forEach(renderPost);
    })
    
}


function renderPost(post) {
  const postList = document.getElementById("post-list");

  const postItem = document.createElement("div");
  postItem.classList.add("post-item");

  const title = document.createElement("h3");
  title.textContent = post.title;
  

  
  title.addEventListener("click", () => handlePostClick(post.id));

  const author = document.createElement("p");
  author.innerHTML = `<strong>Author:</strong> ${post.author}`;

  const image = document.createElement("img");
  image.src = post.image;
  image.alt = post.title;
  image.style.maxWidth = "200px";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    fetch(`${API_URL}/${post.id}`, 
        { method: "DELETE" })
      .then(() => postItem.remove());
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    const newTitle = prompt("New title:", post.title);
    const newAuthor = prompt("New author:", post.author);
    const newContent = prompt("New content:", post.content);
    const newImage = prompt("New image URL:", post.image);

    if (newTitle && newAuthor && newContent && newImage) {
      const updated = { title: newTitle, author: newAuthor, content: newContent, image: newImage };

      fetch(`${API_URL}/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      })
        .then(res => res.json())
        .then(updatedPost => {
          postItem.remove(); 
          renderPost(updatedPost);
        });
    }
  });

  postItem.append(title, author, image, deleteBtn, editBtn);
  postList.appendChild(postItem);
}

function switchToSplitLayout() {
  const layout = document.getElementById("main-layout");
  layout.classList.remove("full-screen");
  layout.classList.add("split-layout");

  const postListSection = document.getElementById("post-list-section");
  postListSection.style.display = "flex";
}



function handlePostClick(postId) {
  fetch(`${API_URL}/${postId}`)
    .then(res => res.json())
    .then(post => {
      const detailDiv = document.getElementById("post-detail");
      detailDiv.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <img src="${post.image}" style="max-width:300px;" />
      `;
    });
}
