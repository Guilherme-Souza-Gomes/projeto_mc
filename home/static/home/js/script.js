
/* --- CONFIGURAÇÃO E LÓGICA DOS SLIDES --- */
const frasesSlides = [
    "Oi amor, tudo bem? 😁",
    "Juntos vamos construir uma história linda juntos. Eu tenho certeza disso! ✨",
    "E eu quero guardar cada momento com você, e por isso, eu criei esse site.",
    "Um lugar apenas nosso. Para dividirmos nossa linha do tempo juntos 🥰",
    "Está pronta? Então da uma olhada! 😊"
];

let indiceSlideAtual = 0;

const wrapperSlides = document.getElementById('wrapperSlides');
const textoSlide = document.getElementById('textoSlide');
const btnProximoSlide = document.getElementById('btnProximoSlide');
const conteudoHome = document.getElementById('conteudoHome');

const form = document.getElementById('formMensagem');
const listaMensagens = document.getElementById('listaMensagens');
const timelineContainer = document.getElementById('timeline');
const btnAdicionarMomento = document.getElementById('btnAdicionarMomento');
const modal = document.getElementById('modalCadastro');
const btnFecharModal = document.getElementById('btnFecharModal');
const modalFechar = document.querySelector('.modal-fechar');
const formCadastro = document.getElementById('formCadastroMomento');
const mensagemErroDiv = document.getElementById('mensagemErro');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

function atualizarSlide() {
    if (!textoSlide || !btnProximoSlide) return;

    // Efeito sutil de fade ao trocar o texto
    textoSlide.style.animation = 'none';
    textoSlide.offsetHeight;
    textoSlide.style.animation = 'fadeIn 0.5s ease';

    textoSlide.innerText = frasesSlides[indiceSlideAtual];

    if (indiceSlideAtual === frasesSlides.length - 1) {
        btnProximoSlide.innerText = "Estou Pronta ✨";
    } else if (indiceSlideAtual > 0) {
        btnProximoSlide.innerText = "Próxima Parte";
    }
}

if (btnProximoSlide) {
    btnProximoSlide.addEventListener('click', function() {
        indiceSlideAtual++;
        if (indiceSlideAtual < frasesSlides.length) {
            atualizarSlide();
        } else if (wrapperSlides) {
            // Remove a camada de slides e exibe a home limpa
            wrapperSlides.classList.add('slides-concluidos');
            conteudoHome.classList.remove('home-oculta');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => wrapperSlides.remove(), 800);
        }
    });
}

function setActiveTab(tabName) {
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });
}

function adicionarCardNaTela(msg) {
    const card = document.createElement('div');
    card.className = 'card-mensagem';
    card.innerHTML = `
        <div class="card-mensagem-topo">
            <span class="autor-msg">💕 ${escaparHTML(msg.nome)}</span>
            <span class="data-msg">${msg.data}</span>
        </div>
        <p class="texto-msg">${escaparHTML(msg.texto)}</p>
    `;
    listaMensagens.insertBefore(card, listaMensagens.firstChild);
}

function carregarMensagens() {
    fetch('/api/mural/')
        .then(response => response.json())
        .then(data => {
            listaMensagens.innerHTML = '';
            if (!data.items || data.items.length === 0) {
                const vazio = {
                    nome: 'Cupido',
                    texto: 'Este espaço é nosso! Deixe aqui sua primeira cartinha de amor. ❤️',
                    data: 'Hoje'
                };
                adicionarCardNaTela(vazio);
                return;
            }
            data.items.forEach(msg => adicionarCardNaTela(msg));
        })
        .catch(error => {
            console.error('Erro ao carregar mural:', error);
            listaMensagens.innerHTML = '<p style="text-align: center; color: #f44336; margin: 20px 0;">Erro ao carregar o mural. Tente novamente.</p>';
        });
}

function escaparHTML(string) {
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function carregarTimeline() {
    fetch('/api/timeline/')
        .then(response => response.json())
        .then(data => {
            timelineContainer.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                timelineContainer.innerHTML = '<p style="text-align: center; color: #999; margin: 40px 0;">Nenhum momento adicionado ainda. Seja a primeira! 💕</p>';
                return;
            }

            data.items.forEach((item, index) => {
                const classe = index % 2 === 0 ? 'esquerda' : 'direita';
                const timelineItem = document.createElement('div');
                timelineItem.className = `timeline-item ${classe}`;
                timelineItem.innerHTML = `
                    <span class="timeline-data">${item.data}</span>
                    <div class="polaroid">
                        <img src="${item.imagem}" alt="${escaparHTML(item.titulo)}">
                        <span><strong>${escaparHTML(item.titulo)}</strong></span>
                        ${item.descricao ? `<span>${escaparHTML(item.descricao)}</span>` : ''}
                    </div>
                `;
                timelineContainer.appendChild(timelineItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar timeline:', error);
            timelineContainer.innerHTML = '<p style="text-align: center; color: #f44336; margin: 40px 0;">Erro ao carregar a timeline. Tente novamente!</p>';
        });
}

btnAdicionarMomento.addEventListener('click', () => {
    modal.style.display = 'block';
});

btnFecharModal.addEventListener('click', () => {
    modal.style.display = 'none';
    formCadastro.reset();
    mensagemErroDiv.style.display = 'none';
});

modalFechar.addEventListener('click', () => {
    modal.style.display = 'none';
    formCadastro.reset();
    mensagemErroDiv.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        formCadastro.reset();
        mensagemErroDiv.style.display = 'none';
    }
});

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const btnSubmit = form.querySelector('button[type="submit"]');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Enviando...';

        fetch('/api/mural/add/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                form.reset();
                listaMensagens.innerHTML = '';
                carregarMensagens();
                btnSubmit.textContent = 'Colar no Quadro';
            } else {
                console.error('Erro ao salvar mensagem:', data.errors);
            }
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Colar no Quadro';
        });
    });
}

formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const btnSubmit = form.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';

    fetch('/api/mural/add/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            form.reset();
            listaMensagens.innerHTML = '';
            carregarMensagens();
            btnSubmit.textContent = 'Colar no Quadro';
        } else {
            console.error('Erro ao salvar mensagem:', data.errors);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar mensagem:', error);
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Colar no Quadro';
    });
});

formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnSubmit = formCadastro.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';

    const formData = new FormData(formCadastro);

    fetch('/api/timeline/add/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            formCadastro.reset();
            mensagemErroDiv.style.display = 'none';

            const mensagemSucesso = document.createElement('div');
            mensagemSucesso.className = 'mensagem-sucesso';
            mensagemSucesso.textContent = '✅ ' + data.message;
            formCadastro.parentElement.insertBefore(mensagemSucesso, formCadastro.nextSibling);

            setTimeout(() => mensagemSucesso.remove(), 3000);
            setTimeout(() => {
                modal.style.display = 'none';
                carregarTimeline();
            }, 1500);
        } else {
            let erroTexto = 'Erro ao salvar o momento:<br>';
            for (let campo in data.errors) {
                if (Array.isArray(data.errors[campo])) {
                    erroTexto += '• ' + data.errors[campo][0] + '<br>';
                } else {
                    erroTexto += '• ' + data.errors[campo] + '<br>';
                }
            }
            mensagemErroDiv.innerHTML = erroTexto;
            mensagemErroDiv.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        mensagemErroDiv.textContent = '❌ Erro ao conectar com o servidor. Tente novamente!';
        mensagemErroDiv.style.display = 'block';
    })
    .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Salvar Momento';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    atualizarSlide();
    carregarMensagens();
    carregarTimeline();
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });
});