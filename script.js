/* ─────────────────────────────────────
   KINGS CUT BARBEARIA — script.js
   Organização:
   1. Menu Mobile (Hamburger)
   2. Navbar scroll (encolhe ao rolar)
   3. Scroll suave para links internos
   4. Animação de entrada das seções (IntersectionObserver)
   5. Formulário de agendamento
   6. Data mínima no campo de data (não permite datas passadas)
   7. Máscara de telefone
───────────────────────────────────── */

console.log('script.js carregado');

/* ── 1. MENU MOBILE ── */
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
}

// Fecha o menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
    });
});

// Fecha o menu ao clicar fora dele
document.addEventListener('click', function (e) {
    const nav = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
    }
});


/* ── 2. NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 80) {
        navbar.style.padding = '10px 60px';
        navbar.style.background = 'rgba(0, 0, 0, 0.97)';
    } else {
        navbar.style.padding = '18px 60px';
        navbar.style.background = 'rgba(0, 0, 0, 0.85)';
    }
});


/* ── 3. SCROLL SUAVE ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const alvo = document.querySelector(this.getAttribute('href'));
        if (alvo) {
            const offsetTop = alvo.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});


/* ── 4. ANIMAÇÃO DE ENTRADA DAS SEÇÕES ── */
// Adiciona a classe CSS 'visivel' quando o elemento entra na tela
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
  .section-header
`).forEach(el => {
    el.classList.add('fade-in'); // Classe de estado inicial (invisível)
    observer.observe(el);
});


/* ── 5. FORMULÁRIO DE AGENDAMENTO ── */
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
    });
}


/* ── 6. DATA MÍNIMA (não permite datas passadas) ── */
const inputData = document.getElementById('dataAgendamento');
if (inputData) {
    const hoje = new Date();
    // Define como mínimo o dia seguinte
    hoje.setDate(hoje.getDate() + 1);
    const dataMin = hoje.toISOString().split('T')[0];
    inputData.setAttribute('min', dataMin);
}


/* ── 7. MÁSCARA DE TELEFONE ── */
/* ── 7. MÁSCARA DE TELEFONE ── */
const inputTelefone = document.getElementById('telefoneCliente');
if (inputTelefone) {
    inputTelefone.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);

        if (valor.length <= 10) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        this.value = valor;
    });
}


/* ── FUNÇÃO AUXILIAR: ALERTA VISUAL ── */
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


// ── LIGHTBOX DA GALERIA ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const fechar = document.querySelector('.lightbox-fechar');

// Abre ao clicar em qualquer card da galeria
document.querySelectorAll('.galeria-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    });
});

// Fecha ao clicar no X
fechar.addEventListener('click', fecharLightbox);

// Fecha ao clicar fora da imagem
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) fecharLightbox();
});

// Fecha com a tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharLightbox();
});

function fecharLightbox() {
    lightbox.classList.remove('ativo');
    document.body.style.overflow = '';
}