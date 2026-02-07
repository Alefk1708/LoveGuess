import {
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import OutlinedText from "../../components/OutlinedText";
import api from "../../services/api";

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);

  const createRoom = async () => {
    try {
      const response = await api.post("/room");

      navigation.navigate("Room", {
        roomCode: response.data.roomCode,
      });
    } catch {
      Alert.alert("Erro ao criar sala", "Tente novamente mais tarde.");
    }
  };

  const exitApp = () => {
    Alert.alert("Sair do App", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => BackHandler.exitApp() },
    ]);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/background.png")}
      className=" flex-1 justify-between items-center bg-white pt-[7vh] pb-[6vh]"
    >
      {/* Header */}
      <View className=" w-full h-[16vh] justify-center items-center">
        <Image
          source={require("../../../assets/Titulo.png")}
          resizeMode="cover"
          className=" w-[80vw] h-[16vw]"
        />
      </View>

      {/* Body */}
      <View className="w-full h-[55vh] justify-center items-center gap-[1.5vh]">
        <TouchableOpacity
          onPress={() => createRoom()}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
          }}
          className={` relative w-[30vw] h-[30vw] rounded-full border-[0.7vw] `}
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
            }}
            className="w-full h-full justify-center rounded-full items-center border-[0.7vw]"
          >
            <OutlinedText
              size={19}
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
            >
              Nova
            </OutlinedText>
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
              size={19}
            >
              Partida
            </OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
          }}
          onPress={() => navigation.navigate("JoinRoom")}
          className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
            }}
            className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw]"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
            >
              Entrar
            </OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
          }}
          onPress={() => navigation.navigate("Settings")}
          className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
            }}
            className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw]"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
            >
              Configurações
            </OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => exitApp()}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
          }}
          className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
            }}
            className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw]"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
            >
              Sair
            </OutlinedText>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
