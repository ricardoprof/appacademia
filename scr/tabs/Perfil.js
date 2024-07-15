import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import createAxiosInstance from "../../api";
import moment from 'moment'; // Importando moment para manipulação de datas


export default function Perfil({ navigation, route }) {

  const { idAluno } = route.params || {};
  // Return da Function

  const [nomeAluno, setNomeAluno] = useState("");
  const [dataNascAluno, setDataNascAluno] = useState("");
  const [foneAluno, setfoneAluno] = useState("");
  const [emailAluno, setEmailAluno] = useState("");
  //const [senhaAluno, setSenhaAluno] = useState("");
  const [fotoAluno, setFotoAluno] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const CarregarToken_Aluno = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
          return;
        }
        //Saber se a tela de perfil está carregando o Token de Acesso
        console.log('Token:', token);

        const axiosInstance = await createAxiosInstance();
        const resposta = await axiosInstance.get(`/aluno/${idAluno}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = resposta.data;
        setNomeAluno(data.nome); // Assumindo que o nome do aluno está em data.nome
        setDataNascAluno(data.data_nascimento); // Assumindo que a data_nascimento do aluno está em data.data_nascimento
        setfoneAluno(data.telefone); // Assumindo que o telefone do aluno está em data.telefone
        setEmailAluno(data.email); // Assumindo que o email do aluno está em data.email
        setFotoAluno(data.foto); // Assumindo que a foto do aluno está em data.foto
        //---------------------------
      } catch (error) {
        console.error("Erro ao buscar os dados do aluno:", error);
      }
    };
    if (idAluno) {
      CarregarToken_Aluno();
    }
  }, [idAluno]);

  /*Estrutura da Foto */
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  //constante para o UPLOAD DA IMAGEM
  const uploadImage = async (imageUri, fileName) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
      const formData = new FormData();
      formData.append('foto', {
        uri: imageUri,
        name: fileName,
        type: `image/png`,
      });
       
      const response = await fetch('https://vivabemtipi01.smpsistema.com.br/dash/images/aluno', {
        method: 'POST',  
        mode: 'no-cors',    
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();
      return responseJson;

    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  };

  const salvar = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('Erro', 'Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
      console.log('Token OK ', token);

      // Cria a instância do Axios
      const axiosInstance = await createAxiosInstance();

      //Para upload da imagem
      let fileName = fotoAluno;

      // Se houver uma imagem selecionada, realiza o upload primeiro
      if (selectedImage) {
        fileName = `${idAluno}_${moment().format('YYYYMMDD_HHmmss')}.png`;
        await uploadImage(selectedImage, fileName);

        // Criando um objeto com os dados do aluno
        const dadosAluno = {
          nome: nomeAluno,
          data_nascimento: dataNascAluno,
          telefone: foneAluno,
          foto: `aluno/${fileName}`,
          email: emailAluno,
        };
        console.log("Dados enviados: ", dadosAluno);

        const alunoResponse = await axiosInstance.patch(`/aluno/${idAluno}`, dadosAluno, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Resposta Aluno:', alunoResponse);
      } else {
        // Criando um objeto com os dados do aluno
        const dadosAluno = {
          nome: nomeAluno,
          data_nascimento: dataNascAluno,
          telefone: foneAluno,
          email: emailAluno,
        };
        console.log("Dados enviados: ", dadosAluno);

        const alunoResponse = await axiosInstance.patch(`/aluno/${idAluno}`, dadosAluno, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Resposta Aluno:', alunoResponse);
      };

      setFotoAluno(fileName);

      await new Promise(resolve => setTimeout(resolve, 500)); //tempo de carregamento 0.5 segundos

      console.log('Sucesso', 'Informações atualizadas com sucesso.');

      // Navegar de volta para a página Home com os dados atualizados
      navigation.navigate("Login");

    } catch (error) {
      console.error("Erro ao atualizar os dados do aluno:", error);
      console.log('Erro', 'Não foi possível atualizar as informações.');
    }
  };

  /*Fim Estrutura da Foto */

  const fotoUrl = selectedImage ? selectedImage : `https://vivabemtipi01.smpsistema.com.br/dash/images/${fotoAluno}`;
  console.log("Url: ", fotoUrl);
  console.log("Foto Aluno: ", fotoAluno);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Ícone para a foto de perfil */}
        <View style={styles.profileImageContainer}>
          {fotoAluno ? (
            <Image
              name="person-circle-outline"
              style={styles.profileImage}
              source={{ uri: fotoUrl }}
              resizeMode="cover"
              onError={(error) => console.error("Erro ao carregar a imagem:", error)}
            />
          ) : (
            <Text>Carregando imagem...</Text>
          )}
          <TouchableOpacity style={styles.editIconContainer} onPress={handlePickImage}>
            <Ionicons name="create-outline" size={24} color="#f1c40f" />
          </TouchableOpacity>
        </View>

        {/* Inputs para editar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nomeAluno}
            onChangeText={setNomeAluno}
            placeholder={nomeAluno}
            placeholderTextColor="#34495e"
          />
          <TextInput
            style={styles.input}
            value={dataNascAluno}
            onChangeText={setDataNascAluno}
            placeholder={dataNascAluno}
            placeholderTextColor="#34495e"
          />
          <TextInput
            style={styles.input}
            value={foneAluno}
            onChangeText={setfoneAluno}
            placeholder={foneAluno}
            placeholderTextColor="#34495e"
          />
          <TextInput
            style={styles.input}
            value={emailAluno}
            onChangeText={setEmailAluno}
            placeholder={emailAluno}
            placeholderTextColor="#34495e"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#34495e"
            secureTextEntry={true}
          />
        </View>

        {/* Botão de salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Fundo branco
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  profileIconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: -10,
  },
  profileImage: {
    position: "relative",
    width: 150,
    height: 150,
  },
  inputContainer: {
    width: "90%",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1c40f", // Cor da borda inferior dos inputs
    color: "black", // Cor do texto dos inputs
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#191970",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: '60%'
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
