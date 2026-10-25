
function mostrarDetalhes(id) {
    const elemento = document.getElementById(id);

    elemento.classList.toggle("visivel");

    if (elemento.classList.contains("visivel")) {
        elemento.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}