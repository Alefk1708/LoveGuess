import React, { useContext, useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated, // Importado
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

import OutlinedText from "../../components/OutlinedText";
import { ThemeContext } from "../../context/ThemeContext";

// --- CONFIGURAÇÃO DOS CAMPOS ---
const BUTTON_FIELDS = [
  { label: "Fundo do botão", key: "buttonBg" },
  { label: "Borda externa", key: "buttonBorderOuter" },
  { label: "Borda interna", key: "buttonBorderInner" },
  { label: "Texto do botão", key: "buttonText" },
  { label: "Borda do texto", key: "buttonTextStroke" },
];

const CARD_FIELDS = [
  { label: "Fundo da carta", key: "cardBg" },
  { label: "Borda da carta", key: "cardBorder" },
  { label: "Texto da carta", key: "cardText" },
  { label: "Borda do texto", key: "cardTextStroke" },
];

// --- 1. COMPONENTE DE SEÇÃO ANIMADA (Entrada em Cascata) ---
const AnimSection = ({ children, delay = 0, style, className }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[{ opacity: opacityAnim, transform: [{ translateY: translateYAnim }] }, style]}
      className={className}
    >
      {children}
    </Animated.View>
  );
};

// --- 2. WRAPPER DE ANIMAÇÃO PARA O BOTÃO ---
// Este componente NÃO define estilos visuais, apenas a animação de escala.
// Ele envolve o botão original para não quebrar o layout.
const AnimatedScaleWrapper = ({ children, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};


// --- 3. SUB-COMPONENTE PARA O INPUT DE COR ---
const ColorInput = ({ label, colorKey, themeValues, onUpdate }) => (
  <View className="gap-2 w-full items-center mb-6">
    <OutlinedText size={13}>{label}</OutlinedText>

    {/* Picker */}
    <View className="w-[90%] h-[200px]">
      <ColorPicker
        color={themeValues[colorKey]}
        onColorChangeComplete={(color) => onUpdate(colorKey, color)}
        thumbSize={30}
        sliderSize={30}
        noSnap
        row={false}
      />
    </View>

    {/* Campo manual */}
    <TextInput
      value={themeValues[colorKey]}
      onChangeText={(v) => onUpdate(colorKey, v)}
      placeholder="#FFFFFF"
      autoCapitalize="characters"
      className="bg-white w-[90%] h-12 rounded-xl px-3 border border-[#5A1719] text-center font-bold"
    />
  </View>
);

export default function SettingsScreen() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [tempTheme, setTempTheme] = useState(theme);

  function updateColor(field, value) {
    setTempTheme((prev) => ({ ...prev, [field]: value }));
  }

  function handleApply() {
    if (setTheme) {
      setTheme(tempTheme);
      Alert.alert("Sucesso", "Tema atualizado com sucesso!");
    } else {
      console.warn("Função setTheme não encontrada no Contexto");
    }
  }

  // --- Botão de Aplicar (Versão Original com Wrapper de Animação) ---
  const ApplyButton = () => (
    <AnimatedScaleWrapper onPress={handleApply}>
      {/* Esta View mantém EXATAMENTE o estilo original do seu botão */}
      <View className="mt-6 bg-[#2ecc71] py-3 px-8 rounded-xl border-2 border-white shadow-lg">
        <OutlinedText size={16} color="#FFF" strokeColor="#145A32">
          APLICAR MUDANÇAS
        </OutlinedText>
      </View>
    </AnimatedScaleWrapper>
  );

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../../../assets/backgroundConfig.png")}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ paddingVertical: 40, alignItems: "center" }}>
        
        {/* Título Animado */}
        <AnimSection delay={0}>
          <OutlinedText size={22}>Personalização</OutlinedText>
        </AnimSection>

        {/* --- SEÇÃO BOTÕES --- */}
        <AnimSection 
          delay={200} 
          className="w-[90vw] mt-6 bg-black/40 rounded-3xl p-6 items-center border border-white/20"
        >
          <OutlinedText size={18}>Botões</OutlinedText>

          <View className="mt-6 w-full gap-[4vh]">
            {BUTTON_FIELDS.map((field) => (
              <ColorInput
                key={field.key}
                label={field.label}
                colorKey={field.key}
                themeValues={tempTheme}
                onUpdate={updateColor}
              />
            ))}
          </View>

          {/* Preview Botão */}
          <View className="mt-[4vh] mb-2 items-center w-full">
            <OutlinedText size={14}>Preview:</OutlinedText>

            <View className="p-4 bg-white/10 rounded-xl mt-2 mb-2 w-full items-center border border-white/5">
              <TouchableOpacity
                className="w-[45vw] h-[50px] rounded-[25px] border-[3px] justify-center items-center"
                style={{
                  backgroundColor: tempTheme.buttonBg,
                  borderColor: tempTheme.buttonBorderOuter,
                }}
              >
                <View
                  className="w-full h-full rounded-[22px] border-[3px] justify-center items-center"
                  style={{
                    borderColor: tempTheme.buttonBorderInner,
                  }}
                >
                  <OutlinedText
                    color={tempTheme.buttonText}
                    strokeColor={tempTheme.buttonTextStroke}
                  >
                    Botão Exemplo
                  </OutlinedText>
                </View>
              </TouchableOpacity>
            </View>

            {/* BOTÃO DE APLICAR */}
            <ApplyButton />
          </View>
        </AnimSection>

        {/* --- SEÇÃO CARTAS --- */}
        <AnimSection 
          delay={400} 
          className="w-[90vw] mt-8 bg-black/40 rounded-3xl p-6 items-center border border-white/20"
        >
          <OutlinedText size={18}>Cartas</OutlinedText>

          <View className="mt-6 w-full gap-[4vh]">
            {CARD_FIELDS.map((field) => (
              <ColorInput
                key={field.key}
                label={field.label}
                colorKey={field.key}
                themeValues={tempTheme}
                onUpdate={updateColor}
              />
            ))}
          </View>

          {/* Preview Carta */}
          <View className="mt-[4vh] mb-2 items-center w-full">
            <OutlinedText size={14}>Preview:</OutlinedText>

            <View className="p-4 bg-white/10 rounded-xl mt-2 mb-2 w-full items-center border border-white/5">
              <TouchableOpacity className="w-[26vw]">
                <View
                  className="rounded-lg overflow-hidden border-2"
                  style={{
                    borderColor: tempTheme.cardBorder,
                    backgroundColor: tempTheme.cardBg,
                  }}
                >
                  <Image
                    source={require("../../../assets/cards/1.png")}
                    className="w-full h-[60px]"
                    resizeMode="contain"
                  />
                  <View className="items-center py-1">
                    <OutlinedText
                      size={13}
                      color={tempTheme.cardText}
                      strokeColor={tempTheme.cardTextStroke}
                    >
                      Hello Kitty
                    </OutlinedText>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* BOTÃO DE APLICAR */}
            <ApplyButton />
          </View>
        </AnimSection>

        <View className="h-[6vh]" />
      </ScrollView>
    </ImageBackground>
  );
}