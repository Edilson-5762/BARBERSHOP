console.log('script.js carregado com sucesso!');

// --- Funções Auxiliares para Event Listeners Robustos ---
// Garante que o elemento existe antes de adicionar o listener
function addEventListenerSafe(selector, eventType, handler) {
    const element = document.querySelector(selector);
    if (element) {
        element.addEventListener(eventType, handler);
    } else {
        console.warn(`Elemento não encontrado para o seletor: ${selector}. O listener para ${eventType} não foi adicionado.`);
    }
}

// Garante que os elementos existam antes de adicionar listeners a uma coleção
function addEventListenersSafe(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        elements.forEach(element => {
            element.addEventListener(eventType, handler);
        });
    } else {
        console.warn(`Nenhum elemento encontrado para o seletor: ${selector}. Os listeners para ${eventType} não foram adicionados.`);
    }
}

// --- 1. MENU MOBILE ---
addEventListenerSafe('#hamburger', 'click', () => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks && hamburger) {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    }
});

addEventListenersSafe('.nav-links a', 'click', () => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks && hamburger) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
    }
});

document.addEventListener('click', function (e) {
    const nav = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
    }
});


// --- 2. NAVBAR SCROLL ---
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 80) {
            navbar.style.padding = '10px 60px';
            navbar.style.background = 'rgba(0, 0, 0, 0.97)';
        } else {
            navbar.style.padding = '18px 60px';
            navbar.style.background = 'rgba(0, 0, 0, 0.85)';
        }
    }
});


// --- 3. SCROLL SUAVE ---
addEventListenersSafe('a[href^="#"]', 'click', function (e) {
    e.preventDefault();
    const alvo = document.querySelector(this.getAttribute('href'));
    if (alvo) {
        const offsetTop = alvo.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
});


// --- 4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            observer.unobserve(entry.target); // Para de observar após aparecer
        }
    });
}, observerOptions);

// Elementos que vão receber a animação de entrada
document.querySelectorAll(`
  .servico-card,
  .preco-categoria,
  .galeria-item,
  .pagamento-card,
  .depoimento-card,
  .contato-item,
  .sobre-text,
  .sobre-img-wrapper,
  .section-header,
  .barbeiro-card
`).forEach(el => {
    el.classList.add('fade-in'); // Classe de estado inicial (invisível)
    observer.observe(el);
});


// --- 5. FORMULÁRIO DE AGENDAMENTO ---
const formAgendamento = document.getElementById('formAgendamento');

if (formAgendamento) {
    formAgendamento.addEventListener('submit', function (e) {
        e.preventDefault();

        // Coleta os dados do formulário
        const nome = document.getElementById('nomeCliente').value.trim();
        const telefone = document.getElementById('telefoneCliente').value.trim();
        const data = document.getElementById('dataAgendamento').value;
        const horario = document.getElementById('horarioAgendamento').value;
        const barbeiro = document.getElementById('barbeiroAgendamento').value;
        const servico = document.getElementById('servicoAgendamento').value;
        const obs = document.getElementById('obsAgendamento').value.trim();

        // Validação básica
        if (!nome || !telefone || !data || !horario || !servico) {
            mostrarAlerta('Por favor, preencha todos os campos obrigatórios.', 'erro');
            return;
        }

        // Formata a data para exibição
        const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');

        // Monta a mensagem para o WhatsApp
        const barbeiroTexto = barbeiro ? `Barbeiro: ${barbeiro}` : 'Sem preferência de barbeiro';
        const obsTexto = obs ? `Observações: ${obs}` : '';

        const mensagem = encodeURIComponent(
            `Olá! Gostaria de agendar um horário:\n\n` +
            `👤 Nome: ${nome}\n` +
            `📞 Telefone: ${telefone}\n` +
            `📅 Data: ${dataFormatada}\n` +
            `🕐 Horário: ${horario}\n` +
            `✂️ Serviço: ${servico}\n` +
            `💈 ${barbeiroTexto}\n` +
            `${obsTexto}`
        );

        // Número do WhatsApp — TROQUE pelo número real da barbearia
        const numeroWhatsApp = '5511999999999';

        // Abre o WhatsApp com a mensagem preenchida
        window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, '_blank');

        // Feedback de sucesso
        mostrarAlerta(`Agendamento enviado! Aguarde a confirmação pelo WhatsApp, ${nome}.`, 'sucesso');

        // Limpa o formulário
        formAgendamento.reset();
        // Desseleciona os barbeiros
        document.querySelectorAll('.barbeiro-card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.barbeiro-card .btn-secondary').forEach(btn => btn.classList.remove('selected'));
    });
}


