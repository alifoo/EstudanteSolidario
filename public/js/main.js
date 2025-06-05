import * as toggle from './toggle.js';

document.getElementById('menu-toggle').addEventListener('click', toggle.toggleMenu);
document.getElementById('login').addEventListener('click', toggle.teste);
document.querySelectorAll('.login-exit-button').forEach(button => {
  button.addEventListener('click', toggle.exitLoginPopup);
});
document.getElementById('goto-signin-button').addEventListener('click', toggle.signinPopUp);

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
