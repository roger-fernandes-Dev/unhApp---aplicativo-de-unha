// Controle de rotas do Expo Router
import { router } from 'expo-router';

// Hooks do React
import React, { useEffect, useState } from 'react';

// Componentes base do React Native
import { StyleSheet, View } from 'react-native';

// Componentes do React Native Paper (UI)
import {
  Button,
  IconButton,
  RadioButton,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';

// Modais de data e hora
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

// Área segura para dispositivos com notch
import { SafeAreaView } from 'react-native-safe-area-context';

// Funções de persistência local
import {
  addClient,
  getCurrentManicure,
} from '../storage/localStorage';

// Componente da tela de cadastro de cliente
export default function NewCliente() {
  // Nome da cliente
  const [name, setName] = useState('');

  // Tipo de cliente: avulso ou pacote
  const [type, setType] = useState<'avulso' | 'pacote'>('avulso');

  // Data selecionada
  const [date, setDate] = useState<Date | undefined>();

  // Horário selecionado
  const [time, setTime] = useState<{ hours: number; minutes: number } | null>(null);

  // Controle de abertura dos modais
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // Controle do Snackbar (feedback visual)
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Verifica se existe manicure logada
  useEffect(() => {
    const checkSession = async () => {
      const id = await getCurrentManicure();
      if (!id) {
        router.replace('Login');
      }
    };
    checkSession();
  }, []);

  // Exibe mensagens no Snackbar
  const showMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  // Salva o cliente no armazenamento local
  const saveClient = async () => {
    if (!name.trim()) {
      showMessage('Informe o nome da cliente.');
      return;
    }

    if (!date) {
      showMessage('Selecione a data.');
      return;
    }

    if (!time) {
      showMessage('Selecione o horário.');
      return;
    }

    // Formata data e hora
    const nextDate = date.toISOString().split('T')[0];
    const nextTime = `${String(time.hours).padStart(2, '0')}:${String(
      time.minutes
    ).padStart(2, '0')}`;

    // Salva o cliente
    await addClient({
      id: Date.now().toString(),
      name: name.trim(),
      type,
      nextDate,
      nextTime,
    });

    // Redireciona para o perfil
    router.replace('Perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="headlineMedium" style={styles.title}>
          Nova Cliente
        </Text>
      </View>

      {/* Nome da cliente */}
      <TextInput
        label="Nome da cliente"
        mode="outlined"
        left={<TextInput.Icon icon="account" />}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Tipo de cliente */}
      <RadioButton.Group
        onValueChange={(v) => setType(v as 'avulso' | 'pacote')}
        value={type}
      >
        <RadioButton.Item label="Cliente Avulso" value="avulso" />
        <RadioButton.Item label="Cliente de Pacote" value="pacote" />
      </RadioButton.Group>

      {/* Seleção de data */}
      <Button
        mode="outlined"
        icon="calendar"
        onPress={() => setOpenDate(true)}
        style={styles.input}
      >
        {date ? date.toLocaleDateString() : 'Selecionar data'}
      </Button>

      {/* Seleção de horário */}
      <Button
        mode="outlined"
        icon="clock-outline"
        onPress={() => setOpenTime(true)}
        style={styles.input}
      >
        {time
          ? `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}`
          : 'Selecionar horário'}
      </Button>

      {/* Botão salvar */}
      <Button
        mode="contained"
        icon="content-save"
        onPress={saveClient}
        style={styles.saveButton}
      >
        Salvar cliente
      </Button>

      {/* Modal de data */}
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={openDate}
        date={date}
        onConfirm={({ date }) => {
          setOpenDate(false);
          setDate(date);
        }}
        onDismiss={() => setOpenDate(false)}
      />

      {/* Modal de hora */}
      <TimePickerModal
        visible={openTime}
        onDismiss={() => setOpenTime(false)}
        onConfirm={(t) => {
          setOpenTime(false);
          setTime(t);
        }}
        hours={12}
        minutes={0}
      />

      {/* Feedback visual */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8FB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // compensa o botão de voltar
  },
  input: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 6,
  },
});
