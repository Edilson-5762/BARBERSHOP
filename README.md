Barber Shop – Landing Page Responsiva com PWA
Projeto de landing page moderna para uma barbearia fictícia, focada em conversão de clientes, performance e boas práticas de front-end.
Desenvolvido em HTML, CSS e JavaScript puro, com estrutura preparada para funcionar como PWA (Progressive Web App).

✂️ Visão Geral do Projeto
A ideia do projeto é simular um site real de barbearia que um cliente pediria para ter:

Visual forte, com identidade de marca bem definida.
Foco em agendamentos via WhatsApp.
Seções claras e objetivas para apresentar:
serviços,
equipe,
portfólio (modelos de cortes),
depoimentos,
localização e formas de contato.
Totalmente responsivo, funcionando bem em desktop, tablet e celular.
Preparado para ser instalado como “app” na tela inicial (via PWA).
Esse tipo de landing page é comum em pequenos negócios locais (barbearia, salão, estética, restaurantes etc.) e mostra bem o domínio de layout, UX e código limpo.

🛠️ Tecnologias e Ferramentas Utilizadas
HTML5

Estrutura semântica das seções (header, main, section, footer).

Uso correto de headings para hierarquia de conteúdo.

Links otimizados para navegação interna.

CSS3

Layout responsivo com flexbox e grid.

Sistema de cores usando variáveis (:root).

Tipografia com Google Fonts.

Efeitos de hover, transições, sombras e pequenas animações.

Ajustes por breakpoint com @media para diferentes telas.

JavaScript (Vanilla)

Menu mobile (abre/fecha com “hamburguer”).

Scroll suave entre seções.

Interações da UI (por exemplo, adicionar/remover classes em eventos).

Lógica para animações de entrada ao rolar a página (IntersectionObserver).

Base para PWA: registro do Service Worker.

PWA (Progressive Web App) – Estrutura

manifest.json (nome do app, cores, ícones).

service-worker.js (preparado para cache dos principais assets).

Registro do service worker via JavaScript.

Preparado para Add to Home Screen em navegadores compatíveis.

Outros recursos

Ícones com Font Awesome.

Possibilidade de deploy simples via GitHub Pages ou qualquer servidor estático.

💈 Funcionalidades Principais
1. Navegação e Estrutura
Navbar fixa no topo:
Links para todas as seções importantes (Sobre, Serviços, Portfólio, Depoimentos, Contato, etc.).
Botão de “Agendar” com destaque que leva direto ao WhatsApp.
Menu mobile:
Layout colapsado em telas pequenas.
Ícone de menu (três linhas) que abre/fecha a navegação.
Fechamento automático ao clicar em um link.
2. Hero / Seção Inicial
Sessão principal com:
Título forte da barbearia.
Subtítulo explicando a proposta (estilo, atendimento, agendamento).
Botões de ação (CTA):
Ver serviços.
Agendar pelo WhatsApp.
Estatísticas de destaque (anos de experiência, clientes atendidos, avaliação média).
3. Sobre a Barbearia
Texto apresentando:
História/propósito da barbearia (conteúdo fictício, mas realista).
Diferenciais (atendimento, ambiente, produtos profissionais, etc.).
Grade de “features” com ícones:
Ex.: cortes masculinos, barba, sobrancelha, pacote completo, etc.
4. Serviços
Lista de serviços organizados com:
Nome do serviço.
Breve descrição.
Preço (fictício, fácil de editar depois).
Exemplos:
Corte masculino.
Barba completa.
Corte + barba.
Química (progressiva, coloração).
Pacote premium.
5. Portfólio / Modelos de Cortes
Seção com cards de imagens:
Imagens de cortes de cabelo e barba (fictícias, usando bancos gratuitos).
Cada card com título/legenda.
Lightbox:
Ao clicar na imagem, é aberta em destaque (overlay).
Tela escurecida, foco na foto.
Fechamento por clique no “X”, clique fora da imagem ou tecla Esc.
Mostra habilidade com:
Manipulação do DOM.
Eventos de clique.
UX de visualização de imagens.
6. Depoimentos
Cards de depoimentos com:
Nome do cliente (fictício).
Pequeno texto de feedback.
Avaliação em estrelas.
Demonstra preocupação com prova social e credibilidade.
7. Contato e Localização
Seção com:
Endereço completo da barbearia.
Telefone e WhatsApp.
Horário de funcionamento.
Ícones de redes sociais.
Espaço reservado para:
Inserir um mapa do Google Maps (embed) no futuro.
8. Agendamento via WhatsApp
Vários botões espalhados pelo site que:
Abrem diretamente uma conversa no WhatsApp com mensagem pré-preenchida.
Isso facilita o contato do cliente e aumenta as chances de conversão.
9. PWA – “Instalar como App”
Site estruturado para:
Ser instalado na tela inicial em smartphones.
Rodar em modo “tela cheia”, com cores e ícone personalizados.
Arquivos chave:
manifest.json – define nome, ícones, cor da barra, layout de exibição.
service-worker.js – preparado para estratégia de cache (pode evoluir para cache-first, network-first, etc.).
Resultado:
Experiência parecida com um app, mas com custo de desenvolvimento muito menor.
10. Performance e Responsividade
Layout fluido, adaptado para:
Mobile first: tudo funciona muito bem no celular.
Tablets e desktops, com ajustes de grid e espaçamentos.
Uso de imagens otimizadas (quando possível) e carregamento leve (HTML/CSS/JS puro, sem frameworks pesados).
📐 Organização do Código
Estrutura típica de projeto estático:

