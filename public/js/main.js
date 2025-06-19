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

let currentPostId = null;
function getCurrentUserId() {
    return localStorage.getItem('userId') || null;
}

function isUserLoggedIn() {
    return getCurrentUserId() !== null;
}

async function saveParticipation(postId, userId) {
    try {
        const response = await fetch('/participations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_id: postId,
                user_id: userId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Você já está participando desta tarefa!');
            } else if (response.status === 404) {
                throw new Error('Tarefa ou usuário não encontrado.');
            } else {
                throw new Error(data.error || 'Erro ao registrar participação.');
            }
        }

        return data;
    } catch (error) {
        console.error('Error saving participation:', error);
        throw error;
    }
}

async function loadPosts() {
    try {
        const response = await fetch("/posts");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        const container = document.getElementById("activities");
        container.innerHTML = "";

        if (posts.length === 0) {
            container.innerHTML = "<p>Nenhuma tarefa encontrada no momento.</p>";
            return;
        }

        posts.forEach((post) => {
            const postHTML = `
                <div class="task-card" data-id="${post.id}">
                    <img class="task-card-image" src="https://placehold.co/600x400/10B981/ffffff?text=Voluntariado" alt="Imagem da Tarefa">
                    <div class="task-card-content">
                        <div class="task-card-tags">
                            <span class="tag tag-modality">${post.modality || 'Presencial'}</span>
                        </div>
                        <h3 class="task-card-title">${post.title}</h3>
                        <p class="task-card-description">${post.content}</p>
                        <div class="task-card-info">
                            <div class="info-item">
                                <span>Postado em: ${new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button class="help-button" data-post-id="${post.id}"><span>Quero ajudar</span></button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", postHTML);
        });
    } catch (err) {
        console.error("Erro ao carregar posts:", err);
        const container = document.getElementById("activities");
        container.innerHTML = "<p>Ocorreu um erro ao carregar as tarefas. Tente novamente mais tarde.</p>";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login-main-button").addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#div-login input[type='email']").value;
    const password = document.querySelector("#div-login input[type='password']").value;

    try {
      document.getElementById("login-main-button").addEventListener("click", async (e) => {
	e.preventDefault();

	const email = document.querySelector("#div-login input[type='email']").value;
	const password = document.querySelector("#div-login input[type='password']").value;

	const res = await fetch("/auth/login", {
	  method: "POST",
	  headers: { "Content-Type": "application/json" },
	  body: JSON.stringify({ email, password })
	});

	const data = await res.json();
	if (res.ok) {
	  alert(`Bem-vindo, ${data.user.name}!`);

	  document.getElementById("div-login").style.display = "none";
	  document.getElementById("login").style.display = "none";
	  document.getElementById("modal-overlay").style.display = "none";
	  document.getElementById("overlay").style.display = "none";

	  const perfilBtn = document.getElementById("profile");
	  if (perfilBtn) perfilBtn.style.display = "inline-block";

	  localStorage.setItem("user", JSON.stringify(data.user));
	} else {
	  alert("Erro: " + data.error);
	}
      });
    } catch (err) {
      alert("Erro ao tentar login");
    }
  });
  document.querySelector("#div-signup form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("fname").value + " " + document.getElementById("lname").value;
    const email = document.getElementById("email-signup").value;
    const password = document.getElementById("passowrd-signup").value;
    const birth_day = document.getElementById("birthDay").value;
    const birth_month = document.getElementById("birthMonth").value;
    const birth_year = document.getElementById("year").value;
    const birthday = `${birth_year}-${birth_month.padStart(2, '0')}-${birth_day.padStart(2, '0')}`;
    const course = document.getElementById("student-area-select")?.value || "NotStudent";
    const university = document.getElementById("university")?.value || "NotStudent";

    try {
      const res = await fetch("/auth/register", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ name, birthday, course, university, email, password })
      });

      const data = await res.json();
      if (res.ok) {
	alert("Conta criada com sucesso! ID do usuário: " + data.id);
      } else {
	alert("Erro: " + data.error);
      }
    } catch (err) {
      alert("Erro ao tentar criar conta");
    }
  });
    document.getElementById('create-task-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const course = document.getElementById('task-course').value;
      const creatorType = document.getElementById('task-creator-type').value;
      
      const userId = getCurrentUserId();
      
      try {
	  // Send the data to your backend
	  const response = await fetch('/posts', {
	      method: 'POST',
	      headers: {
		  'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({
		  title,
		  content: description,
		  course,
		  creator_type: creatorType,
		  user_id: userId
	      })
	  });
	  
	  if (!response.ok) {
	      throw new Error('Erro ao criar a tarefa');
	  }
	  
	  const newPost = await response.json();
	  
	  toggle.removeWorkPopUp();
	  loadPosts();
	  
	  document.getElementById('create-task-form').reset();
	  
      } catch (error) {
	  console.error('Error creating task:', error);
	  alert('Ocorreu um erro ao criar a tarefa. Por favor, tente novamente.');
      }
  });
    loadPosts();

    // --- LÓGICA DOS FILTROS --- //
    const botaoPrincipalFiltro = document.querySelector('.botao-filtro:not([data-filter])');
    if (botaoPrincipalFiltro) {
        const botoesDeFiltro = document.querySelectorAll('.botao-filtro[data-filter]');
        const iconeSeta = botaoPrincipalFiltro.querySelector('.icone-seta');
        const campoTexto = document.getElementById('filtro-texto-input');
        const campoData = document.getElementById('filtro-data-input');
        const selecaoArea = document.getElementById('filtro-area-select');
        const selecaoPessoa = document.getElementById('filtro-pessoa-select');
        const containerCamposDinamicos = document.querySelector('.container-campos-dinamicos');
        let filtrosEstaoVisiveis = false;

        botoesDeFiltro.forEach(botao => {
            botao.classList.add('filtro-animado');
            botao.style.display = 'none';
        });

        const esconderCamposDinamicos = () => {
            campoTexto.classList.remove('visivel');
            campoData.classList.remove('visivel');
            selecaoArea.classList.remove('visivel');
            selecaoPessoa.classList.remove('visivel');
            containerCamposDinamicos.style.height = '0px';
        };

        const gerenciarCamposDinamicos = () => {
            const filtroAtivo = document.querySelector('.botao-filtro[data-filter].ativo');
            let campoParaMostrar = null;

            esconderCamposDinamicos();

            if (filtroAtivo) {
                const tipoFiltro = filtroAtivo.getAttribute('data-filter');
                switch (tipoFiltro) {
                    case 'universidade':
                    case 'titulo':
                        campoTexto.placeholder = `Digite o ${tipoFiltro}...`;
                        campoParaMostrar = campoTexto;
                        break;
                    case 'area':
                        campoParaMostrar = selecaoArea;
                        break;
                    case 'pessoa':
                        campoParaMostrar = selecaoPessoa;
                        break;
                    case 'data':
                        campoParaMostrar = campoData;
                        break;
                }
            }

            if (campoParaMostrar) {
                campoParaMostrar.classList.add('visivel');
                containerCamposDinamicos.style.height = '46px';
            } else {
                containerCamposDinamicos.style.height = '0px';
            }
        };

        const toggleFiltros = () => {
            filtrosEstaoVisiveis = !filtrosEstaoVisiveis;
            iconeSeta.style.transform = filtrosEstaoVisiveis ? 'rotate(90deg)' : 'rotate(0deg)';
            
            if (filtrosEstaoVisiveis) {
                botoesDeFiltro.forEach((botao, index) => {
                    botao.style.display = 'flex';
                    setTimeout(() => botao.classList.remove('filtro-animado'), 20 + index * 40);
                });
            } else {
                botoesDeFiltro.forEach(botao => {
                    botao.classList.add('filtro-animado');
                    botao.classList.remove('ativo');
                    setTimeout(() => { if (!filtrosEstaoVisiveis) botao.style.display = 'none'; }, 300);
                });
                esconderCamposDinamicos();
            }
        };

        botaoPrincipalFiltro.addEventListener('click', toggleFiltros);

        botoesDeFiltro.forEach(botao => {
            botao.addEventListener('click', (e) => {
                e.stopPropagation();
                const estavaAtivo = botao.classList.contains('ativo');
                botoesDeFiltro.forEach(btn => btn.classList.remove('ativo'));
                if (!estavaAtivo) botao.classList.add('ativo');
                gerenciarCamposDinamicos();
            });
        });
    }

    // --- LÓGICA DO MODAL 'QUERO AJUDAR' --- //
    const modalOverlay = document.getElementById('modal-overlay');
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('close-modal-button');
    const cancelBtn = document.getElementById('cancel-button');
    const confirmBtn = document.getElementById('confirm-button');
    const activitiesContainer = document.getElementById('activities');

    const openModal = (postId) => {
        currentPostId = postId;
        if (modalOverlay && helpModal) {
            modalOverlay.classList.add('visible');
            helpModal.classList.add('visible');
        }
    };

    const closeModal = () => {
        currentPostId = null;
        if (modalOverlay && helpModal) {
            modalOverlay.classList.remove('visible');
            helpModal.classList.remove('visible');
        }
    };

    if (activitiesContainer) {
        activitiesContainer.addEventListener('click', (event) => {
            if (event.target.closest('.help-button')) {
                const button = event.target.closest('.help-button');
                const postId = button.getAttribute('data-post-id');
                
                // Check if user is logged in
                if (!isUserLoggedIn()) {
                    alert('Você precisa estar logado para participar de uma tarefa!');
                    return;
                }
                
                openModal(postId);
            }
        });
    }

    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            if (!currentPostId) {
                console.error('No post ID available');
                return;
            }

            const userId = getCurrentUserId();
            if (!userId) {
                alert('Erro: usuário não identificado. Faça login novamente.');
                closeModal();
                return;
            }

            try {
                // Show loading state
                confirmBtn.disabled = true;
                confirmBtn.textContent = 'Processando...';

                await saveParticipation(currentPostId, userId);
                
                // Success message
                alert('Participação confirmada com sucesso!');
                console.log('Participação confirmada para o post:', currentPostId);
                
                closeModal();
            } catch (error) {
                // Show error message to user
                alert(`Erro: ${error.message}`);
                console.error('Error confirming participation:', error);
            } finally {
                // Reset button state
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirmar';
            }
        });
    }
});
