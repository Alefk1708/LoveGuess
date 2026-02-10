import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated, // Importado
} from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
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

const FlipCard = ({ item, onPress, theme }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: item.eliminated ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [item.eliminated]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const cardStyle = {
    backgroundColor: theme.cardBg,
    borderColor: theme.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    height: "100%", 
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  };

  return (
    <TouchableOpacity onPress={onPress} className="flex-1 m-[0.5vw] h-[11vh]">
      <View className="flex-1 relative">
        {/* Lado da FRENTE (Personagem Ativo) */}
        <Animated.View
          style={[
            cardStyle,
            { position: "absolute", zIndex: 1, transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
          <Image source={item.image} className="w-full h-[7vh]" resizeMode="contain" />
          <View className="items-center py-[0.3vh]">
            <OutlinedText size={11}>{item.name}</OutlinedText>
          </View>
        </Animated.View>

        {/* Lado de tras (Eliminado / Verso da Carta) */}
        <Animated.View
          style={[
            cardStyle,
            { 
              backgroundColor: "#333", 
              position: "absolute", 
              zIndex: 0, 
              transform: [{ rotateY: backInterpolate }] 
            },
          ]}
        >
          {/* Aqui você poderia colocar uma imagem de "verso de baralho" */}
          {/* Como não temos, usamos a imagem escurecida como efeito */}
          <Image 
            source={item.image} 
            className="w-full h-[7vh] opacity-30" 
            resizeMode="contain" 
            style={{ tintColor: 'gray' }} 
          />
           <View className="absolute">
             <OutlinedText size={30} color="#FF0000">❌</OutlinedText>
           </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default function GameScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { character, roomCode } = route.params;

  const [characters, setCharacters] = useState(mockCharacters);
  const [myCharacter, setMyCharacter] = useState(character);

  function toggleCard(id) {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, eliminated: !c.eliminated } : c))
    );
  }

  function resetBoardLocal() {
    setCharacters((prev) => prev.map((c) => ({ ...c, eliminated: false })));
  }

  function restartGame() {
    socket.send("restart_game");
  }

  useEffect(() => {
    const onRestarted = (data) => {
      setMyCharacter(data.character);
      resetBoardLocal();
    };

    const onGameOver = (data) => {
      Alert.alert(
        "Fim de Jogo!",
        data.message || "Todos os personagens já foram usados.",
        [{ text: "Voltar ao Início", onPress: () => navigation.popToTop() }],
        { cancelable: false }
      );
    };

    socket.on("game_restarted", onRestarted);
    socket.on("game_over", onGameOver);

    return () => {
      socket.onmessage = null;
      socket.disconnect();
    };
  }, []);

  const myCardData = mockCharacters.find((c) => c.name === myCharacter);

  // RenderItem agora usa o componente separado FlipCard
  function renderItem({ item }) {
    return (
      <FlipCard 
        item={item} 
        onPress={() => toggleCard(item.id)} 
        theme={theme} 
      />
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
          <OutlinedText size={25}>Seu personagem</OutlinedText>

          {myCardData && (
            <View className="flex-row items-center gap-[3vw] mt-[0.5vh]">
              <Image
                source={myCardData.image}
                className="w-[16vw] h-[16vw]"
                resizeMode="contain"
              />
              <OutlinedText size={19}>{myCardData.name}</OutlinedText>
            </View>
          )}
        </View>

        {/* Grade */}
        <View className="flex-1 px-[1vw]">
          <FlatList
            data={characters}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            scrollEnabled={true} 
            showsVerticalScrollIndicator={false}
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