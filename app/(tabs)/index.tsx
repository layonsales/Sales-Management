import { Image, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Venda {
  data: string;
  nome: string;
  quantidade: string;
}

interface Produto {
  nome: string;
  preco: string | number;
}

interface ProdutoVenda {
  nome: string;
  quantidadeTotal: number;
  total: number;
}

interface VendaPorData {
  data: string;
  totalDoDia: number;
  produtos: { [nome: string]: ProdutoVenda };
}

interface AnaliseVenda {
  data: string;
  totalDoDia: string;
  produtos: ProdutoVenda[];
}

export default function HomeScreen() {
  const keyProduct = '@PRODUCTS';
  const keyVendas = '@Venda';

  const [produtos, setProdutos] = useState<Array<any>>([]);
  const [vendas, setVendas] = useState<Array<any>>([]);
  const [analise, setAnalise] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const buscaProduto = async () => {
    const data = await AsyncStorage.getItem(keyProduct);
    const parsed = data ? JSON.parse(data) : [];
    setProdutos(parsed);
  }

  const buscaVenda = async () => {
    const data = await AsyncStorage.getItem(keyVendas);
    const parsed = data ? JSON.parse(data) : [];
    setVendas(parsed);
  }

  function analisarVendas(vendas: Venda[], produtos: Produto[]): AnaliseVenda[] {
    const produtoMap: Map<string, number> = new Map();

    produtos.forEach(produto => {
      const preco = typeof produto.preco === 'string' ? produto.preco : produto.preco.toString();
      produtoMap.set(produto.nome.toUpperCase().trim(), parseFloat(preco.replace(",", ".")));
    });

    const vendasPorData: Map<string, VendaPorData> = new Map();

    vendas.forEach(venda => {
      const nomeProduto = venda.nome.toUpperCase().trim();
      const quantidade = parseInt(venda.quantidade);
      const preco = produtoMap.get(nomeProduto) || 0;
      const total = quantidade * preco;
      const data = venda.data.split('T')[0];

      if (!vendasPorData.has(data)) {
        vendasPorData.set(data, {
          data: data,
          totalDoDia: 0,
          produtos: {}
        });
      }

      const vendaDoDia = vendasPorData.get(data)!;
      vendaDoDia.totalDoDia += total;

      if (!vendaDoDia.produtos[nomeProduto]) {
        vendaDoDia.produtos[nomeProduto] = {
          nome: venda.nome,
          quantidadeTotal: 0,
          total: 0
        };
      }

      vendaDoDia.produtos[nomeProduto].quantidadeTotal += quantidade;
      vendaDoDia.produtos[nomeProduto].total += total;
    });

    const analise: any[] = Array.from(vendasPorData.values()).map(vendaDoDia => {
      return {
        data: vendaDoDia.data,
        totalDoDia: vendaDoDia.totalDoDia.toFixed(2),
        produtos: Object.values(vendaDoDia.produtos).map(produto => {
          return {
            nome: produto.nome,
            quantidadeTotal: produto.quantidadeTotal,
            total: produto.total.toFixed(2)
          };
        })
      };
    });

    analise.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return analise;
  }

  const loadScreen = async () => {
    setLoading(true)
    try {
      await buscaProduto();
      await buscaVenda();
      const info = analisarVendas(vendas, produtos);
      setAnalise(info);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScreen();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/vervendas.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Suas Vendas</ThemedText>
        <TouchableOpacity onPress={loadScreen}>
          {!loading && <Ionicons name="reload-circle" size={35} color="blue" />}
        </TouchableOpacity>
      </ThemedView>
      {
        !loading && (
          analise.length > 0 ?
            <ScrollView>
              {analise.map((venda, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.date}>Data: {venda.data}</Text>
                  <Text style={styles.total}>Total do Dia: {venda.totalDoDia}</Text>
                  {venda.produtos.map((produto: any, pIndex: any) => (
                    <View key={pIndex} style={styles.product}>
                      <Text style={styles.productName}>Produto: {produto.nome}</Text>
                      <Text style={styles.productDetail}>Quantidade Total: {produto.quantidadeTotal}</Text>
                      <Text style={styles.productDetail}>Total: {produto.total}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView> :
            <Text style={styles.noDataText}>Não encontramos vendas. Clique no botão para realizar uma nova pesquisa!</Text>
        )
      }
      {loading && <Text style={styles.noDataText}>Carregando...</Text>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  total: {
    fontSize: 16,
    marginBottom: 8,
  },
  product: {
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetail: {
    fontSize: 14,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  noDataText: {
    textAlign: 'center',
    margin: 20,
  },
});
