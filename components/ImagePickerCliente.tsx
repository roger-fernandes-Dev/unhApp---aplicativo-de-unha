// Importa a API de seleção de imagens do Expo
import * as ImagePicker from "expo-image-picker";

// Hooks e tipos base do React
import React, { useState } from "react";

// Componentes nativos do React Native
import { Image, StyleSheet, TouchableOpacity } from "react-native";

// Componente visual do React Native Paper
import { Avatar } from "react-native-paper";

// Tipagem das props do componente
type Props = {
  /**
   * Função opcional chamada quando o usuário seleciona uma imagem.
   * Retorna a URI da imagem selecionada.
   */
  onChange?: (uri: string) => void;
};

/**
 * Componente responsável por permitir a seleção de uma imagem
 * da galeria do dispositivo e exibi-la em formato de avatar.
 */
export default function ImagePickerCliente({ onChange }: Props) {
  // Estado local que armazena a URI da imagem selecionada
  const [foto, setFoto] = useState<string | null>(null);

  /**
   * Abre a galeria do dispositivo para seleção de uma imagem.
   */
  const escolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // restringe apenas a imagens
      quality: 1, // qualidade máxima
    });

    // Verifica se o usuário não cancelou a seleção
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFoto(uri);

      // Notifica o componente pai, se a função existir
      if (onChange) onChange(uri);
    }
  };

  return (
    <TouchableOpacity onPress={escolherFoto} style={styles.container}>
      {foto ? (
        // Exibe a imagem selecionada
        <Image source={{ uri: foto }} style={styles.foto} />
      ) : (
        // Ícone padrão quando nenhuma imagem foi selecionada
        <Avatar.Icon size={80} icon="camera" />
      )}
    </TouchableOpacity>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 60,
    overflow: "hidden",
  },
  foto: {
    width: "100%",
    height: "100%",
  },
});
