const toggleTheme = document.getElementById("toggleTheme")
const rootHtml = document.documentElement
const menuLinks = document.querySelectorAll(".menu__link")

function createGalaxyBackground() {
    if (document.getElementById("galaxyContainer")) return;

    const galaxyContainer = document.createElement("div");
    galaxyContainer.id = "galaxyContainer";
    galaxyContainer.className = "galaxy-container";

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
    if (galaxyContainer) galaxyContainer.remove();
}

function createLightBackground() {
    if (document.getElementById("lightBackgroundContainer")) return;

    const lightContainer = document.createElement("div");
    lightContainer.id = "lightBackgroundContainer";
    lightContainer.className = "light-background-container";

    const sun = document.createElement("div");
    sun.className = "sun";
    lightContainer.appendChild(sun);

    for (let i = 1; i <= 6; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";
        lightContainer.appendChild(orb);
    }

    for (let i = 1; i <= 5; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        lightContainer.appendChild(cloud);
    }

    document.body.insertBefore(lightContainer, document.body.firstChild);
}

function removeLightBackground() {
    const lightContainer = document.getElementById("lightBackgroundContainer");
    if (lightContainer) lightContainer.remove();
}

function updateNavIcons(theme) {
    document.querySelectorAll(".menu__icon[data-icon-light][data-icon-dark]").forEach(icon => {
        const lightIcon = icon.getAttribute("data-icon-light")
        const darkIcon = icon.getAttribute("data-icon-dark")
        icon.classList.remove(lightIcon, darkIcon)
        icon.classList.add(theme === "dark" ? darkIcon : lightIcon)
    })

    const brandLogo = document.getElementById("brandLogo")
    if (brandLogo) {
        brandLogo.src = theme === "dark"
            ? brandLogo.getAttribute("data-icon-dark")
            : brandLogo.getAttribute("data-icon-light")
    }
}

function changeTheme() {
    const currentTheme = rootHtml.getAttribute("data-theme")

    if (currentTheme === "dark") {
        rootHtml.setAttribute("data-theme", "light")
        removeGalaxyBackground()
        createLightBackground()
        updateNavIcons("light")
    } else {
        rootHtml.setAttribute("data-theme", "dark")
        removeLightBackground()
        createGalaxyBackground()
        updateNavIcons("dark")
    }
}

// Atualiza active em TODOS os links de menu que apontam para a seção (desktop + mobile)
function setActiveMenuLink(sectionId) {
    menuLinks.forEach(link => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
        }
    })
}

function smoothScroll(targetId) {
    const target = document.querySelector(targetId)
    if (target) target.scrollIntoView({ behavior: "smooth" })
}

// Clique nos links do menu (desktop e mobile)
menuLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href")
        if (targetId && targetId.startsWith("#")) {
            e.preventDefault()
            setActiveMenuLink(targetId.slice(1))
            smoothScroll(targetId)
        }
    })
})

// Smooth scroll para botões de ação (.scroll-link)
document.querySelectorAll(".scroll-link").forEach(link => {
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href")
        if (targetId && targetId.startsWith("#")) {
            e.preventDefault()
            smoothScroll(targetId)
        }
    })
})

// Botão "Ver projetos"
const btnProjetos = document.getElementById("btnProjetos")
if (btnProjetos) {
    btnProjetos.addEventListener("click", function() {
        smoothScroll("#projetos")
    })
}

// Scroll unificado: active link + parallax + back-to-top
window.addEventListener("scroll", function() {
    // --- Active link por seção ---
    const sections = document.querySelectorAll("main, section[id]")
    sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight) {
            setActiveMenuLink(section.id || "home")
        }
    })

    // --- Parallax na seção sobre ---
    const aboutSection = document.querySelector(".about--brief")
    if (aboutSection) {
        const scrollY = window.scrollY
        const elementTop = aboutSection.offsetTop
        const elementHeight = aboutSection.clientHeight
        if (scrollY + window.innerHeight > elementTop && scrollY < elementTop + elementHeight) {
            const scrollProgress = (scrollY - elementTop + window.innerHeight) / (window.innerHeight + elementHeight)
            const photo = aboutSection.querySelector(".about__photo")
            const text = aboutSection.querySelector(".about__brief-text")
            if (photo) photo.style.transform = `translateY(${scrollProgress * 30}px)`
            if (text) text.style.transform = `translateY(${-scrollProgress * 20}px)`
        }
    }

    // --- Back to top ---
    const backToTop = document.getElementById("backToTop")
    if (backToTop) {
        backToTop.classList.toggle("visible", window.scrollY > 300)
    }
})

