import {
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import OutlinedText from "../../components/OutlinedText";

export default function HomeScreen({ navigation }) {
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
          onPress={() => navigation.navigate("Room")}
          className=" relative w-[30vw] h-[30vw] rounded-full border-[0.7vw] border-white bg-[#F8A288]"
        >
          <View className="w-full h-full justify-center rounded-full items-center border-[0.7vw] border-[#5A1719]">
            <OutlinedText size={19}>Nova</OutlinedText>
            <OutlinedText size={19}>Partida</OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("JoinRoom")}
          className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
        >
          <View className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
            <OutlinedText>Entrar</OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]">
          <View className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
            <OutlinedText>Configurações</OutlinedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => exitApp()}
          className="w-[45vw] h-[5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
        >
          <View className=" w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
            <OutlinedText>Sair</OutlinedText>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
