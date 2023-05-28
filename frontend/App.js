
import { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import { Button, Input, ListItem } from '@rneui/themed';
import axios from 'axios';

export default function App() {

  const [valorInput, setvalorInput] = useState('');
  const [listaValorInputESentimentos, setlistaValorInputESentimentos] = useState([]);
  const [listaSentimentos, setlistaSentimentos] = useState([]);

  
  const mostreValorInput = (atualizaValorDigitado) => {
    setvalorInput(atualizaValorDigitado);
  };

  
  const manipularValorInput = () => {
    if (valorInput.trim() !== '') {
      setlistaValorInputESentimentos((listaValorInputESentimentos) => {
        const aux = [valorInput, ...listaValorInputESentimentos];
        setvalorInput('');
        return aux;
      });
      
      obterSentimento(valorInput); 
    }
  };


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
    axios 
      .post('http://localhost:4000/sentimentos', { texto })
      .then((response) => {
        
        const sentimentoDoBackend = response.data.sentimento;
        
        setlistaSentimentos((listaSentimentos) => [encontrePalavra(sentimentoDoBackend), ...listaSentimentos]);
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  };


  
  const ValoresInputESentimentosExibidos = listaValorInputESentimentos.slice(0, 3);

  
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
