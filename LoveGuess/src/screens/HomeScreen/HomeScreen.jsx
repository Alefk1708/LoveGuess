import {
  Image,
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  BackHandler,
  Animated,
  ActivityIndicator, // (Opcional) Se quiser um spinner
} from "react-native";
import { useContext, useEffect, useRef, useState } from "react"; // <--- 1. Adicione useState
import { ThemeContext } from "../../context/ThemeContext";
import OutlinedText from "../../components/OutlinedText";
import api from "../../services/api";

// --- Componente de Botão Animado (Atualizado com suporte a DISABLED) ---
const AnimButton = ({ 
  children, 
  onPress, 
  delay = 0, 
  style, 
  disabled, // <--- Recebe disabled
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
          toValue: disabled ? 0.6 : 1, // Se nascer desabilitado, nasce meio transparente
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

  // Monitora mudanças no disabled para mudar a opacidade em tempo real
  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: disabled ? 0.6 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [disabled]);

  const handlePressIn = () => {
    if (disabled) return; // Não anima se desabilitado
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
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
        disabled={disabled} // <--- Passa o disabled para o touchable
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

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false); // <--- 2. Estado de carregamento

  const createRoom = async () => {
    if (isLoading) return; // Evita cliques duplos se já estiver carregando

    setIsLoading(true); // Ativa o loading

    try {
      const response = await api.post("/room");
      
      navigation.navigate("Room", {
        roomCode: response.data.roomCode,
      });
      // Importante: Tiramos o loading no finally ou após navegar
      setIsLoading(false); 
    } catch (error) {
      setIsLoading(false); // Desativa loading se der erro
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
        
        {/* Botão Nova Partida (Com Loading) */}
        <AnimButton
          delay={100}
          onPress={() => createRoom()}
          disabled={isLoading} // <--- Desabilita o botão visualmente e funcionalmente
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
            {/* Lógica do Texto: Se isLoading, mostra "Criando...", senão "Nova Partida" */}
            {isLoading ? (
              <OutlinedText
                size={16}
                color={theme.buttonText}
                strokeColor={theme.buttonTextStroke}
              >
                Criando...
              </OutlinedText>
            ) : (
              <>
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
              </>
            )}
          </View>
        </AnimButton>

        {/* Botão Entrar */}
        <AnimButton
          delay={200}
          disabled={isLoading} // Opcional: Bloqueia os outros botões enquanto carrega
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

        {/* Botão Configurações */}
        <AnimButton
          delay={300}
          disabled={isLoading}
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

        {/* Botão Sair */}
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