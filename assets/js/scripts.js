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

// Adiciona evento de clique para todos os links do menu
menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        setActiveMenuLink(this)
    })
})

toggleTheme.addEventListener("click", changeTheme);
