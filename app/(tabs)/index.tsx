// Roteamento do Expo Router para navegação entre telas
import { router } from "expo-router";

// Hooks do React
import { useEffect, useState } from "react";

// Estilos nativos
import { StyleSheet } from "react-native";

// Componentes do React Native Paper (UI)
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

// Garante área segura (notch, status bar)
import { SafeAreaView } from "react-native-safe-area-context";

// Funções de persistência local (AsyncStorage)
import {
  findProfileByName,
  getCurrentManicure,
  getProfile,
  setCurrentManicure,
} from "../../storage/localStorage";

/**
 * Tela inicial (Login)
 * Responsável por:
 * - Verificar sessão ativa
 * - Realizar login por nome
 * - Redirecionar para perfil
 */
export default function HomeScreen() {
  // Nome digitado pela manicure
  const [name, setName] = useState("");

  // Controla estado de carregamento inicial
  const [loading, setLoading] = useState(true);

  // Mensagem exibida no Snackbar (feedback ao usuário)
  const [snack, setSnack] = useState("");

  /**
   * Verifica automaticamente se existe uma sessão ativa
   * ao abrir o aplicativo.
   */
  useEffect(() => {
    const checkLogin = async () => {
      // Busca ID da manicure logada
      const id = await getCurrentManicure();

      // Se não houver sessão, libera a tela de login
      if (!id) {
        setLoading(false);
        return;
      }

      // Busca perfil associado ao ID salvo
      const profile = await getProfile();

      // Se existir perfil válido, redireciona direto
      if (profile) {
        router.replace("Perfil");
        return;
      }

      // Caso contrário, encerra loading
      setLoading(false);
    };

    checkLogin();
  }, []);

  /**
   * Realiza login pelo nome da manicure
   */
  const handleLogin = async () => {
    // Validação básica de campo vazio
    if (!name.trim()) {
      setSnack("Digite seu nome");
      return;
    }

    // Procura perfil salvo pelo nome
    const profile = await findProfileByName(name);

    // Se não encontrar, informa erro
    if (!profile) {
      setSnack("Conta não encontrada");
      return;
    }

    // Salva sessão ativa
    await setCurrentManicure(profile.id);

    // Redireciona para a tela de perfil
    router.replace("Perfil");
  };

  // Tela de carregamento enquanto verifica sessão
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // Tela principal de login
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Bem-vinda 💅
          </Text>

          <TextInput
            label="Nome da manicure"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Entrar
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("newAccount")}
          >
            Criar nova conta
          </Button>
        </Card.Content>
      </Card>

      {/* Feedback visual de erro ou aviso */}
      <Snackbar visible={!!snack} onDismiss={() => setSnack("")}>
        {snack}
      </Snackbar>
    </SafeAreaView>
  );
}

/**
 * Estilos da tela
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF8FB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
});
