//método .config() responsável por ler a .ENV e disponibilizar em variáveis de ambientes.
require('dotenv').config() 
//importa módulos
const express = require('express')
const axios = require('axios');
const cors = require('cors');


/*importa as classes Configuration e OpenAIApi da biblioteca openai.
--A classe Configuration é usada para configurar as opções e configurações da API. 
--A classe OpenAIApi é usada para fazer chamadas para a API do OpenAI.*/
const { Configuration, OpenAIApi } = require ('openai')

//a variável OPENAI_API_KEY é acessível por meio do objeto global PROCESS que é do node.
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration);

//A função express() retorna um objeto que representa o aplicativo web.
const app = express()
/*Essa linha adiciona o middleware express.json() 
para análise do corpo das solicitações HTTP em formato JSON no aplicativo Express.*/
app.use(express.json())

// Configuração do CORS
app.use(cors());

//Esse trecho de código é uma rota que recebe uma solicitação HTTP POST 
//na rota '/sentimentos'.
app.post('/sentimentos', (req, res) => {
  openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Qual o sentimento deste texto usando apenas uma palavra (Positivo, Negativo ou Neutro): ${req.body.texto}`,
    temperature: 0
  }) //Resposta da API chatGPT
  .then(chatGPTResponse => {
    const sentimento = chatGPTResponse.data.choices[0].text;
    res.json({ sentimento });
  })
});

//a variável PORT é acessível por meio do objeto global PROCESS que é do node.
const porta = process.env.PORT || 4000;

/* uma função  callback que será executada quando o servidor estiver pronto para escutar 
as solicitações. Ela imprime uma mensagem no console informando que o servidor está ativo 
e em qual porta ele está escutando.*/
app.listen(
  porta,
  () => console.log(`Servidor on. Porta: ${porta}`)
);
