import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import OutlinedText from "../../components/OutlinedText";
import { ThemeContext } from "../../context/ThemeContext";
import socket from "../../services/socket";

export const mockCharacters = [
  { id: "1", name: "Hello Kitty", image: require("../../../assets/cards/1.png"), eliminated: false },
  { id: "2", name: "Mimmy", image: require("../../../assets/cards/2.png"), eliminated: false },
  { id: "3", name: "Dear Daniel", image: require("../../../assets/cards/3.png"), eliminated: false },
  { id: "4", name: "My Melody", image: require("../../../assets/cards/4.png"), eliminated: false },
  { id: "5", name: "Kuromi", image: require("../../../assets/cards/5.png"), eliminated: false },
  { id: "6", name: "Cinnamoroll", image: require("../../../assets/cards/6.png"), eliminated: false },
  { id: "7", name: "Pompompurin", image: require("../../../assets/cards/7.png"), eliminated: false },
  { id: "8", name: "Badtz-Maru", image: require("../../../assets/cards/8.png"), eliminated: false },
  { id: "9", name: "Keroppi", image: require("../../../assets/cards/9.png"), eliminated: false },
  { id: "10", name: "Chococat", image: require("../../../assets/cards/10.png"), eliminated: false },
  { id: "11", name: "Pochacco", image: require("../../../assets/cards/11.png"), eliminated: false },
  { id: "12", name: "Tuxedosam", image: require("../../../assets/cards/12.png"), eliminated: false },
  { id: "13", name: "Hangyodon", image: require("../../../assets/cards/13.png"), eliminated: false },
  { id: "14", name: "Gudetama", image: require("../../../assets/cards/14.png"), eliminated: false },
  { id: "15", name: "Aggretsuko", image: require("../../../assets/cards/15.png"), eliminated: false },
  { id: "16", name: "Kiki", image: require("../../../assets/cards/16.png"), eliminated: false },
  { id: "17", name: "Lala", image: require("../../../assets/cards/17.png"), eliminated: false },
  { id: "18", name: "Pekkle", image: require("../../../assets/cards/18.png"), eliminated: false },
  { id: "19", name: "Wish Me Mell", image: require("../../../assets/cards/19.png"), eliminated: false },
  { id: "20", name: "Bonbonribbon", image: require("../../../assets/cards/20.png"), eliminated: false },
];

export default function GameScreen({ route }) {
  const { theme } = useContext(ThemeContext);
  const { character, roomCode } = route.params;

  const [characters, setCharacters] = useState(mockCharacters);
  const [myCharacter, setMyCharacter] = useState(character);

  function toggleCard(id) {
    setCharacters(prev =>
      prev.map(c =>
        c.id === id ? { ...c, eliminated: !c.eliminated } : c
      )
    );
  }

  function resetBoardLocal() {
    setCharacters(prev =>
      prev.map(c => ({ ...c, eliminated: false }))
    );
  }

  function restartGame() {
    socket.send("restart_game");
  }

  useEffect(() => {
  const onRestarted = data => {
    setMyCharacter(data.character);
    resetBoardLocal();
  };

  socket.on("game_restarted", onRestarted);

  return () => {
    socket.onmessage = null;
    socket.disconnect();
  };
}, []);

  const myCardData = mockCharacters.find(
    c => c.name === myCharacter
  );

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => toggleCard(item.id)}
        className="flex-1 m-[0.5vw]"
      >
        <View
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.cardBorder,
          }}
          className="relative rounded-lg overflow-hidden border"
        >
          <Image
            source={item.image}
            className="w-full h-[8vh]"
            resizeMode="contain"
          />

          {item.eliminated && (
            <View className="absolute w-full h-full bg-black opacity-60" />
          )}

          <View className="items-center py-[0.3vh]">
            <OutlinedText size={13}>
              {item.name}
            </OutlinedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/backgroundGame.png")}
      className="flex-1"
    >
      <View className="flex-1 pt-[5vh] pb-[6vh]">
        {/* Personagem secreto */}
        <View className="items-center mb-[3vh]">
          <OutlinedText size={25}>
            Seu personagem
          </OutlinedText>

          {myCardData && (
            <View className="flex-row items-center gap-[3vw] mt-[0.5vh]">
              <Image
                source={myCardData.image}
                className="w-[16vw] h-[16vw]"
                resizeMode="contain"
              />
              <OutlinedText size={19}>
                {myCardData.name}
              </OutlinedText>
            </View>
          )}
        </View>

        {/* Grade */}
        <View className="flex-1 px-[1vw]">
          <FlatList
            data={characters}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={4}
            scrollEnabled={false}
          />
        </View>

        {/* Botão reiniciar */}
        <View className="flex-row justify-center gap-[5vw] mt-[1vh]">
          <TouchableOpacity
            onPress={restartGame}
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorderOuter,
            }}
            className="w-[40vw] h-[5.5vh] rounded-[6vw] border-[0.4vw]"
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
                size={16}
              >
                Nova rodada
              </OutlinedText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
