// function moveSlide(direction, gridId) {
//     const grid = document.getElementById(gridId);
    
//     // Mede a largura real do primeiro card (incluindo padding e border)
//     const cardWidth = grid.querySelector('.project-card').offsetWidth;
    
//     // O valor do 'gap' que você definiu no CSS (2rem = 32px)
//     const gap = 30; 
    
//     // O quanto a fileira deve andar é a largura de um card + o espaço
//     const scrollStep = cardWidth + gap;

//     if (direction === 1) {
//         // Direita
//         grid.scrollBy({ left: scrollStep, behavior: 'smooth' });
//     } else {
//         // Esquerda
//         grid.scrollBy({ left: -scrollStep, behavior: 'smooth' });
//     }
// }

// // Aguarda o DOM carregar completamente
// document.addEventListener("DOMContentLoaded", function() {
    
//     const frierenContainer = document.querySelector(".frierenSide");
    
//     // Escuta o movimento do mouse no corpo da página
//     document.body.addEventListener("mousemove", function(e) {
        
//         // 1. Obtém as coordenadas do mouse e o centro da tela
//         const mouseX = e.clientX;
//         const mouseY = e.clientY;
//         const centerX = window.innerWidth / 2;
//         const centerY = window.innerHeight / 2;

//         // 2. Calcula o quanto o mouse se moveu em relação ao centro (entre -1 e 1)
//         // Isso define a direção do movimento.
//         const percentX = (mouseX - centerX) / centerX;
//         const percentY = (mouseY - centerY) / centerY;

//         // 3. A INTENSIDADE DO PARALLAX (Nível Profissional)
//         // Vamos mover a Frieren bem pouco, cerca de 15-20 pixels no máximo,
//         // mas na direção *oposta* ao mouse para criar profundidade.
//         const movementX = -percentX * 20; 
//         const movementY = -percentY * 15;

//         // 4. Aplica o movimento suavemente usando Translate3d (melhor performance)
//         frierenContainer.style.transform = `translate3d(${movementX}px, ${movementY}px, 0)`;
        
//         // DICA PRO: Adicione um console.log para ver as coordenadas
//         // console.log(`X: ${movementX}px, Y: ${movementY}px`);
//     });
// });


document.getElementById("copiarBtn").addEventListener("click", function() {
    try {
        const texto = "rainanreis31@gmail.com"

        navigator.clipboard.writeText(texto)

        alert("Email copiado para a área de transferência")

    } catch (e) {
        console.error("Erro inesperado: ", e);
    }
});