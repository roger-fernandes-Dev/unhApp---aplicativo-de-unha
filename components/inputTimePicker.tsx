import React, { useState } from "react";
import { Pressable, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from "react-native-paper";

/**
 * Props do componente
 * onChangeTime:
 *  - Callback obrigatório
 *  - Retorna o horário selecionado no formato HH:mm
 */
type Props = {
  onChangeTime: (value: string) => void;
};

/**
 * Componente InputTimePicker
 *
 * Responsável por:
 * - Exibir um campo de horário somente leitura
 * - Abrir um modal de seleção de horário
 * - Retornar o horário formatado para o componente pai
 */
export default function InputTimePicker({ onChangeTime }: Props) {
  // Controla a visibilidade do modal
  const [visible, setVisible] = useState(false);

  // Armazena o horário formatado exibido no input
  const [timeString, setTimeString] = useState("");

  /**
   * Executado ao confirmar o horário no modal
   * - Extrai horas e minutos
   * - Formata para HH:mm
   * - Atualiza estado local
   * - Dispara callback para o componente pai
   */
  const handleConfirm = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");

    const formatted = `${h}:${m}`;

    setTimeString(formatted);
    onChangeTime(formatted);

    setVisible(false);
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
      {/* Pressable garante que o input seja clicável sem permitir edição */}
      <Pressable onPress={() => setVisible(true)}>
        <TextInput
          label="Horário"
          mode="outlined"
          value={timeString}
          editable={false} // impede digitação manual
          right={<TextInput.Icon icon="clock-outline" />}
        />
      </Pressable>

      {/* Modal de seleção de horário */}
      <DateTimePickerModal
        isVisible={visible}
        mode="time"
        locale="pt-BR"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}
