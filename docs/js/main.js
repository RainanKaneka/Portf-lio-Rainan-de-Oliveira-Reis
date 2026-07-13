// ==========================================
// MODO ESCURO E i18n (Internacionalização)
// ==========================================
let i18nTranslations = {};
let currentLang = 'pt';

async function loadTranslations(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    i18nTranslations = await response.json();
    
    // Atualiza o DOM para todos os elementos marcados
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18nTranslations[key]) {
        el.textContent = i18nTranslations[key];
      }
    });
  } catch (error) {
    console.error("Erro ao carregar traduções:", error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // LÓGICA DE i18n
  const langToggleBtn = document.getElementById('lang-toggle');
  
  // 1. Verificar URL e LocalStorage
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const savedLang = localStorage.getItem('portfolioLang');
  
  currentLang = urlLang || savedLang || 'pt';
  
  // Sincronizar o botão visualmente (mostra o idioma que PODE ser selecionado)
  if (langToggleBtn) {
    langToggleBtn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
  }

  // Carregar as traduções iniciais imediatamente
  await loadTranslations(currentLang);

  // Evento de clique para trocar idioma
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', async () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      
      // Atualizar URL sem recarregar a página
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('lang', currentLang);
      window.history.pushState({}, '', newUrl);
      
      // Salvar no localStorage
      localStorage.setItem('portfolioLang', currentLang);
      
      // Atualizar o botão
      langToggleBtn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
      
      // Carregar novas traduções
      await loadTranslations(currentLang);
    });
  }

  // LÓGICA DO MODO ESCURO
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bodyElement = document.body;

  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme === 'dark') {
      bodyElement.classList.add('dark-mode');
      themeToggleBtn.textContent = '☀️';
    } else {
      themeToggleBtn.textContent = '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
      bodyElement.classList.toggle('dark-mode');
      if (bodyElement.classList.contains('dark-mode')) {
        localStorage.setItem('portfolioTheme', 'dark');
        themeToggleBtn.textContent = '☀️';
      } else {
        localStorage.setItem('portfolioTheme', 'light');
        themeToggleBtn.textContent = '🌙';
      }
    });
  }
});

// ==========================================
// CÓDIGO ORIGINAL
// ==========================================
const copyButton = document.getElementById("copiarBtn");
const copyFeedback = document.getElementById("copyFeedback");
const email = "rainanreis31@gmail.com";

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = "E-mail copiado: " + email;
  } catch (error) {
    copyFeedback.textContent = "Não foi possível copiar. E-mail: " + email;
    console.error("Erro ao copiar e-mail:", error);}
});

// Variável global para armazenar os repositórios carregados
let reposData = [];

// Elementos do Modal
const modalOverlay = document.getElementById('project-modal');
const modalClose = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalTags = document.getElementById('modal-tags');
const modalReadme = document.getElementById('modal-readme');
const modalLink = document.getElementById('modal-link');

// Fechar modal ao clicar no botão
modalClose?.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Fechar modal ao clicar fora do conteúdo
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// Função para formatar as tags
function generateTagsHtml(topics) {
  if (!topics) return '';
  const rawTags = topics.filter(t => t !== 'portfolio-academico' && t !== 'portfolio-pessoal');
  return rawTags.map(tag => {
    let tagName = tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `<span class="tech-tag ${tag}">${tagName}</span>`;
  }).join('');
}

// Função para abrir o Modal
async function openProjectModal(repoName) {
  const repo = reposData.find(r => r.name === repoName);
  if (!repo) return;

  // Formatar título
  let title = repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Popular Header
  modalTitle.textContent = title;
  modalTags.innerHTML = generateTagsHtml(repo.topics);
  modalLink.href = repo.html_url;

  // Resetar corpo do modal com tradução
  const loadingText = i18nTranslations['loading_doc'] || 'Carregando documentação...';
  modalReadme.innerHTML = `<p data-i18n="loading_doc">${loadingText}</p>`;
  
  // Mostrar modal
  modalOverlay.classList.add('active');

  // Buscar README
  await fetchReadme(repo.name);
}

