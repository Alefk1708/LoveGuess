import { View, Text } from "react-native";

export default function OutlinedText({
  children,
  size = 22,
  color = "#fff",
  strokeColor = "#5A1719",
  strokeWidth = 1.5,
  style,
}) {
  const directions = [
    [-strokeWidth, -strokeWidth],
    [strokeWidth, -strokeWidth],
    [-strokeWidth, strokeWidth],
    [strokeWidth, strokeWidth],
    [-strokeWidth, 0],
    [strokeWidth, 0],
    [0, -strokeWidth],
    [0, strokeWidth],
  ];

  return (
    <View style={{ position: "relative", alignItems: "center" }}>
      {directions.map(([x, y], i) => (
        <Text
          key={i}
          style={[
            {
              position: "absolute",
              left: x,
              top: y,
              color: strokeColor,
              fontWeight: "bold",
              fontSize: size,
            },
            style,
          ]}
        >
          {children}
        </Text>
      ))}

      <Text
        style={[
          {
            color,
            fontWeight: "bold",
            fontSize: size,
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}
