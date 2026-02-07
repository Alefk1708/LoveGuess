import { View, ImageBackground, TouchableOpacity, Alert } from "react-native";
import OutlinedText from "../../components/OutlinedText";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import socket from "../../services/socket";

export default function RoomScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);

  const { roomCode } = route.params;

  const [players, setPlayers] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const copyCode = () => {
    Alert.alert("Código copiado!", "Compartilhe com o outro jogador.");
  };

  useEffect(() => {
    socket.connect(roomCode);

    socket.on("player_joined", (data) => {
      console.log("evento recebido:", data);
      setPlayers(data.players);

      if (data.players === 2) {
        setIsReady(true);
      }
    });

    socket.on("game_started", (data) => {
      navigation.replace("Game", {
        character: data.character,
        roomCode,
      });
    });

    socket.on("player_left", () => {
      setPlayers(1);
      setIsReady(false);
    });

    return () => {
      socket.onmessage = null;
      socket.disconnect();
    };
  }, []);

  const startGame = () => {
    socket.send("start_game");
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/backgroundRoom.png")}
      className="flex-1 justify-between items-center bg-white pt-[7vh] pb-[6vh]"
    >
      {/* Header */}
      <View className="w-full h-[12vh] justify-center items-center">
        <OutlinedText size={22}>Sala: {roomCode}</OutlinedText>

        <TouchableOpacity
          onPress={copyCode}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
          }}
          className="justify-center items-center mt-[1vh] rounded-full border-[0.4vw]"
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
            }}
            className="px-[5vw] py-[1vh] rounded-full border-[0.4vw] justify-center items-center"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
              size={14}
            >
              Copiar Código
            </OutlinedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Status */}
      <View className="w-full h-[45vh] justify-center items-center">
        <OutlinedText size={20}>
          {isReady ? "Jogador conectado!" : "Aguardando jogador..."}
        </OutlinedText>

        <OutlinedText size={40}>{isReady ? "✅" : "⏳"}</OutlinedText>
      </View>

      {/* Botão começar */}
      <View className="w-full items-center">
        <TouchableOpacity
          disabled={!isReady}
          onPress={startGame}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
            opacity: isReady ? 1 : 0.6,
          }}
          className="w-[60vw] h-[6vh] rounded-[6vw] border-[0.4vw]"
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
              Começar Partida
            </OutlinedText>
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
