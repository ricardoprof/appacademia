import React, { useEffect, useState } from "react";

import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from "react-native";
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from "react-native-reanimated";
import axios from 'axios';

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation, route }) {

  const { idAluno } = route.params || {};
  // Verifique se idAluno está definido corretamente
  console.log("Cod Aluno:", idAluno);
  console.log(route.params);
  // Return da Function

  const [nomeAluno, setNomeAluno] = useState("");
  const [tipoPlano, setTipoPlano] = useState("");

  useEffect(() => {    
      const fetchAlunoData = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`https://smpsistema.com.br/vivabemtipi01/api/aluno/${idAluno}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNomeAluno(response.data.nome);
        setTipoPlano(response.data.tipo_plano);
      } catch (error) {
          console.error("Erro ao buscar dados do aluno:", error);
        }
      };     

  if (idAluno) {
      fetchAlunoData();
    }
  }, [idAluno]);
  

  return (
    <SafeAreaView style={styles.homeContainer}>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.headerContainer}>
          <Text style={styles.greetingText}>Olá, {nomeAluno}</Text>
          <Text style={styles.planText}>Plano {tipoPlano}</Text>
        </View>

        <View>
          {/* Adicione a imagem aqui, se necessário */}
        </View>

        <View style={styles.sessionInfoContainer}>
          <Text style={styles.sessionInfoText}>Você está na sua Contagem</Text>
          <Text style={styles.sessionInfoText}>Sessão de Treino</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.accessClassButton}
            onPress={() => navigation.navigate('MinhasAulas', { idAluno })}
          >
            <Text style={styles.buttonText}>Acessar aula</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accessTrainingButton}
            onPress={() => navigation.navigate('Treino')}
          >
            <Text style={styles.buttonText}>Acessar treino</Text>
          </TouchableOpacity>
        </View>



        <Image
          style={styles.workoutImage}
          source={require('../../assets/gymm.png')}
          resizeMode="contain"
        />



        <View style={styles.upgradeButtonContainer}>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Esqueci Senha')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade do Plano</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView >
  );

};

//Estilização dos itens
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  greetingText: {
    fontSize: 18,
    color: '#34495E',
    borderBottomWidth: 2,
    borderBottomColor: '#48C9B0',
    fontWeight: 'bold',
  },
  planText: {
    fontSize: 22,
    color: '#34495E',
  },
  sessionInfoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 70,
    marginBottom: 40,
  },
  sessionInfoText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  accessClassButton: {
    width: '40%',
    height: 40,
    backgroundColor: '#34495E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 5,
  },
  accessTrainingButton: {
    width: '40%',
    height: 40,
    backgroundColor: '#48C9B0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  workoutImage: {
    width: 300,
    height: 250,
  },
  upgradeButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  upgradeButton: {
    width: '40%',
    height: 40,
    backgroundColor: '#f8da45',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },

  slide: {
    flexDirection: 'row',
    gap: 42,
    marginRight: 32,
  },
  containerSlide: {
    width: '100%',
    flexDirection: 'row'
  }
});
