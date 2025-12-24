// ===============================
// COMPONENTES E DEPENDÊNCIAS
// ===============================

// Componentes reutilizáveis do projeto
import BotaoAvancar from '@/components/BotaoAvancar';
import CaixadeEntrada from '@/components/CaixadeEntrada';
import InputDatePicker from '@/components/InputDatePicker';
import InputTimePicker from '@/components/inputTimePicker';

// Ícones
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Armazenamento local
import AsyncStorage from '@react-native-async-storage/async-storage';

// Navegação
import { router } from 'expo-router';

// React
import React, { useEffect, useState } from 'react';

// UI
import { ScrollView, StyleSheet, View } from "react-native";
import { RadioButton, Snackbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Persistência de dados
import { addClient, getClient, getProfile } from '../storage/localStorage';

// ===============================
// COMPONENTE
// ===============================
function CadastroCliente() {
  // Tipo de cliente: avulso ou pacote
  const [clientType, setClientType] = useState<'avulso' | 'pacote'>('avulso');

  // Nome da cliente
  const [userName, setUserName] = useState('');

  // Nome da manicure logada
  const [userProfile, setUserProfile] = useState<string | null>(null);

  // Data e horário do próximo atendimento
  const [nextDate, setNextDate] = useState<string>('');
  const [nextTime, setNextTime] = useState<string>('');

  // Controle do Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  /**
   * Executa ao montar a tela
   * - Impede acesso se o primeiro cliente já foi cadastrado
   * - Busca o nome da manicure para exibição
   */
  useEffect(() => {
    const checkFirstAccess = async () => {
      const done = await AsyncStorage.getItem('firstClientDone');
      if (done === 'true') {
        router.replace('/Perfil');
      }
    };

    const fetchName = async () => {
      const profile = await getProfile();
      if (profile?.name) setUserProfile(profile.name);
    };

    checkFirstAccess();
    fetchName();
  }, []);

  // Exibe mensagens de erro ou aviso
  const showMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  /**
   * Valida e salva o primeiro cliente
   * Regras:
   * - Campos obrigatórios
   * - Não permitir datas passadas
   * - Não permitir horários vencidos no dia atual
   * - Não permitir conflito de horário
   */
  const handleSaveFirstClient = async () => {
    if (!userName.trim() || !nextDate || !nextTime) {
      showMessage("Preencha todos os campos.");
      return;
    }

    const lista = await getClient();

    // Constrói data completa com horário
    const [h, m] = nextTime.split(":").map(Number);
    const dataEscolhida = new Date(nextDate);
    dataEscolhida.setHours(h, m, 0, 0);

    const agora = new Date();

    // Validação: data passada
    const somenteDataAtual = new Date();
    somenteDataAtual.setHours(0, 0, 0, 0);

    const somenteDataEscolhida = new Date(nextDate);
    somenteDataEscolhida.setHours(0, 0, 0, 0);

    if (somenteDataEscolhida < somenteDataAtual) {
      showMessage("Não é possível agendar em uma data que já passou.");
      return;
    }

    // Validação: horário passado no mesmo dia
    const ehHoje =
      dataEscolhida.getFullYear() === agora.getFullYear() &&
      dataEscolhida.getMonth() === agora.getMonth() &&
      dataEscolhida.getDate() === agora.getDate();

    if (ehHoje && dataEscolhida < agora) {
      showMessage("Esse horário já passou.");
      return;
    }

    // Validação: conflito de horário
    const existe = lista.some(
      (c: any) => c.nextDate === nextDate && c.nextTime === nextTime
    );

    if (existe) {
      showMessage("Esse horário já está ocupado.");
      return;
    }

    // Cria objeto do cliente
    const novo = {
      id: Date.now().toString(),
      name: userName,
      type: clientType,
      nextDate,
      nextTime,
    };

    // Salva cliente
    await addClient(novo);

    // Marca que o cadastro inicial foi concluído
    await AsyncStorage.setItem('firstClientDone', 'true');

    // Redireciona para o perfil e impede retorno
    router.replace('/Perfil');
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8FB' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 15 }}
        >
          <View style={styles.container}>
            <Text variant="headlineLarge">
              <MaterialCommunityIcons
                name="notebook-heart-outline"
                size={32}
                style={styles.textContainer1}
                color="#FF1493"
              />
              {userProfile ? `Olá ${userProfile}` : "Olá usuária"}
            </Text>

            <Text variant="titleLarge" style={styles.textContainer2}>
              cadastre sua cliente!!!
            </Text>

            {/* Nome da cliente */}
            <CaixadeEntrada
              name="Nome da sua cliente"
              onChangeText={setUserName}
            />

            {/* Tipo de cliente */}
            <RadioButton.Item
              style={styles.containerRadioButton}
              label="Cliente Avulso"
              value="avulso"
              color="#FF1493"
              status={clientType === 'avulso' ? 'checked' : 'unchecked'}
              onPress={() => setClientType('avulso')}
            />

            <RadioButton.Item
              style={styles.containerRadioButton}
              label="Cliente de Pacote"
              value="pacote"
              color="#FF1493"
              status={clientType === 'pacote' ? 'checked' : 'unchecked'}
              onPress={() => setClientType('pacote')}
            />

            <Text variant="titleLarge" style={styles.textContainer2}>
              Data da próxima sessão
            </Text>

            {/* Seletor de data */}
            <InputDatePicker onChangeDate={setNextDate} />
          </View>

          {/* Seletor de horário com validação */}
          <InputTimePicker
            onChangeTime={(time) => {
              if (!nextDate) {
                setNextTime(time);
                return;
              }

              const hoje = new Date();
              const [h, m] = time.split(":").map(Number);
              const horarioEscolhido = new Date(nextDate);
              horarioEscolhido.setHours(h, m, 0, 0);

              const ehHoje =
                horarioEscolhido.toDateString() === hoje.toDateString();

              if (ehHoje && horarioEscolhido < hoje) {
                showMessage("Escolha um horário futuro.");
                return;
              }

              setNextTime(time);
            }}
          />

          {/* Botões */}
          <View style={styles.containerButtons}>
            <BotaoAvancar text="<" to="/" />
            <BotaoAvancar
              text="Salvar e continuar"
              onPress={handleSaveFirstClient}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Snackbar de feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

// ===============================
// ESTILOS
// ===============================
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer1: {
    textAlign: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  textContainer2: {
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  containerRadioButton: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  containerButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});

export default CadastroCliente;
