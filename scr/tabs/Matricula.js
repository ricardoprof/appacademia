import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Picker, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from 'axios';
import createAxiosInstance from "../../api";

import AsyncStorage from "@react-native-async-storage/async-storage"; //para o token

import { useNavigation, useRoute } from '@react-navigation/native';

export default function Matricula() {
  const route = useRoute();

  const { idAluno, idMatricula } = route.params || {};
  const navigation = useNavigation();

  const [aulas, setAulas] = useState([]);
  const [selectedAula, setSelectedAula] = useState('');
  const [selectedCodAula, setSelectedCodAula] = useState('');
  const [selectedHora, setSelectedHora] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {      
      console.log('Matricula ', idMatricula)
      console.log('Aluno ', idAluno)
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
      const response = await fetch('https://vivabemtipi01.smpsistema.com.br/api/aulas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setAulas(data);

      if (data.length > 0) {
        setSelectedAula(data[0].nomeAula);
        setSelectedCodAula(data[0].idAula);
        setSelectedHora(data[0].horarioAula);
      }
    } catch (error) {
      console.error('Erro ao buscar as aulas:', error);
    }
  };

  const onDateChange = (day) => {
    setSelectedDate(day.dateString);
  };

  const onClassChange = (itemValue) => {
    setSelectedAula(itemValue);
    const selectedAula = aulas.find(aula => aula.nomeAula === itemValue);
    if (selectedAula) {
      setSelectedCodAula(selectedAula.idAula);
      setSelectedHora(selectedAula.horarioAula);
    }
  };

  const confirmarMatricula = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
      console.log('Token OK ', token);

      // Cria a instância do Axios
      const axiosInstance = await createAxiosInstance();
      const dadosMatricula = {
        idAluno: idAluno,
        idAula: selectedCodAula,
        dataAula: selectedDate,
      };
      console.log("Dados enviados: ", dadosMatricula);
     
      let respostaMatricula;
      if (idMatricula) {
        // Se idMatricula estiver presente, faça o update
        respostaMatricula = await axiosInstance.put(`/aluno/matricular-aula/${idMatricula}`, dadosMatricula, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Se idMatricula não estiver presente, faça a matrícula
        respostaMatricula = await axiosInstance.post(`/aluno/matricular-aula`, dadosMatricula, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });        
      }
      console.log('Resposta Aluno:', respostaMatricula);
      Alert.alert('Sucesso', `Matriculado na aula de ${selectedAula} no dia ${selectedDate} às ${selectedHora}!`);
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao matricular:', error);
      Alert.alert('Erro', 'Não foi possível realizar a matrícula.');
    }   
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Text style={styles.title}>MATRICULAR</Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Aula:</Text>
          <Picker
            selectedValue={selectedAula}
            style={styles.picker}
            onValueChange={onClassChange}
          >
            {aulas.map(aula => (
              <Picker.Item key={aula.nomeAula} label={aula.nomeAula} value={aula.nomeAula} />
            ))}
          </Picker>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.label}>Horário:</Text>
          <Picker
            selectedValue={selectedHora}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedHora(itemValue)}
          >
            {aulas
              .filter(aula => aula.nomeAula === selectedAula)
              .map(aula => (
                <Picker.Item key={aula.horarioAula} label={aula.horarioAula} value={aula.horarioAula} />
              ))}
          </Picker>
        </View>

        <Calendar
          style={styles.calendar}
          current={selectedDate}
          onDayPress={onDateChange}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' }
          }}
        />

        <TouchableOpacity style={styles.confirmButton} onPress={confirmarMatricula}>
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  picker: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  calendar: {
    marginVertical: 20,
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#191970',
    width: '60%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 85,
    borderRadius: 5,
    marginVertical: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,

  },
});