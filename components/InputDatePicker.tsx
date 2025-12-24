import React, { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

/**
 * Propriedades do componente InputDatePicker
 */
interface Props {
  /**
   * Callback acionado quando uma data válida é selecionada.
   * Retorna a data no formato ISO 8601.
   */
  onChangeDate?: (date: string) => void;
}

/**
 * Componente de seleção de data com calendário modal.
 * Bloqueia a seleção de datas anteriores ao dia atual.
 */
export default function InputDatePicker({ onChangeDate }: Props) {
  /**
   * Controla a visibilidade do modal do calendário
   */
  const [visible, setVisible] = useState(false);

  /**
   * Armazena a data selecionada pelo usuário
   */
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  /**
   * Data atual com horário zerado.
   * Necessário para comparação correta com datas selecionadas.
   */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Função executada ao confirmar a data no calendário
   */
  const onConfirm = (params: any) => {
    // Fecha o modal após a seleção
    setVisible(false);

    const picked = params.date;

    // Bloqueia datas anteriores ao dia atual
    if (picked < today) {
      setSelectedDate(undefined);
      return;
    }

    // Atualiza o estado com a data válida selecionada
    setSelectedDate(picked);

    // Dispara o callback com a data em formato ISO
    if (picked && onChangeDate) {
      onChangeDate(picked.toISOString());
    }
  };

  return (
    <View>
      {/* Campo de texto que exibe a data selecionada */}
      <TextInput
        label="Data"
        value={selectedDate ? selectedDate.toLocaleDateString() : ""}
        onFocus={() => setVisible(true)}
        editable={false} // Impede digitação manual
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setVisible(true)}
          />
        }
      />

      {/* Modal de seleção de data */}
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={visible}
        onDismiss={() => setVisible(false)}
        date={selectedDate}
        onConfirm={onConfirm}
        validRange={{
          startDate: today, // Bloqueia datas passadas visualmente
        }}
      />
    </View>
  );
}
