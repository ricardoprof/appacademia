import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage"; // para o token
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Importando o Ionicons


export default function MinhasAulasScreen() {
  const route = useRoute();  
  const { idAluno } = route.params || {};
  const navigation = useNavigation();

  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');  
      if (!token) {
        console.error("Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }   
      console.log(idAluno);   
      console.log(token);      
      const response = await axios.get(`https://vivabemtipi01.smpsistema.com.br/api/aluno/${idAluno}/aulas-matriculadas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAulas(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar as aulas matriculadas: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const groupByDate = (aulas) => {
    return aulas.reduce((groups, aula) => {
      const date = formatDate(aula.dataAula);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(aula);
      return groups;
    }, {});
  };

  const groupedAulas = groupByDate(aulas);

  const handleEditAula = (aula) => {
    navigation.navigate('Matricula', { idMatricula: aula.idMatricula, aula });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.pageTitle}>Minhas Aulas</Text>
        {Object.keys(groupedAulas).length === 0 ? (
          <Text style={styles.noClassesText}>Nenhuma aula matriculada encontrada.</Text>
        ) : (
          Object.keys(groupedAulas).map((date, index) => (
            <View key={index}>
              <Text style={styles.dateTitle}>{date}</Text>
              {groupedAulas[date].map((aula, idx) => (
                <View key={idx} style={styles.classItem}>
                  <Text style={styles.classDetail}>{aula.horarioAula}</Text>
                  <Text style={styles.classTitle}>{aula.nomeAula}</Text>
                  <TouchableOpacity onPress={() => handleEditAula(aula)} style={styles.iconButton}>
                    <Ionicons name="create-outline" size={24} color="#48C9B0" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10
  },
  noClassesText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 20
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 16
  },
  classItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',    
    color: '#48C9B0',
    marginLeft: 50
  },
  classDetail: {
    fontSize: 16,    
    color: '#48C9B0',
    marginRight: 10
  },
  iconButton: {
    marginRight: 10 // Espaçamento entre o ícone e a aula
  }
});
