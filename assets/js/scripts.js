const toggleTheme = document.getElementById("toggleTheme")
const rootHtml = document.documentElement
const menuLinks = document.querySelectorAll(".menu__link")

function createGalaxyBackground() {
    // Verifica se o container já existe
    if (document.getElementById("galaxyContainer")) return;
    
    const galaxyContainer = document.createElement("div");
    galaxyContainer.id = "galaxyContainer";
    galaxyContainer.className = "galaxy-container";
    
    // Cria a lua
    const moon = document.createElement("div");
    moon.className = "moon";
    galaxyContainer.appendChild(moon);
    
    galaxyContainer.innerHTML += `
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
    `;
    
    document.body.insertBefore(galaxyContainer, document.body.firstChild);
}

function removeGalaxyBackground() {
    const galaxyContainer = document.getElementById("galaxyContainer");
    if (galaxyContainer) {
        galaxyContainer.remove();
    }
}

function createLightBackground() {
    // Verifica se o container já existe
    if (document.getElementById("lightBackgroundContainer")) return;
    
    const lightContainer = document.createElement("div");
    lightContainer.id = "lightBackgroundContainer";
    lightContainer.className = "light-background-container";
    
    // Cria o sol
    const sun = document.createElement("div");
    sun.className = "sun";
    lightContainer.appendChild(sun);
    
    // Cria 6 orbes com animação
    for (let i = 1; i <= 6; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";
        lightContainer.appendChild(orb);
    }
    
    // Cria 5 nuvens
    for (let i = 1; i <= 5; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        lightContainer.appendChild(cloud);
    }
    
    document.body.insertBefore(lightContainer, document.body.firstChild);
}

function removeLightBackground() {
    const lightContainer = document.getElementById("lightBackgroundContainer");
    if (lightContainer) {
        lightContainer.remove();
    }
}

function changeTheme(){
    const currentTheme = rootHtml.getAttribute("data-theme")
    
    if(currentTheme === "dark") {
        rootHtml.setAttribute("data-theme", "light")
        removeGalaxyBackground()
        createLightBackground()
    } else {
        rootHtml.setAttribute("data-theme", "dark")
        removeLightBackground()
        createGalaxyBackground()
    } 
}

function setActiveMenuLink(clickedLink) {
    // Remove active de todos os links
    menuLinks.forEach(link => link.classList.remove("active"))
    // Adiciona active ao link clicado
    clickedLink.classList.add("active")
}

// Smooth scroll para os links do menu
function smoothScroll(targetId) {
    const target = document.querySelector(targetId)
    if (target) {
        target.scrollIntoView({ behavior: "smooth" })
    }
}

// Adiciona evento de clique para todos os links do menu
menuLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href")
        
        // Só prevenir comportamento padrão e fazer scroll se for link interno
        if (targetId && targetId.startsWith("#")) {
            e.preventDefault()
            setActiveMenuLink(this)
            smoothScroll(targetId)
        }
    })
})

// Atualizar link ativo ao fazer scroll
window.addEventListener("scroll", function() {
    const sections = document.querySelectorAll("main, section[id]")
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight) {
            const sectionId = section.id || "home"
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`)
            if (activeLink) {
                setActiveMenuLink(activeLink)
            }
        }
    })
})

// Parallax effect na seção sobre
window.addEventListener("scroll", function() {
    const aboutSection = document.querySelector(".about--brief")
    if (aboutSection) {
        const scrollY = window.scrollY
        const elementTop = aboutSection.offsetTop
        const elementHeight = aboutSection.clientHeight
        
        if (scrollY + window.innerHeight > elementTop && scrollY < elementTop + elementHeight) {
            const scrollProgress = (scrollY - elementTop + window.innerHeight) / (window.innerHeight + elementHeight)
            
            // Animar elementos filhos com parallax
            const photo = aboutSection.querySelector(".about__photo")
            const text = aboutSection.querySelector(".about__brief-text")
            
            if (photo) {
                photo.style.transform = `translateY(${scrollProgress * 30}px)`
            }
            if (text) {
                text.style.transform = `translateY(${-scrollProgress * 20}px)`
            }
        }
    }
})

toggleTheme.addEventListener("click", changeTheme);

// Inicializar background correto ao carregar
if (rootHtml.getAttribute("data-theme") === "dark") {
    createGalaxyBackground()
} else {
    createLightBackground()
}

// ======================================
// ANIMAÇÃO DE SCROLL HORIZONTAL INFINITO - SKILLS
// ======================================
function initSkillsScroll() {
    const skillsList = document.querySelector(".skills__list");
    if (!skillsList) return;

    const skillsItems = Array.from(skillsList.querySelectorAll(".skills__item"));
    const itemsCount = skillsItems.length;
    
    // Clona todos os items para criar o efeito infinito
    skillsItems.forEach(item => {
        const clone = item.cloneNode(true);
        skillsList.appendChild(clone);
    });

    // Configurações de animação
    let currentPosition = 0;
    const speed = 0.5; // pixels por frame
    let animationId;

    function animate() {
        currentPosition += speed;
        skillsList.style.transform = `translateX(-${currentPosition}px)`;

        // Reiniciar quando chegar na metade (loop infinito suave)
        const scrollWidth = skillsList.scrollWidth;
        if (currentPosition >= scrollWidth / 2) {
            currentPosition = 0;
        }

        animationId = requestAnimationFrame(animate);
    }

    // Pausar animação ao passar o mouse
    skillsList.addEventListener("mouseenter", () => {
        cancelAnimationFrame(animationId);
    });

    // Retomar animação ao sair o mouse
    skillsList.addEventListener("mouseleave", () => {
        animate();
    });

    // Iniciar animação
    animate();
}

// Inicializar quando DOM estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSkillsScroll);
} else {
    initSkillsScroll();
}

// ======================================
// MODAL PARA ABRIR PROJETOS NO GITHUB
// ======================================
function initProjectsModal() {
    const projectCards = document.querySelectorAll(".projects__card");
    const projectModal = document.getElementById("projectModal");
    const modalConfirm = document.getElementById("modalConfirm");
    const modalCancel = document.getElementById("modalCancel");
    const modalOverlay = document.querySelector(".project-modal__overlay");
    
    let currentProjectUrl = null;

    // Função para abrir o modal
    function openModal(url) {
        currentProjectUrl = url;
        projectModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Previne scroll da página
    }

    // Função para fechar o modal
    function closeModal() {
        projectModal.classList.remove("active");
        document.body.style.overflow = "auto"; // Restaura scroll da página
        currentProjectUrl = null;
    }

    // Evento de clique em cada card
    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const githubUrl = card.getAttribute("data-github");
            if (githubUrl) {
                openModal(githubUrl);
            }
        });
    });

    // Botão confirmar
    modalConfirm.addEventListener("click", () => {
        if (currentProjectUrl) {
            window.open(currentProjectUrl, "_blank");
            closeModal();
        }
    });

    // Botão cancelar
    modalCancel.addEventListener("click", closeModal);

    // Fechar ao clicar no overlay
    modalOverlay.addEventListener("click", closeModal);

    // Fechar ao pressionar ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("active")) {
            closeModal();
        }
    });
}

// Inicializar o modal quando DOM estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsModal);
} else {
    initProjectsModal();
}

