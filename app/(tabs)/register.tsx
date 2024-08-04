import { StyleSheet, Image, View, TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  const key = '@PRODUCTS';
  const [nome, setNome] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  const [produtos, setProdutos] = useState<Array<any>>([]);

  const adicionarProduto = async () => {
    if (nome && preco) {
      const novoProduto = { nome: nome.toUpperCase(), preco };
      const novosProdutos = [...produtos, novoProduto];
      setProdutos(novosProdutos);
      await salvar(novosProdutos);
      setNome('');
      setPreco('');
    }
  };

  const salvar = async (produtosParaSalvar: Array<any>) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(produtosParaSalvar));
      console.log('--->', JSON.stringify(produtosParaSalvar));
    } catch (error) {
      console.error('Erro ao salvar os produtos:', error);
    }
  };

  const buscaProduto = async () => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
      return [];
    }
  }

  const deletarProduto = async (itemDelete: any) => {
    const novosProdutos = produtos.filter(item => item !== itemDelete);
    setProdutos(novosProdutos);
    await salvar(novosProdutos);
  }

  useEffect(() => {
    (async () => {
      const data = await buscaProduto();
      setProdutos(data);
      console.log(data);
    })();
  }, []);

  return (
    <ParallaxScrollView
      disableParallax={true}
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/cadastrar-produto.png')}
          style={styles.reactLogo}
        />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Produtos</ThemedText>
      </ThemedView>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Preço R$"
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={adicionarProduto}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
        {
          produtos.length > 0 &&
          <ScrollView>
            {produtos.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{item.nome}</Text>
                <Text style={styles.listText}>R$: {item.preco}</Text>
                <TouchableOpacity onPress={() => deletarProduto(item)}>
                  <Ionicons name="remove-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        }
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#BFBFBF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 5,
    marginBottom: 10,
  },
  listText: {
    fontSize: 16,
    fontWeight: '500'
  },
  button: {
    flex: 1,
    height: '90%',
    maxHeight: 600,
    backgroundColor: '#17B2C4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
