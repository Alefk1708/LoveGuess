import {
  View,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated, // Importado
} from "react-native";
import { useContext, useState, useEffect, useRef } from "react";
import OutlinedText from "../../components/OutlinedText";
import { ThemeContext } from "../../context/ThemeContext";

// --- Componente de Botão Animado (Com suporte a Disabled) ---
const AnimButton = ({ children, onPress, delay = 0, style, disabled, ...props }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  // Animação de Entrada
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: disabled ? 0.6 : 1, // Se nascer desabilitado, usa 0.6
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

  // Monitora se habilitou/desabilitou para mudar a opacidade visualmente
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: disabled ? 0.6 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
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
        disabled={disabled}
        style={style}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- Header Animado ---
const AnimHeader = ({ children, delay = 0 }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-30)).current;

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

// --- Input Animado (Efeito Pop) ---
const AnimInput = ({ children, delay = 0 }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      {children}
    </Animated.View>
  );
};

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
        {/* Header Animado (Delay 0) */}
        <View className="w-full h-[12vh] justify-center items-center">
          <AnimHeader delay={0}>
            <OutlinedText size={22}>Entrar na Sala</OutlinedText>
          </AnimHeader>
        </View>

        {/* Corpo */}
        <View className="w-full h-[45vh] justify-center items-center gap-[2vh]">
          
          {/* Texto de instrução (Delay 100) */}
          <AnimHeader delay={100}>
             <OutlinedText size={16}>Digite o código da sala</OutlinedText>
          </AnimHeader>

          {/* Campo código Animado (Delay 200) */}
          <AnimInput delay={200}>
            <View className="w-[60vw] h-[6vh] bg-white rounded-[3vw] border-[0.5vw] border-[#5A1719] justify-center px-[4vw]">
              <TextInput
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                placeholder="Ex: A8F3K2"
                placeholderTextColor="#999"
                maxLength={6}
                autoCapitalize="characters"
                className="text-center text-[18px]"
              />
            </View>
          </AnimInput>

          {/* Botão entrar Animado (Delay 300) */}
          <AnimButton
            delay={300}
            disabled={code.length !== 6}
            onPress={handleJoin}
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorderOuter,
              marginTop: 20, // margin-top-[2vh]
            }}
            className="w-[45vw] h-[6vh] rounded-[6vw] border-[0.4vw]"
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
          </AnimButton>
        </View>

        <View />
      </View>
    </ImageBackground>
  );
}