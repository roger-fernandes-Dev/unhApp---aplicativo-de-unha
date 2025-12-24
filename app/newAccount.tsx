import { saveProfile } from "@/storage/localStorage";
// Função responsável por salvar o perfil da manicure no AsyncStorage

import { router } from "expo-router";
// Controle de navegação entre telas

import { useState } from "react";
// Hook para controle de estado local

import { StyleSheet, View } from "react-native";

import { Button, Card, Text, TextInput } from "react-native-paper";
// Componentes visuais do React Native Paper

import { SafeAreaView } from "react-native-safe-area-context";
// Garante layout seguro em áreas com notch ou bordas

export default function NewAccount() {
  // Nome da manicure
  const [name, setName] = useState("");

  // Valor do pacote (string para facilitar digitação)
  const [pacote, setPacote] = useState("");

  // Valor avulso
  const [avulso, setAvulso] = useState("");

  // Salva o perfil da manicure
  const handleSubmit = async () => {
    // Validação básica
    if (!name.trim() || !pacote || !avulso) {
      alert("Preencha todos os campos");
      return;
    }

    // ID simples baseado em timestamp
    const manicureId = Date.now().toString();

    // Salva perfil no storage
    await saveProfile({
      id: manicureId,
      name: name.trim(),
      pricePacote: Number(pacote),
      priceAvulso: Number(avulso),
      createdAt: new Date().toISOString(),
    });

    // Após criar conta, segue para cadastro do primeiro cliente
    router.replace("CadastroCliente");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Criar conta</Text>

          {/* Nome da manicure */}
          <TextInput
            label="Nome da manicure"
            value={name}
            onChangeText={setName}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
            outlineStyle={styles.outline}
          />

          {/* Valor do pacote */}
          <TextInput
            label="Valor do pacote"
            value={pacote}
            onChangeText={setPacote}
            mode="outlined"
            keyboardType="numeric"
            left={<TextInput.Icon icon="package-variant" />}
            style={styles.input}
            outlineStyle={styles.outline}
          />

          {/* Valor avulso */}
          <TextInput
            label="Valor avulso"
            value={avulso}
            onChangeText={setAvulso}
            mode="outlined"
            keyboardType="numeric"
            left={<TextInput.Icon icon="cash" />}
            style={styles.input}
            outlineStyle={styles.outline}
          />
        </Card.Content>
      </Card>

      {/* Botão fixo inferior */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          icon="arrow-right"
          contentStyle={{ height: 52 }}
          style={styles.button}
        >
          Avançar
        </Button>
      </View>
    </SafeAreaView>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8FB",
    padding: 16,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 10,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#222",
  },
  input: {
    marginBottom: 14,
  },
  outline: {
    borderRadius: 14,
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 56,
  },
  button: {
    borderRadius: 16,
    backgroundColor: "#ff9ebeff",
  },
});
