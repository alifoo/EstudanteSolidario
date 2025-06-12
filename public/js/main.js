import * as toggle from './toggle.js';

document.getElementById('menu-toggle').addEventListener('click', toggle.toggleMenu);
document.getElementById('login').addEventListener('click', toggle.loginPopUp);
document.querySelectorAll('.login-exit-button').forEach(button => {
  button.addEventListener('click', toggle.exitLoginPopup);
});
document.querySelectorAll('.work-exit-button').forEach(button => {
  button.addEventListener('click', toggle.removeWorkPopUp);
});
document.getElementById('goto-signin-button').addEventListener('click', toggle.signinPopUp);
document.getElementById('mkWork-Button').addEventListener('click', toggle.createWorkPopUp);

async function loadPosts() {
  try {
    const response = await fetch("/posts");
    if (!response.ok) throw new Error("Failed to fetch posts");

    const posts = await response.json();
    console.log("Posts carregados:", posts);
    const container = document.getElementById("activities");
    container.innerHTML = "";

    posts.forEach((post) => {
      const postHTML = `
        <div class="container">
          <h2 class="activity-title">${post.title}</h2>
          <p class="activity-description">${post.content}</p>
          <p class="activity-modality">Postado em: ${new Date(post.created_at).toLocaleString()}</p>
          <button class="help-button">Quero ajudar</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", postHTML);
    });
  } catch (err) {
    console.error("Erro ao carregar posts:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPosts);