/
├─ index.html        # Estrutura principal da página
├─ style.css         # Estilos e responsividade
├─ script.js         # Interações, menu, animações, PWA (registro)
├─ manifest.json     # Configuração do PWA (nome, ícones, cores)
└─ service-worker.js # Lógica de cache para PWA (base)
HTML
Uso de tags semânticas:
<header>, <nav>, <main>, <section>, <footer>.
Cada seção tem id claro para navegação:
#sobre, #servicos, #portfolio, #depoimentos, #contato, etc.
CSS
Variáveis globais (exemplo):
  :root {
    --dark: #0b0b0b;
    --gray: #181818;
    --primary: #e0a800; /* Exemplo de cor principal */
    --text-muted: #aaaaaa;
    --white: #ffffff;
  }
Organização por blocos:
Navbar, Hero, Seções, Cards, Footer, Responsivo.
Quebras por @media (max-width: ...) para diferentes dispositivos.
JavaScript
Funções separadas por responsabilidade:

Menu mobile:

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}
Scroll suave entre seções.

IntersectionObserver para animações de entrada (fade-in).

Lightbox de portfólio.

Registro de Service Worker:

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.log('SW não registrado:', err));
  });
}
🤝 Objetivo Profissional
Este projeto foi desenvolvido com foco em:

Mostrar domínio de HTML, CSS e JavaScript puro sem depender de frameworks.
Demonstrar a capacidade de:
Pensar layout e experiência do usuário para um negócio real.
Organizar código limpo, semântico e fácil de manter.
Aplicar conceitos modernos de front-end como PWA.
Servir como base para:
Ser adaptado para outros nichos (salão de beleza, clínica, restaurantes).
Evoluir para um projeto maior (backend, painel de agendamentos, integrações).
🚀 Possíveis Evoluções
Integração com uma API real de agendamento.
Painel de administração para atualizar serviços e preços.
Formulário de contato com envio de e-mail.
Otimizações de SEO (metatags, rich snippets).
Otimização de performance (imagens, lazy loading, minificação).
📎 Como rodar localmente
Clonar o repositório:
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPO-BARBEARIA.git
Entrar na pasta do projeto:
   cd NOME-DO-REPO-BARBEARIA
Abrir o index.html no navegador
(ou usar a extensão Live Server no VS Code para recarregar automaticamente).
Qualquer feedback sobre código, organização ou sugestões de melhoria são muito bem-vindos.

