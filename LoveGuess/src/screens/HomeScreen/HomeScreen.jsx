import {
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
  Animated, // Importado
} from "react-native";
import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import OutlinedText from "../../components/OutlinedText";
import api from "../../services/api";

// --- Componente de Botão Animado ---
// Ele age exatamente como o TouchableOpacity, mas com superpoderes de animação
const AnimButton = ({ 
  children, 
  onPress, 
  delay = 0, 
  style, 
  ...props 
}) => {
  // Valores da animação
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current; // Desliza 30px

  useEffect(() => {
    // Animação de Entrada (Fade In + Slide Up)
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  // Efeito ao clicar (Diminuir)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  // Efeito ao soltar (Voltar ao normal)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: translateYAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style} // Aplica o estilo original do seu botão aqui dentro
        {...props}    // Repassa className e outros props
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Componente para animar o Header (Imagem) ---
const AnimHeader = ({ children, delay = 0 }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-30)).current; // Vem de cima

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }}>
      {children}
    </Animated.View>
  );
};

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
      {/* Header Animado */}
      <View className=" w-full h-[16vh] justify-center items-center">
        <AnimHeader delay={0}>
          <Image
            source={require("../../../assets/Titulo.png")}
            resizeMode="cover"
            className=" w-[80vw] h-[16vw]"
          />
        </AnimHeader>
      </View>

      {/* Body */}
      <View className="w-full h-[55vh] justify-center items-center gap-[1.5vh]">
        
        {/* Botão Nova Partida (Delay 100ms) */}
        <AnimButton
          delay={100}
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
        </AnimButton>

        {/* Botão Entrar (Delay 200ms) */}
        <AnimButton
          delay={200}
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
        </AnimButton>

        {/* Botão Configurações (Delay 300ms) */}
        <AnimButton
          delay={300}
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
        </AnimButton>

        {/* Botão Sair (Delay 400ms) */}
        <AnimButton
          delay={400}
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
        </AnimButton>

      </View>
    </ImageBackground>
  );
}