//importa módulos
import { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import { Button, Input, ListItem } from '@rneui/themed';
import axios from 'axios';

export default function App() {
  //Define um estado para a variável 'sentimento' 'listaValorInputESentimentos' 'listaSentimentos' 
  //e uma função para atualizá-la
  const [valorInput, setvalorInput] = useState('');
  const [listaValorInputESentimentos, setlistaValorInputESentimentos] = useState([]);
  const [listaSentimentos, setlistaSentimentos] = useState([]);

  //Atualiza o valor do estado 'mostreValorInput' com o valor digitado pelo usuário
  //Isso fará com que o valor digitado pelo usuário apareça dentro do input.
  const mostreValorInput = (atualizaValorDigitado) => {
    setvalorInput(atualizaValorDigitado);
  };

  /*A função manipularValorInput verifica se o o valor do input não está vazio, 
  adiciona a frase à lista de sentimentos e chama uma função para obter informações 
  adicionais sobre o sentimento.*/
  const manipularValorInput = () => {
    if (valorInput.trim() !== '') {
      setlistaValorInputESentimentos((listaValorInputESentimentos) => {
        const aux = [valorInput, ...listaValorInputESentimentos];
        setvalorInput('');
        return aux;
      });
      // Chama a função para obter o sentimento ao adicionar um sentimento
      obterSentimento(valorInput); 
    }
  };

/*Essa função remove um elemento da lista de sentimentos. 
  A função removerSentimentoEFrase atualiza o estado da lista de sentimentos utilizando o hook 
  setlistaValorInputESentimentos. Ela faz uma cópia da lista atual usando o spread operator 
  [...listaValorInputESentimentos] e, em seguida, remove um elemento da posição indicada pelo índice 
  utilizando o método splice. A lista atualizada é retornada e substitui a lista original 
  no estado da aplicação.*/
  const removerSentimentoEFrase = (index) => {
    setlistaValorInputESentimentos((listaValorInputESentimentos) => {
      const auxFrases = [...listaValorInputESentimentos];
      auxFrases.splice(index, 1);
      return auxFrases;
    });
  
    setlistaSentimentos((listaSentimentos) => {
      const auxSentimentos = [...listaSentimentos];
      auxSentimentos.splice(index, 1);
      return auxSentimentos;
    });
  };

  //Pega somente a palavra 'Positivo', 'Negativo' ou 'Neutro' da frase retornada pela API.
  //Ou seja, tira os '\n\n' e outros valores.
  const encontrePalavra = (frase) => {
    let sentimento = '';

    if (frase.includes('Positivo')) {
      sentimento = 'Positivo';
    } else if (frase.includes('Negativo')) {
      sentimento = 'Negativo';
    } else {
      sentimento = 'Neutro';
    }
    return sentimento;
  };

  const obterSentimento = (texto) => {
    axios //Faz uma requisição POST para 'http://localhost:4000/sentimentos'
      .post('http://localhost:4000/sentimentos', { texto })
      .then((response) => {
        //Obtém o sentimento do backend a partir da resposta da requisição.
        const sentimentoDoBackend = response.data.sentimento;
        //Atualiza o valor do estado 'sentimentos' com o novo sentimento obtido.
        setlistaSentimentos((listaSentimentos) => [encontrePalavra(sentimentoDoBackend), ...listaSentimentos]);
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  };


  //Seleciona apenas os 3 primeiros listaValorInputESentimentos para serem exibidos.
  const ValoresInputESentimentosExibidos = listaValorInputESentimentos.slice(0, 3);

  //Este bloco de código retorna a estrutura visual da interface do aplicativo.
  //Ex: Input, Button e ListItem.
  return (
    <View style={styles.container}>
      <View style={styles.entradaView}>
        <Input
          placeholder="Digite uma frase"
          style={styles.inputStyle}
          onChangeText={mostreValorInput} 
          value={valorInput}
        />

        <Button
          title="Enviar"
          color="secondary"
          style={styles.botaoEnviar}
          onPress={manipularValorInput}
        ></Button>
      </View>

      <View style={styles.listaValorInputESentimentosView}>
        {ValoresInputESentimentosExibidos.map((valorInput, index) => (
          <View key={index}>
            <ListItem
              //Quando o usuário clicar e segurar em cima do item (frase+sentimento) 
              //ele será removido da tela e lista.
              onLongPress={() => removerSentimentoEFrase(index)}
              style={styles.listItem}
            >
              <ListItem.Content>
                <ListItem.Title>Frase: {valorInput}</ListItem.Title>
                <ListItem.Subtitle>
                  Sentimento: {listaSentimentos[index]}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
            {index !== ValoresInputESentimentosExibidos.length - 1 && (
              <View style={styles.divisao} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

//cria um objeto com estilos
const styles = StyleSheet.create({
  container: {
    padding: 40,
    width: '100%',
    alignItems: 'center',
    backgroundImage:
      'linear-gradient(to right top, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
  },
  inputStyle: {
    borderColor: '#808080',
    borderWidth: 1,
    marginBottom: 4,
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#ddd8f9',
    borderRadius: 8,
    fontWeight: 'bold'
  },
  entradaView: {
    width: '80%',
    marginBottom: 4,
  },
  listItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  listaValorInputESentimentosView: {
    width: '82%',
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
  },
  divisao: {
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  botaoEnviar: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    marginLeft: '1%',
    marginRight: '1%'
  },
});
