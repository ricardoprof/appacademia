import * as React from "react";
import { useState } from "react"; //reconhece os comando de start Inicial

import Modal from "react-native-modal";
import axios from "axios"; //Faz a requisição HTTP para a API
import AsyncStorage from "@react-native-async-storage/async-storage";//para reconhecimento do token

//importação dos atributos
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";

//importação dos tipos de navegação
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

//Importação da biblioteca de ícones
import { Ionicons, Entypo } from "@expo/vector-icons";

//importação das telas
import Aula from "./scr/tabs/Aula";
import Treino from "./scr/tabs/Treino";
import MinhasAulas from "./scr/tabs/MinhasAulas";
import Perfil from "./scr/tabs/Perfil";
import Home from "./scr/tabs/Home";
import Matricula from "./scr/tabs/Matricula";
import Video from "./scr/tabs/videos";




//mode dark e light

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Defina suas tabs como stacks para permitir navegações internas
function HomeStack({route}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} initialParams={{idAluno: route.params.idAluno}}/>
      <Stack.Screen name="Matricula" component={Matricula} initialParams={{idAluno: route.params.idAluno}}/>
      <Stack.Screen name="MinhasAulas" component={MinhasAulas} initialParams={{idAluno: route.params.idAluno}}/>
    </Stack.Navigator>
  );
}

function AulaStack({route}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Aula" component={Aula} initialParams={{idAluno: route.params.idAluno}}/>
    </Stack.Navigator>
  );
}

function TreinoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Treino" component={Treino} />
    </Stack.Navigator>
  );
}

function PerfilStack({route}) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={Perfil} initialParams={{idAluno: route.params.idAluno}}/>
    </Stack.Navigator>
  );
}

function VideoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Vídeos" component={Video} />
    </Stack.Navigator>
  );
}

// Função para criar as tabs usando as stacks definidas acima
function MyTabs({route}) {
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        initialParams={{idAluno: route.params.idAluno}}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color="#34495e" />
          ),
          tabBarLabel: "Home",
        }}
      />

      <Tab.Screen
        name="Vídeos"
        component={VideoStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="video" color="#34495e" size={26} />
          ),
        }}
      />


      <Tab.Screen
        name="Aula"
        component={AulaStack}
        initialParams={{idAluno: route.params.idAluno}}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" color="#34495e" size={26} />
          ),
          tabBarLabel: "Aulas",
        }}
      />
      <Tab.Screen
        name="Treino"
        component={TreinoStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="barbell-sharp" size={24} color="#34495e" />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        initialParams={{idAluno: route.params.idAluno}}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="user" color="#34495e" size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Funções de tela de login e redefinição de senha
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  
  const [isFocused, setIsFocused] = React.useState(false);
  
  const handleLogin = async () => {
    //verificar se o email ou a senha estão preenchidos
    if (!email.trim() || !senha.trim()){
      setErrorModalVisible(true);
      return;
    }

    try{
      const resposta = await axios.post(`https://smpsistema.com.br/vivabemtipi01/api/login?email=${email}&senha=${senha}`);
      if (resposta.data){
        const aluno = resposta.data;
        if (aluno){
          console.log(aluno);
          console.log(aluno.usuario.dados_aluno.idAluno);
          console.log(aluno.usuario.dados_aluno.nome);
          console.log(aluno.access_token);

          const idAluno = aluno.usuario.dados_aluno.idAluno;
          const token = aluno.access_token;

          //Armazenar o token na memória do APP (AsyncStorage)
          await AsyncStorage.setItem('userToken', token);

          navigation.navigate('Main', { idAluno }); //Main
        }
      }
    } catch (error) {
      console.error("Erro ao verificar o email e a senha", error);
      setErrorModalVisible("Erro","Erro ao verificar email e senha");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>


      <Image style={styles.img} source={require("./assets/logo1.png")} />

      <Text style={styles.text}>LOGIN</Text>

      <TextInput
        style={[styles.input, isFocused && styles.focusedInput]}
        placeholder="Digite seu e-mail:"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <TextInput
        secureTextEntry={true}
        style={[styles.input, isFocused && styles.focusedInput]}
        placeholder="Digite sua senha:"
        value={senha}
        onChangeText={setSenha}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
      >
        <Text style={styles.btnText}>ENTRAR</Text>

      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Reset")}>

        <Text style={styles.resetSenha}>Esqueceu a senha?</Text>

      </TouchableOpacity>

      <Modal isVisible={errorModalVisible} onBackdropPress={() => setErrorModalVisible(false)}>
        <View style={styles.errorModalContainer}>
          <Text style={styles.errorModalTitle}>Erro</Text>
          <Text style={styles.errorModalMessage}>Email ou senha incorretos. Tente novamente.</Text>
          <TouchableOpacity onPress={() => setErrorModalVisible(false)}>
            <Text style={styles.errorModalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}





function ResetScreen({ navigation }) {
  return (
    <View style={styles.resetContainer}>


      <Image style={styles.img} source={require("./assets/logo1.png")} />

      <Text style={styles.instructionText}>Preencha seus Dados</Text>

      <TextInput style={styles.inputField} placeholder="Seu email" />

      <TextInput style={styles.inputField} placeholder="Sua Data Nasc" />

      <TextInput style={styles.inputField} placeholder="Seu Telefone" />

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>

      </View>


    </View>
  );
}






// Defina a navegação principal usando a stack que contém as tabs
export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Oculta o cabeçalho na tela de login
        />

        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: false }} // Oculta o cabeçalho na tela principal
        />

        <Stack.Screen name="Reset" component={ResetScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}






// estilização dos itens
const styles = StyleSheet.create({
  resetSenha: {
    color: "#48c9b0",
    margin: 10,
  },
  text: {
    fontSize: 40,
    margin: 30,
    fontWeight: "bold",
    color: "#34495e",
    letterSpacing: 2,
  },
  img: {
    width: 300,
    height: 100,
  },
  input: {
    borderBottomWidth: 3,
    borderBottomColor: "#48c9b0",
    width: "90%",
    marginTop: 10,
    marginBottom: 20,
    padding: 10,
  },
  btn: {
    backgroundColor: "#f1c40f",
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  btnText: {
    color: "#fff",
    backgroundColor: "#f1c40f",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  focusedInput: {
    borderBottomColor: "#f1c40f",
  },
  resetContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 135,
    height: 50,
    marginTop: 40,
  },
  instructionText: {
    fontSize: 25,
    color: "#23475F",
    marginTop: 15,
  },
  inputField: {
    width: "90%",
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: "#48C9B0",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  resetButton: {
    width: "40%",
    height: 40,
    backgroundColor: "#34495E",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  errorModalContainer:{
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorModalTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorModalMessage:{
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorModalButtonText:{
    fontSize: 18,
    color: '#3498db',
  },
});