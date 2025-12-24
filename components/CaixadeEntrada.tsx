import * as React from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Propriedades do componente CaixadeEntrada
 */
interface Props {
  /** Texto exibido como label do campo */
  name: string;

  /** Função chamada sempre que o texto for alterado */
  onChangeText: (text: string) => void;
}

/**
 * Componente reutilizável de campo de entrada de texto.
 * 
 * Encapsula o TextInput do React Native Paper
 * garantindo respeito às áreas seguras da tela.
 */
const CaixadeEntrada = ({ name, onChangeText }: Props) => {
  return (
    <SafeAreaView>
      <TextInput
        label={name}
        onChangeText={onChangeText}
      />
    </SafeAreaView>
  );
};

export default CaixadeEntrada;
