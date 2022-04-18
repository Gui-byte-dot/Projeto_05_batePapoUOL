
let usuario = "";

newFunction();

function newFunction() {
  entrarNaSala();
}

function entrarNaSala() {
  usuario = prompt("Seu nome")
  const promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    {
      name: usuario,

    }
  );
  promise.then(seSucesso)
    .catch(tratarError);
}

function seSucesso() {
  buscarMensagem();
  setInterval(buscarMensagem, 3000)
  setInterval(carregarDados, 5000)
}
function carregarDados() {
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", { name: usuario })
}


function buscarMensagem() {
  const resposta = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  resposta.then(renderizar);
}


function tratarError(error) {
  if (error.response.status === 400) {
    alert("Peça um novo usuário!");
  }
  newFunction();
}

function renderizar(resposta) {
  console.log('renderizar>>>>>>');
  const mensagens = resposta.data;
  let buscar = document.querySelector(".inserir");
  buscar.innerHTML = "";

  for (let i = 0; i < mensagens.length; i++) {
    const mensagem = mensagens[i];
    if (mensagem.type == "message") {
      buscar.innerHTML += ` 
        <div class="mensagem">
        <p> <span>(${mensagem.time})</span> <span>${mensagem.from}</span> para <span>${mensagem.to}</span> : ${mensagem.text}</p>
        </div>       
        `
    }
    if (mensagem.type == "status") {
      buscar.innerHTML += `
        <div class="status">
        <p> <span>(${mensagem.time})</span> <span>${mensagem.from}</span> ${mensagem.text}</p>
        </div> 
        
        `
    }
    if (mensagem.type == "private_message") {
      buscar.innerHTML += `
          <div class="privado">
          <p> <span>(${mensagem.time})</span> <span>${mensagem.from}</span> reservadamente para ${mensagem.to}</p>
          </div> 
          `
    }

  }
  const elementoQueQueroQueApareca = document.querySelector('.inserir');
  elementoQueQueroQueApareca.scrollIntoView();

}

function enviarMensagem() {
  const p = Promise.resolve(buscaParticipantes());
  p.then(function (v) {
    for(let i = 0; i < v.data.length; i++){
      console.log(v.data[i].name); // 1
    }
  });
  let mensagemenviada = document.querySelector(".escrevaAqui").value;
  let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
    from: usuario,
    to: "Todos",
    text: mensagemenviada,
    type: "message"
  }
  );
  promise.then(enviarComSucesso)
    .catch(enviarErro);
}

function enviarComSucesso() {
  buscarMensagem();
}

function enviarErro() {
  window.location.reload();
}
function buscaParticipantes() {
  return axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
}
