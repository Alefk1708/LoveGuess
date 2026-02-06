import {
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import OutlinedText from "../../components/OutlinedText";

export default function RoomScreen({ navigation }) {
  const copyCode = () => {
    Alert.alert("Código copiado!", `O código da sala foi copiado para sua área de transferência.`);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/background.png")}
      className="flex-1 justify-between items-center bg-white pt-[7vh] pb-[6vh]"
    >
      {/* Header */}
      <View className="w-full h-[12vh] justify-center items-center">
        <OutlinedText size={22}>
          Sala: A8F3K2
        </OutlinedText>

        <TouchableOpacity
          onPress={copyCode}
          className="mt-[1vh] px-[5vw] py-[1vh] rounded-full bg-[#F8A288] border-[0.4vw] border-[#5A1719]"
        >
          <OutlinedText size={14}>
            Copiar Código
          </OutlinedText>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View className="w-full h-[45vh] justify-center items-center">
        <OutlinedText size={20}>
          Aguardando jogador...
        </OutlinedText>

        <OutlinedText size={40} >
          ⏳
        </OutlinedText>
      </View>

      {/* Botão começar */}
      <View className="w-full items-center">
        <TouchableOpacity
          onPress={() => navigation.navigate("Game")}
          className="w-[60vw] h-[6vh] rounded-[6vw] border-[0.4vw] border-white bg-[#d9b2a6] opacity-60"
        >
          <View className="w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
            <OutlinedText size={18}>
              Começar Partida
            </OutlinedText>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
