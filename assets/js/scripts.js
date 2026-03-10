const toggleTheme= document.getElementById("toggleTheme")
const rootHtml= document.documentElement
const menuLinks = document.querySelectorAll(".menu__link")

function changeTheme(){
    const currentTheme=rootHtml.getAttribute("data-theme")
    
    if(currentTheme === "dark") {
        rootHtml.setAttribute("data-theme", "light")
    }else{
        rootHtml.setAttribute("data-theme","dark")
    } 

    toggleTheme.classList.toggle("bi-sun")
    toggleTheme.classList.toggle("bi-moon-stars")
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
        e.preventDefault()
        const targetId = this.getAttribute("href")
        setActiveMenuLink(this)
        smoothScroll(targetId)
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
