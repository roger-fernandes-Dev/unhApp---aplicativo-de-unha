import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

// 👇 ADICIONE ISSO
import { pt, registerTranslation } from "react-native-paper-dates";
registerTranslation("pt", pt);
// 👆 ADICIONE ISSO

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="CadastroCliente" />
          <Stack.Screen name="Perfil" />
          <Stack.Screen name="NewClient" />
          <Stack.Screen name="Historico" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