// --- 6. DATA MÍNIMA (não permite datas passadas) ---
const inputData = document.getElementById('dataAgendamento');
if (inputData) {
    const hoje = new Date();
    // Define como mínimo o dia seguinte
    hoje.setDate(hoje.getDate() + 1);
    const dataMin = hoje.toISOString().split('T')[0];
    inputData.setAttribute('min', dataMin);
}


// --- 7. MÁSCARA DE TELEFONE ---
const inputTelefone = document.getElementById('telefoneCliente');
if (inputTelefone) {
    inputTelefone.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, ''); // Remove tudo que não é dígito

        // Aplica a máscara dependendo do tamanho do número
        if (valor.length <= 10) { // Para números com 8 ou 9 dígitos (sem o 9 extra do celular)
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else { // Para números com 9 dígitos (celular)
            valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        this.value = valor;
    });
}


// --- FUNÇÃO AUXILIAR: ALERTA VISUAL ---
function mostrarAlerta(mensagem, tipo) {
    // Remove alerta anterior se existir
    const alertaExistente = document.getElementById('alertaAgendamento');
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement('div');
    alerta.id = 'alertaAgendamento';
    alerta.textContent = mensagem;
    alerta.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    max-width: 360px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
    background: ${tipo === 'sucesso' ? '#D4AF37' : '#B22222'};
    color: ${tipo === 'sucesso' ? '#0a0a0a' : '#ffffff'};
  `;

    document.body.appendChild(alerta);

    // Remove o alerta após 5 segundos
    setTimeout(() => {
        alerta.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => alerta.remove(), 300);
    }, 5000);
}


// --- LIGHTBOX DA GALERIA ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const fecharLightboxBtn = document.querySelector('.lightbox-fechar'); // Renomeado para evitar conflito

if (lightbox && lightboxImg && fecharLightboxBtn) {
    // Abre ao clicar em qualquer card da galeria
    document.querySelectorAll('.galeria-item img').forEach(img => { // Alterado para .galeria-item img
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('ativo');
            document.body.style.overflow = 'hidden';
        });
    });

    // Fecha ao clicar no X
    fecharLightboxBtn.addEventListener('click', fecharLightbox);

    // Fecha ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    // Fecha com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharLightbox();
    });
}

function fecharLightbox() {
    if (lightbox) {
        lightbox.classList.remove('ativo');
        document.body.style.overflow = '';
    }
}


// --- 8. SELEÇÃO DE BARBEIRO ---
const barbeiroAgendamentoInput = document.getElementById('barbeiroAgendamento');
const barbeiroCards = document.querySelectorAll('.barbeiro-card');

if (barbeiroCards.length > 0 && barbeiroAgendamentoInput) {
    barbeiroCards.forEach(card => {
        const selectButton = card.querySelector('.btn-secondary');
        if (selectButton) {
            selectButton.addEventListener('click', () => {
                // Remove a seleção de todos os cards
                barbeiroCards.forEach(c => {
                    c.classList.remove('selected');
                    const btn = c.querySelector('.btn-secondary');
                    if (btn) btn.classList.remove('selected');
                });

                // Adiciona a seleção ao card clicado
                card.classList.add('selected');
                selectButton.classList.add('selected');

                // Atualiza o campo de barbeiro no formulário
                const barbeiroNome = card.dataset.barbeiroNome;
                barbeiroAgendamentoInput.value = barbeiroNome;
            });
        }
    });
}


// --- 9. MODAIS DE DEPOIMENTOS ---
const modalVerComentarios = document.getElementById('modalVerComentarios');
const btnVerComentarios = document.getElementById('btnVerComentarios');
const listaTodosDepoimentos = document.getElementById('listaTodosDepoimentos');

// Dados de depoimentos de exemplo (você pode adicionar mais aqui)
const depoimentosExtras = [
    { nome: "Mariana F.", texto: "Atendimento excelente e ambiente super agradável. O corte do João ficou impecável!", estrelas: 5 },
    { nome: "Gustavo R.", texto: "Sempre saio com a barba perfeita. O Pedro é um artista com a navalha!", estrelas: 5 },
    { nome: "Thiago B.", texto: "A Kings Cut é diferenciada. Recomendo a VIP Experience, vale cada centavo.", estrelas: 5 },
    { nome: "André C.", texto: "Pontualidade e profissionalismo. Meu corte com o Lucas ficou exatamente como eu queria.", estrelas: 4 },
    { nome: "Bruno M.", texto: "Barbearia com estilo e ótimos produtos. Voltarei com certeza!", estrelas: 5 }
];

// Função para renderizar depoimentos no modal
function renderizarDepoimentos() {
    const listaTodosDepoimentos = document.getElementById('listaTodosDepoimentos');
    if (!listaTodosDepoimentos) return;

    // Limpa o conteúdo atual do modal para evitar duplicação
    listaTodosDepoimentos.innerHTML = '';

    // Coleta os depoimentos já visíveis na seção principal
    const depoimentosIniciais = Array.from(document.querySelectorAll('#depoimentos .depoimento-card')).map(card => {
        const estrelasText = card.querySelector('.depoimento-estrelas')?.textContent || '';
        const texto = card.querySelector('.depoimento-texto')?.textContent || '';
        const autor = card.querySelector('.depoimento-autor')?.textContent || '';
        return {
            estrelas: estrelasText.length, // Conta o número de estrelas para preencher
            texto: texto.replace(/"/g, ''), // Remove as aspas
            nome: autor.replace('- ', '') // Remove o traço
        };
    });

    // Combina os depoimentos iniciais com os extras
    const todosDepoimentos = [...depoimentosIniciais, ...depoimentosExtras];

    if (todosDepoimentos.length === 0) {
        listaTodosDepoimentos.innerHTML = '<p>Ainda não há comentários adicionais disponíveis.</p>';
    } else {
        todosDepoimentos.forEach(depoimento => {
            const card = document.createElement('div');
            card.classList.add('depoimento-card');
            card.innerHTML = `
                <div class="depoimento-estrelas">${'★'.repeat(depoimento.estrelas)}${'☆'.repeat(5 - depoimento.estrelas)}</div>
                <p class="depoimento-texto">"${depoimento.texto}"</p>
                <div class="depoimento-autor">${depoimento.nome}</div>
            `;
            listaTodosDepoimentos.appendChild(card);
        });
    }
}

// Event listener para o botão "Ver Mais Comentários"
if (btnVerComentarios && modalVerComentarios) {
    btnVerComentarios.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o comportamento padrão do botão
        renderizarDepoimentos(); // Renderiza os depoimentos no modal
        modalVerComentarios.classList.add('active'); // Abre o modal (usando 'active' conforme seu CSS)
        document.body.style.overflow = 'hidden'; // Impede o scroll do body
    });
}

// Fecha os modais (função genérica para todos os modais)
addEventListenersSafe('.modal .close-button', 'click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) {
        modal.classList.remove('active'); // Usa 'active'
        document.body.style.overflow = '';
    }
});

addEventListenersSafe('.modal', 'click', (e) => {
    if (e.target.classList.contains('modal')) { // Verifica se o clique foi no overlay do modal
        e.target.classList.remove('active'); // Usa 'active'
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.active'); // Usa 'active'
        if (openModal) {
            openModal.classList.remove('active'); // Usa 'active'
            document.body.style.overflow = '';
        }
    }
});


// --- 10. CHATBOT ---
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotCloseBtn = document.querySelector('.chatbot-close-btn');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');

// Função para limpar o histórico do chat
function clearChatHistory() {
    if (chatbotBody) {
        chatbotBody.innerHTML = `
            <div class="chatbot-message bot-message">Olá! Sou seu assistente virtual da Kings Cut. Como posso ajudar?</div>
            <div class="chatbot-message bot-message chatbot-warnings">
                <strong>Avisos Importantes de Higiene e Segurança (ANVISA):</strong>
                <ul>
                    <li>Utilizamos materiais descartáveis para cada cliente (lâminas, luvas, etc.).</li>
                    <li>Todos os instrumentos não descartáveis são esterilizados em autoclave.</li>
                    <li>Nossos profissionais seguem rigorosos protocolos de higiene.</li>
                </ul>
                <p>Para mais informações sobre as diretrizes da ANVISA para salões de beleza e barbearias, acesse:</p>
                <ul>
                    <li><a href="https://www.gov.br/anvisa/pt-br/setorregulado/regularizacao/servicos-de-saude/salao-de-beleza-e-barbearia"
                            target="_blank">Orientações ANVISA para Salões e Barbearias</a></li>
                    <li><a href="https://www.gov.br/anvisa/pt-br/setorregulado/regularizacao/servicos-de-saude/manual-de-boas-praticas-para-servicos-de-beleza"
                            target="_blank">Manual de Boas Práticas (ANVISA)</a></li>
                </ul>
            </div>
            <div class="chatbot-message bot-message chatbot-warnings">
                <strong>Informações sobre Proteção de Dados (LGPD):</strong>
                <p>Valorizamos sua privacidade! Ao interagir com nosso chatbot e fornecer dados pessoais (como nome,
                    telefone), você concorda com a coleta e uso dessas informações para fins de agendamento e
                    atendimento, conforme nossa Política de Privacidade.</p>
                <p>Para entender como tratamos seus dados e seus direitos, acesse:</p>
                <ul>
                    <li><a href="[LINK_PARA_SUA_POLITICA_DE_PRIVACIDADE]" target="_blank">Nossa Política de
                            Privacidade</a></li>
                    <li><a href="https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado.pdf"
                            target="_blank">Guia Orientativo LGPD (ANPD)</a></li>
                </ul>
                <p>Você pode exercer seus direitos sobre seus dados a qualquer momento.</p>
            </div>
        `;
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
}

// Toggle chatbot visibility
if (chatbotToggleBtn && chatbotContainer && chatbotCloseBtn) {
    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom
        } else {
            clearChatHistory(); // Limpa o histórico ao fechar
        }
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
        clearChatHistory(); // Limpa o histórico ao fechar
    });
}

// Send message function
function sendMessage() {
    const userMessageText = chatbotInput.value.trim();
    if (userMessageText === '') return;

    // Add user message to chat body
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chatbot-message', 'user-message');
    userMessageDiv.textContent = userMessageText;
    chatbotBody.appendChild(userMessageDiv);

    chatbotInput.value = ''; // Clear input
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom

    // Get bot response
    setTimeout(() => {
        const botResponseText = getBotResponse(userMessageText);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('chatbot-message', 'bot-message');
        botMessageDiv.innerHTML = botResponseText; // Use innerHTML for links/formatting
        chatbotBody.appendChild(botMessageDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to bottom
    }, 500);
}

// Event listeners for sending messages
if (chatbotSendBtn) {
    chatbotSendBtn.addEventListener('click', sendMessage);
}
if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Bot response logic
function getBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (
        lowerCaseMessage.includes('olá') ||
        lowerCaseMessage.includes('oi') ||
        lowerCaseMessage.includes('bom dia') ||
        lowerCaseMessage.includes('boa tarde') ||
        lowerCaseMessage.includes('boa noite')
    ) {
        return 'Olá! Sou seu assistente virtual da Kings Cut. Como posso ajudar?';

    } else if (
        lowerCaseMessage.includes('preço') ||
        lowerCaseMessage.includes('quanto custa') ||
        lowerCaseMessage.includes('valor')
    ) {
        return `Nossos preços são:<br>
                - Corte Masculino: a partir de R$35<br>
                - Barba: a partir de R$30<br>
                - Combo Completo (Corte + Barba): a partir de R$60<br>
                - Coloração: a partir de R$45<br>
                - Tratamentos: a partir de R$40<br>
                - VIP Experience: a partir de R$120<br>
                Veja a tabela completa em 
                <a href="#precos" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Preços</a>.`;

    } else if (
        lowerCaseMessage.includes('horário') ||
        lowerCaseMessage.includes('funcionamento') ||
        lowerCaseMessage.includes('aberto') ||
        lowerCaseMessage.includes('fecha')
    ) {
        return `Nosso horário de funcionamento é:<br>
                Segunda a Sábado: <strong>08:00h às 19:00h</strong><br>
                Domingos e feriados: <strong>Fechado</strong>.`;

    } else if (
        lowerCaseMessage.includes('agendar') ||
        lowerCaseMessage.includes('marcar') ||
        lowerCaseMessage.includes('reservar')
    ) {
        return `Para agendar um horário, acesse nossa seção 
                <a href="#agendamento" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Agendamento</a> ou nos chame no 
                <a href="https://wa.me/5511999999999" target="_blank">WhatsApp</a>.`;

    } else if (
        lowerCaseMessage.includes('serviço') ||
        lowerCaseMessage.includes('o que vocês fazem') ||
        lowerCaseMessage.includes('o que vocês oferecem')
    ) {
        return `Oferecemos cortes masculinos, barba, coloração, tratamentos capilares e 
                nossa exclusiva VIP Experience. Veja todos os detalhes em 
                <a href="#servicos" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Serviços</a>.`;

    } else if (
        lowerCaseMessage.includes('localização') ||
        lowerCaseMessage.includes('endereço') ||
        lowerCaseMessage.includes('onde fica') ||
        lowerCaseMessage.includes('como chegar')
    ) {
        return `Estamos localizados na Rua Exemplo, 123 – Bairro Centro. Veja o mapa em 
                <a href="#contato" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Contato</a>.`;

    } else if (
        lowerCaseMessage.includes('barbeiro') ||
        lowerCaseMessage.includes('equipe') ||
        lowerCaseMessage.includes('profissional')
    ) {
        return `Temos uma equipe de barbeiros experientes! Em 
                <a href="#agendamento" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Agendamento</a> você pode escolher seu barbeiro preferido.`;

    } else if (
        lowerCaseMessage.includes('anvisa') ||
        lowerCaseMessage.includes('higiene') ||
        lowerCaseMessage.includes('segurança') ||
        lowerCaseMessage.includes('esterilização')
    ) {
        return `Seguimos rigorosamente as diretrizes da ANVISA. Utilizamos materiais 
                descartáveis, esterilizamos instrumentos em autoclave e nossos profissionais 
                seguem protocolos rigorosos de higiene. Consulte os links da ANVISA no 
                início do chat para mais detalhes.`;

    } else if (
        lowerCaseMessage.includes('lgpd') ||
        lowerCaseMessage.includes('privacidade') ||
        lowerCaseMessage.includes('dados')
    ) {
        return `Valorizamos sua privacidade! Ao interagir com nosso chatbot e fornecer 
                dados pessoais, você concorda com o uso dessas informações para fins de 
                agendamento e atendimento. Você pode exercer seus direitos sobre seus 
                dados a qualquer momento.`;

    } else if (
        lowerCaseMessage.includes('pagamento') ||
        lowerCaseMessage.includes('pagar') ||
        lowerCaseMessage.includes('forma de pagamento') ||
        lowerCaseMessage.includes('cartão') ||
        lowerCaseMessage.includes('pix')
    ) {
        return `Aceitamos diversas formas de pagamento: dinheiro, PIX, cartão de débito 
                e crédito. Veja mais detalhes na seção 
                <a href="#contato" onclick="document.getElementById('chatbotContainer').classList.remove('active')">
                Contato</a>.`;

    } else {
        return `Desculpe, não entendi sua pergunta. Tente perguntar sobre: 
                <strong>preços</strong>, <strong>horários</strong>, 
                <strong>agendamento</strong>, <strong>serviços</strong>, 
                <strong>localização</strong> ou <strong>pagamento</strong>.`;
    }
}