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





// FILTROS //

document.addEventListener('DOMContentLoaded', () => {
  // Seletores
  const botaoPrincipal = document.querySelector('.botao-filtro:not([data-filter])');
  const botoesDeFiltro = document.querySelectorAll('.botao-filtro[data-filter]');
  const iconeSeta = botaoPrincipal.querySelector('.icone-seta');
  const campoTexto = document.getElementById('filtro-texto-input');
  const campoData = document.getElementById('filtro-data-input');
  const selecaoArea = document.getElementById('filtro-area-select');
  const selecaoPessoa = document.getElementById('filtro-pessoa-select');
  const containerCamposDinamicos = document.querySelector('.container-campos-dinamicos');

  let filtrosEstaoVisiveis = false;

  // Esconde os botões e os campos dinâmicos inicialmente
  botoesDeFiltro.forEach(botao => {
      botao.classList.add('filtro-animado');
      botao.style.display = 'none';
  });

  // Função para esconder todos os campos dinâmicos
  const esconderCamposDinamicos = () => {
      campoTexto.classList.remove('visivel');
      campoData.classList.remove('visivel');
      selecaoArea.classList.remove('visivel');
      selecaoPessoa.classList.remove('visivel');
      containerCamposDinamicos.style.height = '0px';
  };

  // Função para mostrar o campo dinâmico correto
  const gerenciarCamposDinamicos = () => {
      const filtroAtivo = document.querySelector('.botao-filtro[data-filter].ativo');
      let campoParaMostrar = null;

      // Esconde todos os campos antes de decidir qual mostrar
      campoTexto.classList.remove('visivel');
      campoData.classList.remove('visivel');
      selecaoArea.classList.remove('visivel');
      selecaoPessoa.classList.remove('visivel');

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
          // A altura do campo é calculada como 2*padding + altura da linha. 
          // 46px é um bom valor para a maioria dos navegadores.
          containerCamposDinamicos.style.height = '46px';
      } else {
          containerCamposDinamicos.style.height = '0px';
      }
  };

  // Função principal para mostrar/esconder os filtros
  const toggleFiltros = () => {
      filtrosEstaoVisiveis = !filtrosEstaoVisiveis;

      if (filtrosEstaoVisiveis) {
          botoesDeFiltro.forEach((botao, index) => {
              botao.style.display = 'flex';
              setTimeout(() => {
                  botao.classList.remove('filtro-animado');
              }, 20 + index * 40);
          });
      } else {
          botoesDeFiltro.forEach(botao => {
              botao.classList.add('filtro-animado');
              botao.classList.remove('ativo');
              setTimeout(() => {
                  if (!filtrosEstaoVisiveis) {
                      botao.style.display = 'none';
                  }
              }, 300);
          });
          esconderCamposDinamicos();
      }

      if (iconeSeta) {
          iconeSeta.style.transform = filtrosEstaoVisiveis ? 'rotate(90deg)' : 'rotate(0deg)';
      }
  };

  // Event listener para o botão principal
  botaoPrincipal.addEventListener('click', toggleFiltros);

  // Event listeners para os botões de filtro individuais
  botoesDeFiltro.forEach(botao => {
      botao.addEventListener('click', (e) => {
          e.stopPropagation();
          const estavaAtivo = botao.classList.contains('ativo');
          botoesDeFiltro.forEach(btn => btn.classList.remove('ativo'));
          if (!estavaAtivo) {
              botao.classList.add('ativo');
          }
          gerenciarCamposDinamicos();

          const tipoFiltro = botao.getAttribute('data-filter');
          if (botao.classList.contains('ativo')) {
              console.log(`Filtro selecionado: ${tipoFiltro}`);
          } else {
              console.log(`Filtro '${tipoFiltro}' desativado.`);
          }
      });
  });
  
  // Inicia com os filtros escondidos
  toggleFiltros();
  toggleFiltros();
});
// FIM / FILTROS //