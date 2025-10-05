// Garante que, ao carregar a página, o scroll esteja no topo
window.addEventListener('load', () => {
  // Desativa a restauração automática de scroll do navegador
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // Move o scroll para a posição x=0, y=0 (topo)
  window.scrollTo(0, 0);
});


const space = document.getElementById('space');
const earth = document.getElementById('earth');
const mars = document.getElementById('mars');
const textOverlays = document.querySelectorAll('.text-overlay');
const videoOverlay = document.getElementById('video-overlay');
// Adicione as linhas abaixo
const rocketImg = document.getElementById('rocket-img');
const staticRocket = '/images/rocket_trans.png'; // Caminho para a imagem estática
const animatedRocket = '/images/rocket.gif'; // Caminho para o GIF animado
let scrollTimeout; // Variável para controlar o nosso temporizador
// Fim da adição

let videoShown = false;

// Array para armazenar as estrelas
const stars = [];
const numStars = 150;

// Variável para rastrear a última posição do scroll
let lastScrollY = window.scrollY;

// Criar estrelas iniciais
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Diferentes tamanhos para criar profundidade
    const size = Math.random();
    if (size < 0.5) {
        star.classList.add('star-small');
    } else if (size < 0.85) {
        star.classList.add('star-medium');
    } else {
        star.classList.add('star-large');
    }
    
    // Posição inicial aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    star.style.left = x + '%';
    star.style.top = y + '%';
    
    space.appendChild(star);
    
    return {
        element: star,
        x: x,
        y: y,
        // A velocidade afeta o quão rápido a estrela se move em relação ao scroll (efeito parallax)
        speed: size < 0.5 ? 0.05 : size < 0.85 ? 0.1 : 0.15, 
        size: size
    };
}

// Inicializar estrelas
for (let i = 0; i < numStars; i++) {
    stars.push(createStar());
}

function handleScroll() {
    // --- INÍCIO DO CÓDIGO ADICIONADO ---

    // Limpa o temporizador anterior sempre que um novo evento de scroll ocorre
    clearTimeout(scrollTimeout);

    // Garante que o GIF animado seja exibido durante o scroll
    if (!rocketImg.src.endsWith(animatedRocket)) {
        rocketImg.src = animatedRocket;
    }

    // Cria um novo temporizador. Se o usuário não rolar a página por 200ms,
    // a imagem voltará a ser a estática.
    scrollTimeout = setTimeout(() => {
        rocketImg.src = staticRocket;
    }, 200);
    
    const currentScrollY = window.scrollY;
    const scrollPercent = (currentScrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    // Calcula a diferença de rolagem para determinar direção e intensidade
    const deltaY = currentScrollY - lastScrollY;

    // Mover as estrelas com base no scroll
    stars.forEach(star => {
        // A posição Y da estrela é atualizada com base na direção (deltaY) e na sua velocidade individual
        star.y += deltaY * star.speed;

        // Se a estrela sair da tela por baixo, reposicione-a no topo
        if (star.y > 105) {
            star.y = -5;
            star.x = Math.random() * 100;
        } 
        // Se a estrela sair da tela por cima, reposicione-a embaixo
        else if (star.y < -5) {
            star.y = 105;
            star.x = Math.random() * 100;
        }

        // Atualizar posição no DOM
        star.element.style.top = star.y + '%';
        star.element.style.left = star.x + '%';
    });
    
    // Atualiza a última posição de scroll para o próximo evento
    lastScrollY = currentScrollY;

    // --- O restante da sua lógica original permanece aqui ---

    // Terra desaparece gradualmente
    if (scrollPercent < 20) {
        earth.style.opacity = 1 - (scrollPercent / 20);
        earth.style.transform = `translateX(-50%) scale(${1 - scrollPercent / 40})`;
    } else {
        earth.style.opacity = 0;
    }

    // Marte aparece gradualmente
    if (scrollPercent > 80) {
        mars.style.opacity = (scrollPercent - 80) / 20;
        mars.style.transform = `translateX(-50%) scale(${0.8 + (scrollPercent - 80) / 100})`;
    } else {
        mars.style.opacity = 0;
    }

    // Textos laterais
    textOverlays.forEach(text => {
        const start = parseFloat(text.dataset.start);
        const end = parseFloat(text.dataset.end);

        if (scrollPercent >= start && scrollPercent <= end) {
            text.style.opacity = 1;
        } else {
            text.style.opacity = 0;
        }
    });

    // Mostrar simulador Eyes ao chegar em Marte
    if (scrollPercent >= 98 && !videoShown) {
        videoShown = true;
        setTimeout(() => {
            document.getElementById('eyes-simulator-container').style.display = 'flex';
            resizeEyesIframe();
            // Focar em Marte (opcional, se usar iframe)
            const iframe = document.getElementById('eyes-iframe');
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ action: 'goTo', target: 'mars' }, '*');
            }
        }, 500);
    }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

document.getElementById('close-eyes-simulator').addEventListener('click', () => {
    // Substitua 'sua-outra-pagina.html' pelo endereço da página de destino
    window.location.href = 'document.html'; 
});

// Função para ajustar altura do iframe
function resizeEyesIframe() {
    const iframe = document.getElementById('eyes-iframe');
    const container = document.getElementById('eyes-simulator-container');

    if (!iframe || !container) return;

    // Calcula altura disponível (tela - espaço para o botão)
    const availableHeight = window.innerHeight - 100; // 100px para margem e botão

    iframe.style.width = '90vw';
    iframe.style.maxWidth = '1400px';
    iframe.style.height = `${availableHeight}px`;
}

// Redimensionar ao redimensionar janela
window.addEventListener('resize', resizeEyesIframe);