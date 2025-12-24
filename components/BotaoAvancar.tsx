import { router } from "expo-router";
import { Button } from "react-native-paper";

/**
 * Propriedades do componente BotaoAvancar
 */
interface Props {
  /** Texto exibido no botão */
  text: string;

  /** Rota de destino (opcional) */
  to?: string;

  /** Ação personalizada ao clicar (opcional) */
  onPress?: () => void | Promise<void>;
}

/**
 * Botão reutilizável de navegação/ação.
 * 
 * - Se receber `onPress`, executa a ação customizada.
 * - Caso contrário, se receber `to`, navega para a rota informada.
 */
export default function BotaoAvancar({ text, to, onPress }: Props) {
  /**
   * Handler do clique do botão.
   * Prioriza a execução de uma ação customizada,
   * caso contrário realiza navegação via Expo Router.
   */
  const handlePress = async () => {
    if (onPress) {
      await onPress();
    } else if (to) {
      router.push(to);
    }
  };

  return (
    <Button
      mode="contained"
      onPress={handlePress}
      style={{ marginTop: 100 }}
      contentStyle={{ height: 60 }}
    >
      {text}
    </Button>
  );
}