// Função para buscar o README em HTML
async function fetchReadme(repoName) {
  try {
    const response = await fetch(`https://api.github.com/repos/RainanKaneka/${repoName}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.html'
      }
    });

    if (response.ok) {
      const htmlContent = await response.text();
      modalReadme.innerHTML = htmlContent;
    } else if (response.status === 404) {
      const noDocText = i18nTranslations['no_doc'] || 'Este repositório não possui um README (documentação).';
      modalReadme.innerHTML = `<p data-i18n="no_doc">${noDocText}</p>`;
    } else {
      const errorText = i18nTranslations['error_doc'] || 'Erro ao carregar a documentação.';
      modalReadme.innerHTML = `<p data-i18n="error_doc">${errorText}</p>`;
    }
  } catch (error) {
    console.error("Erro ao buscar o README:", error);
    const errorText = i18nTranslations['error_doc'] || 'Erro de conexão ao tentar carregar a documentação.';
    modalReadme.innerHTML = `<p data-i18n="error_doc">${errorText}</p>`;
  }
}

// Função principal para buscar repositórios
async function loadGithubProjects() {
  const academicosGrid = document.getElementById('academicos-grid');
  const pessoaisGrid = document.getElementById('pessoais-grid');

  if (!academicosGrid || !pessoaisGrid) return;

  try {
    const response = await fetch('https://api.github.com/users/RainanKaneka/repos');
    reposData = await response.json();

    academicosGrid.innerHTML = '';
    pessoaisGrid.innerHTML = '';

    const reposToRender = reposData.filter(repo => {
      const isAcademico = repo.topics && repo.topics.includes('portfolio-academico');
      const isPessoal = repo.topics && repo.topics.includes('portfolio-pessoal');
      return isAcademico || isPessoal;
    });

    for (const repo of reposToRender) {
      const isAcademico = repo.topics.includes('portfolio-academico');

      let title = repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      let description = repo.description;
      let isFallback = false;

      const noDescText = i18nTranslations['no_desc'] || "Repositório sem descrição. Clique para explorar os arquivos.";

      // Fallback dinâmico buscando README se não houver description
      if (!description || description.trim() === '') {
        try {
          const readmeRes = await fetch(`https://api.github.com/repos/RainanKaneka/${repo.name}/readme`, {
            headers: { 'Accept': 'application/vnd.github.html' }
          });
          if (readmeRes.ok) {
            const readmeHtml = await readmeRes.text();
            // Converter HTML para texto puro usando um div temporário
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = readmeHtml;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const cleanText = plainText.replace(/\s+/g, ' ').trim();
            
            if (cleanText.length > 0) {
              description = cleanText.substring(0, 150) + (cleanText.length > 150 ? "..." : "");
            } else {
              description = noDescText;
              isFallback = true;
            }
          } else {
            description = noDescText;
            isFallback = true;
          }
        } catch (error) {
          description = noDescText;
          isFallback = true;
        }
      }

      const tagsHtml = generateTagsHtml(repo.topics);
      
      const metaKey = isAcademico ? 'card_academic' : 'card_personal';
      const metaText = i18nTranslations[metaKey] || (isAcademico ? 'Acadêmico' : 'Pessoal');
      const btnText = i18nTranslations['btn_details'] || 'Ver Detalhes';

      const cardHtml = `
        <article class="project-card">
          <div class="project-meta" data-i18n="${metaKey}">${metaText}</div>
          <h3>${title}</h3>
          <p class="card-desc" ${isFallback ? 'data-i18n="no_desc"' : ''}>${description}</p>
          <div class="tags" aria-label="Tecnologias usadas">
            ${tagsHtml}
          </div>
          <button
            class="project-link btn-project"
            onclick="openProjectModal('${repo.name}')"
            style="cursor: pointer; border: none; font-family: inherit; font-size: 0.92rem;"
            data-i18n="btn_details"
          >
            ${btnText}
          </button>
        </article>
      `;

      if (isAcademico) {
        academicosGrid.innerHTML += cardHtml;
      } else {
        pessoaisGrid.innerHTML += cardHtml;
      }
    }

  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);
    academicosGrid.innerHTML = '<p>Não foi possível carregar os projetos acadêmicos no momento.</p>';
    pessoaisGrid.innerHTML = '<p>Não foi possível carregar os projetos pessoais no momento.</p>';
  }
}

// Iniciar carregamento
loadGithubProjects();
