import {
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from "react-native";
import OutlinedText from "../../components/OutlinedText";

export default function JoinRoomScreen({ navigation }) {
  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/background.png")}
      className="flex-1 justify-between items-center bg-white"
    >
    <View className="w-full h-full justify-between items-center bg-[#130f0e59] pt-[7vh] pb-[6vh]">
        {/* Header */}
      <View className="w-full h-[12vh] justify-center items-center">

        <OutlinedText size={22}>
          Entrar na Sala
        </OutlinedText>
      </View>

      {/* Corpo */}
      <View className="w-full h-[45vh] justify-center items-center gap-[2vh]">

        <OutlinedText size={16}>
          Digite o código da sala
        </OutlinedText>

        {/* Campo código */}
        <View className="w-[60vw] h-[6vh] bg-white rounded-[3vw] border-[0.5vw] border-[#5A1719] justify-center px-[4vw]">
          <TextInput
            placeholder="Ex: A8F3K2"
            placeholderTextColor="#999"
            maxLength={6}
            autoCapitalize="characters"
            className="text-center text-[18px]"
          />
        </View>

        {/* Botão entrar */}
        <TouchableOpacity className="mt-[2vh] w-[45vw] h-[6vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]">
          <View className="w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
            <OutlinedText size={18}>
              Entrar
            </OutlinedText>
          </View>
        </TouchableOpacity>

      </View>

      {/* Espaço inferior */}
      <View />
    </View>
      
    </ImageBackground>
  );
}