toggleTheme.addEventListener("click", changeTheme);

// Inicializar background e ícones corretos ao carregar
const initialTheme = rootHtml.getAttribute("data-theme")
if (initialTheme === "dark") {
    createGalaxyBackground()
} else {
    createLightBackground()
}
updateNavIcons(initialTheme)

// Botão voltar ao topo
const backToTopBtn = document.getElementById("backToTop")
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" })
    })
}

// ======================================
// ANIMAÇÃO DE SCROLL HORIZONTAL INFINITO - SKILLS
// ======================================
function initSkillsScroll() {
    const skillsList = document.querySelector(".skills__list");
    if (!skillsList) return;

    const skillsItems = Array.from(skillsList.querySelectorAll(".skills__item"));

    // Clona os items originais para o efeito infinito
    skillsItems.forEach(item => {
        const clone = item.cloneNode(true);
        skillsList.appendChild(clone);
    });

    let currentPosition = 0;
    const speed = 0.5;
    let animationId;

    function animate() {
        currentPosition += speed;
        skillsList.style.transform = `translateX(-${currentPosition}px)`;
        if (currentPosition >= skillsList.scrollWidth / 2) {
            currentPosition = 0;
        }
        animationId = requestAnimationFrame(animate);
    }

    skillsList.addEventListener("mouseenter", () => cancelAnimationFrame(animationId));
    skillsList.addEventListener("mouseleave", () => animate());

    animate();
}

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

    function openModal(url) {
        currentProjectUrl = url;
        projectModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        projectModal.classList.remove("active");
        document.body.style.overflow = "auto";
        currentProjectUrl = null;
    }

    projectCards.forEach(card => {
        card.addEventListener("click", () => {
            const githubUrl = card.getAttribute("data-github");
            if (githubUrl) openModal(githubUrl);
        });
    });

    modalConfirm.addEventListener("click", () => {
        if (currentProjectUrl) {
            window.open(currentProjectUrl, "_blank", "noopener,noreferrer");
            closeModal();
        }
    });

    modalCancel.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && projectModal.classList.contains("active")) {
            closeModal();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsModal);
} else {
    initProjectsModal();
}

// ======================================
// TECH ANIMATIONS — PROJECT CARDS
// ======================================
function initProjectsTechAnimations() {
    const projectsSection = document.getElementById("projetos");
    const projectCards    = document.querySelectorAll(".projects__card");

    if (!projectsSection || projectCards.length === 0) return;

    const projectIds = ["PRJ_01", "PRJ_02", "PRJ_03", "PRJ_04", "PRJ_05"];

    projectCards.forEach((card, index) => {
        // 1. Wrap image in .card__image-wrapper
        const img = card.querySelector(".card__covers");
        if (img && !img.closest(".card__image-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.className = "card__image-wrapper";
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }

        // 2. Project ID badge attribute
        card.setAttribute("data-project-id", projectIds[index] || `PRJ_0${index + 1}`);

        // 3. Corner bracket decorations
        ["tl", "tr", "bl", "br"].forEach(pos => {
            const corner = document.createElement("div");
            corner.className = `card__corner card__corner--${pos}`;
            card.appendChild(corner);
        });
    });

    // 4. Intersection Observer — scroll reveal
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("card-revealed");
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    projectCards.forEach(card => cardObserver.observe(card));

    // Heading underline reveal
    const heading = projectsSection.querySelector("h2");
    if (heading) {
        const headingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("heading-revealed");
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        headingObserver.observe(heading);
    }

    // 5. 3-D tilt on mouse move (desktop only)
    if (window.matchMedia("(hover: hover)").matches) {
        projectCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect     = card.getBoundingClientRect();
                const cx       = rect.width  / 2;
                const cy       = rect.height / 2;
                const dx       = e.clientX - rect.left - cx;
                const dy       = e.clientY - rect.top  - cy;
                const rotateX  = (dy / cy) * -5;
                const rotateY  = (dx / cx) *  5;

                card.classList.add("is-tilting");
                card.style.transform = `perspective(900px) translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("mouseleave", () => {
                card.classList.remove("is-tilting");
                card.style.transform = "";
            });
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsTechAnimations);
} else {
    initProjectsTechAnimations();
}

