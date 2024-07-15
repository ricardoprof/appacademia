import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//instanciar o axios com o token de autenticação
const createAxiosInstance = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return axios.create({
        baseURL: 'https://vivabemtipi01.smpsistema.com.br/api',
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
};
export default createAxiosInstance;