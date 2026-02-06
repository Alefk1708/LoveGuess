import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import OutlinedText from "../../components/OutlinedText";

const mockCharacters = Array.from({ length: 24 }).map((_, i) => ({
  id: i.toString(),
  name: `Personagem ${i + 1}`,
  image: require("../../../assets/character-placeholder.png"),
  eliminated: false,
}));

export default function GameScreen({ navigation }) {
  const [characters, setCharacters] = useState(mockCharacters);

  function toggleCard(id) {
    setCharacters(prev =>
      prev.map(c =>
        c.id === id ? { ...c, eliminated: !c.eliminated } : c
      )
    );
  }

  function resetBoard() {
    setCharacters(prev =>
      prev.map(c => ({ ...c, eliminated: false }))
    );
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => toggleCard(item.id)}
        className="flex-1 m-[0.6vw]"
      >
        <View className="relative rounded-lg overflow-hidden border border-[#5A1719] bg-white">

          <Image
            source={item.image}
            className="w-full h-[9vh]"
            resizeMode="contain"
          />

          {item.eliminated && (
            <View className="absolute w-full h-full bg-black opacity-60" />
          )}

          <View className="items-center py-[0.3vh]">
            <OutlinedText size={9}>
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
      source={require("../../../assets/background.png")}
      className="flex-1"
    >
      <View className="flex-1 pt-[5vh] pb-[3vh]">

        {/* Personagem secreto */}
        <View className="items-center mb-[1vh]">
          <OutlinedText size={16}>
            Seu personagem
          </OutlinedText>

          <View className="flex-row items-center gap-[3vw] mt-[0.5vh]">
            <Image
              source={require("../../../assets/character-placeholder.png")}
              className="w-[12vw] h-[12vw]"
              resizeMode="contain"
            />
            <OutlinedText size={14}>
              Hello Kitty
            </OutlinedText>
          </View>
        </View>

        {/* Grade */}
        <View className="flex-1 px-[1vw]">
          <FlatList
            data={characters}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={6}
            scrollEnabled={false}
          />
        </View>

        {/* Botões */}
        <View className="flex-row justify-center gap-[5vw] mt-[1vh]">
          <TouchableOpacity
            onPress={resetBoard}
            className="w-[40vw] h-[5.5vh] rounded-[6vw] border-[0.4vw] border-white bg-[#F8A288]"
          >
            <View className="w-full h-full justify-center items-center rounded-[6vw] border-[0.4vw] border-[#5A1719]">
              <OutlinedText size={16}>
                Reiniciar
              </OutlinedText>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    </ImageBackground>
  );
}
