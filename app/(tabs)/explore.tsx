import { StyleSheet, Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabTwoScreen() {
  const key = '@Venda';
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sell, setSell] = useState(false);

  const adicionarVenda = async () => {
    if (nome && quantidade && data) {
      let vendas = await AsyncStorage.getItem(key);
      let allvendas = vendas ? JSON.parse(vendas) : []
      allvendas.push({ nome: nome.toUpperCase(), quantidade, data })
      setNome('');
      setQuantidade('');
      setData(new Date());
      salvar(allvendas);
      setSell(true)
      setTimeout(() => { setSell(false) }, 2000);
    }
  };

  const salvar = async (venda: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(venda));
  };

  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem(key);
      console.log(data ? JSON.parse(data) : 'SEM DADOS')
    })();

  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/registrarvenda.png')}
          style={styles.reactLogo}
        />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Nova Venda</ThemedText>
      </ThemedView>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={text => setNome(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={text => setQuantidade(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Data"
            value={data.toLocaleDateString()}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setData(selectedDate);
              }
            }}
          />
        )}
        <TouchableOpacity style={[styles.button, { ...(sell ? styles.buttColorsaved : styles.buttColorOK) }]} onPress={adicionarVenda}>
          <Text style={styles.buttonText}> {sell ? 'Venda salva' : 'Salvar'}</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  buttColorOK: {
    backgroundColor: '#17B2C4',
  },
  buttColorsaved: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
