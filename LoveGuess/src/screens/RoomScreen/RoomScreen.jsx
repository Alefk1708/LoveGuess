import {
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Animated, // Importado
  Easing,   // Importado
} from "react-native";
import OutlinedText from "../../components/OutlinedText";
import { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import socket from "../../services/socket";

// --- 1. Botão Animado (Igual da Home) ---
const AnimButton = ({ 
  children, 
  onPress, 
  delay = 0, 
  style, 
  disabled, // Recebe disabled para tratar opacidade
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: disabled ? 0.6 : 1, // Se desabilitado, nasce transparente
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

  // Atualiza opacidade se o status disabled mudar
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

// --- 2. Componente de Status (Ampulheta Girando / Check Pulando) ---
const AnimatedStatus = ({ isReady }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current; // Começa pequeno (pop effect)

  useEffect(() => {
    if (!isReady) {
      // Configuração da Ampulheta: Loop Infinito de Rotação
      scaleAnim.setValue(1); // Tamanho normal
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000, // 2 segundos por volta
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Configuração do Check: Para rotação e faz efeito "Pop"
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0); // Reseta rotação
      
      scaleAnim.setValue(0); // Reseta tamanho para explodir
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100, // Bastante tensão para "pular"
        useNativeDriver: true,
      }).start();
    }
  }, [isReady]);

  // Interpolação para transformar 0->1 em 0deg->360deg
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', height: 100 }}>
      {!isReady ? (
        // Ampulheta Girando
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <OutlinedText size={60}>⏳</OutlinedText>
        </Animated.View>
      ) : (
        // Check Pulando
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <OutlinedText size={60}>✅</OutlinedText>
        </Animated.View>
      )}
    </View>
  );
};

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
    
    // Cleanup do socket: removido o disconnect() aqui como combinado antes
    // para não quebrar a navegação para o jogo
    return () => {
       socket.onmessage = null;
    }

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
      <View className="w-full h-[15vh] justify-center items-center">
        <OutlinedText size={22}>Sala: {roomCode}</OutlinedText>

        {/* Botão Copiar Animado */}
        <AnimButton
          delay={100}
          onPress={copyCode}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
            marginTop: 10,
            borderRadius: 999,
            borderWidth: 3 // ~0.4vw
          }}
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
              borderWidth: 3,
              borderRadius: 999,
              paddingHorizontal: 20,
              paddingVertical: 8
            }}
            className="justify-center items-center"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
              size={14}
            >
              Copiar Código
            </OutlinedText>
          </View>
        </AnimButton>
      </View>

      {/* Status Animado */}
      <View className="w-full h-[40vh] justify-center items-center gap-5">
        <OutlinedText size={20}>
          {isReady ? "Jogador conectado!" : "Aguardando jogador..."}
        </OutlinedText>

        {/* Aqui entra nosso novo componente */}
        <AnimatedStatus isReady={isReady} />
      </View>

      {/* Botão Começar Animado */}
      <View className="w-full items-center">
        <AnimButton
          delay={300}
          disabled={!isReady}
          onPress={startGame}
          style={{
            backgroundColor: theme.buttonBg,
            borderColor: theme.buttonBorderOuter,
            borderWidth: 3, // ~0.4vw
            borderRadius: 30, // ~6vw
            width: "60%", // 60vw
            height: 50,   // ~6vh
          }}
        >
          <View
            style={{
              borderColor: theme.buttonBorderInner,
              borderWidth: 3, // ~0.4vw
              borderRadius: 30,
              width: "100%",
              height: "100%"
            }}
            className="justify-center items-center"
          >
            <OutlinedText
              color={theme.buttonText}
              strokeColor={theme.buttonTextStroke}
              size={18}
            >
              Começar Partida
            </OutlinedText>
          </View>
        </AnimButton>
      </View>
    </ImageBackground>
  );
}