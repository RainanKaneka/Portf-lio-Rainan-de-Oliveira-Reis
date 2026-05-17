const copyButton = document.getElementById("copiarBtn");
const copyFeedback = document.getElementById("copyFeedback");
const email = "rainanreis31@gmail.com";

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyFeedback.textContent = "E-mail copiado: " + email;
  } catch (error) {
    copyFeedback.textContent = "Não foi possível copiar. E-mail: " + email;
    console.error("Erro ao copiar e-mail:", error);
  }
});
