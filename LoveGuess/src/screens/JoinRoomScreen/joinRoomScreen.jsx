import {
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import OutlinedText from "../../components/OutlinedText";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function JoinRoomScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [code, setCode] = useState("");

  function handleJoin() {
    if (code.length !== 6) {
      Alert.alert("Código inválido", "Digite um código com 6 caracteres.");
      return;
    }

    navigation.navigate("Room", {
      roomCode: code.toUpperCase(),
    });
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/backgroundRoom.png")}
      className="flex-1 justify-between items-center bg-white"
    >
      <View className="w-full h-full justify-between items-center bg-[#130f0e59] pt-[7vh] pb-[6vh]">
        {/* Header */}
        <View className="w-full h-[12vh] justify-center items-center">
          <OutlinedText size={22}>Entrar na Sala</OutlinedText>
        </View>

        {/* Corpo */}
        <View className="w-full h-[45vh] justify-center items-center gap-[2vh]">
          <OutlinedText size={16}>
            Digite o código da sala
          </OutlinedText>

          {/* Campo código */}
          <View className="w-[60vw] h-[6vh] bg-white rounded-[3vw] border-[0.5vw] border-[#5A1719] justify-center px-[4vw]">
            <TextInput
              value={code}
              onChangeText={(text) =>
                setCode(text.toUpperCase())
              }
              placeholder="Ex: A8F3K2"
              placeholderTextColor="#999"
              maxLength={6}
              autoCapitalize="characters"
              className="text-center text-[18px]"
            />
          </View>

          {/* Botão entrar */}
          <TouchableOpacity
            disabled={code.length !== 6}
            onPress={handleJoin}
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorderOuter,
              opacity: code.length === 6 ? 1 : 0.6,
            }}
            className="mt-[2vh] w-[45vw] h-[6vh] rounded-[6vw] border-[0.4vw]"
          >
            <View
              style={{
                borderColor: theme.buttonBorderInner,
              }}
              className="w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw]"
            >
              <OutlinedText
                color={theme.buttonText}
                strokeColor={theme.buttonTextStroke}
                size={18}
              >
                Entrar
              </OutlinedText>
            </View>
          </TouchableOpacity>
        </View>

        <View />
      </View>
    </ImageBackground>
  );
}
