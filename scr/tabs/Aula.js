import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';


const Aula = ({ image, title, description, onPress }) => (
  <View style={styles.aulaContainer}>
    <Image source={{ uri: image }} style={styles.image} />
    <View style={styles.overlay}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>COMEÇAR</Text>
      </TouchableOpacity>
    </View>
  </View>
);


export default function AulasScreen() {
  const route = useRoute();

  const { idAluno } = route.params || {};

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await axios.get('https://vivabemtipi01.smpsistema.com.br/api/aulas');
        setAulas(response.data);
      } catch (error) {
        console.error("Erro ao buscar as aulas:", error);
        Alert.alert('Erro', 'Não foi possível carregar as aulas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAulas();
    console.log(idAluno);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.pageTitle}>Aulas</Text>
        {aulas.map((aula, index) => (
          <Aula
            key={index}
            image={`https://vivabemtipi01.smpsistema.com.br/dash/images/${aula.fotoAula}`}
            title={aula.nomeAula}
            description={aula.descricaoAula}
            onPress={() => navigation.navigate('Matricula', { idAluno })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  backIcon: {
    margin: 16
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10
  },
  aulaContainer: {
    marginBottom: 20,
    position: 'relative',
    marginHorizontal: 16
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginTop: 10
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4ACFAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
