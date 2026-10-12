// Configuração da conexão com o Firebase (substitua com suas credenciais do projeto)
const firebaseConfig = {
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("FlexPlus Web Inicializado!");
    _carregarDados();
});

function _carregarDados() {
    // Exemplo de chamada espelhendo a atualização de dados do seu app
    console.log("Atualizando dados do Firebase...");
    
    // Aqui você fará as requisições para preencher os elementos:
    // Exemplo: 
    // firebase.database().ref('Movies').on('value', (snapshot) => { ... });
}
