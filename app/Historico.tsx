// Navegação entre telas usando Expo Router
import { router } from 'expo-router';

// Hooks do React
import React, { useEffect, useState } from 'react';

// Componentes nativos
import { ScrollView, StyleSheet, View } from 'react-native';

// Componentes do React Native Paper
import {
    Appbar,
    Badge,
    Divider,
    List,
    Text,
} from 'react-native-paper';

// Área segura para evitar notch e barras do sistema
import { SafeAreaView } from 'react-native-safe-area-context';

// Função responsável por buscar os clientes no armazenamento local
import { getClient } from '../storage/localStorage';

/**
 * Estrutura de dados do cliente
 * value é opcional pois só existe para clientes avulsos
 */
interface Client {
  id: string;
  name: string;
  type: 'avulso' | 'pacote';
  nextDate: string;
  nextTime: string;
  attended?: boolean;
  value?: number;
}

export default function Historico() {
  // Estado que armazena apenas clientes já atendidos
  const [clients, setClients] = useState<Client[]>([]);

  /**
   * Carrega os clientes atendidos ao abrir a tela
   */
  useEffect(() => {
    const load = async () => {
      // Busca todos os clientes salvos
      const list: Client[] = await getClient();

      // Filtra somente os atendidos
      // e ordena do mais recente para o mais antigo
      const atendidos = list
        .filter(c => c.attended === true)
        .sort((a, b) => {
          const d1 = new Date(`${a.nextDate}T${a.nextTime}`);
          const d2 = new Date(`${b.nextDate}T${b.nextTime}`);
          return d2.getTime() - d1.getTime();
        });

      setClients(atendidos);
    };

    load();
  }, []);

  /**
   * Formata data ISO para padrão brasileiro
   */
  const formatDateBR = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8FB' }}>
      {/* Cabeçalho com botão de voltar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Histórico" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
        {/* Estado vazio */}
        {clients.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum atendimento registrado.
          </Text>
        ) : (
          // Lista de clientes atendidos
          clients.map(client => (
            <View key={client.id}>
              <List.Item
                title={client.name}
                description={`${formatDateBR(client.nextDate)} • ${client.nextTime}`}
                right={() => (
                  <View style={styles.right}>
                    {/* Tipo de atendimento */}
                    <Badge
                      style={[
                        styles.badge,
                        client.type === 'pacote'
                          ? styles.badgePacote
                          : styles.badgeAvulso,
                      ]}
                    >
                      {client.type === 'pacote' ? 'PACOTE' : 'AVULSO'}
                    </Badge>

                    {/* Valor exibido apenas para cliente avulso */}
                    {client.type === 'avulso' && client.value !== undefined && (
                      <Text style={styles.value}>
                        R$ {client.value.toFixed(2)}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Divider />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Estilos da tela Histórico
 */
const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  badgePacote: {
    backgroundColor: '#9b59b6',
  },
  badgeAvulso: {
    backgroundColor: '#3498db',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  },
  value: {
    fontSize: 12,
    color: '#2c3e50',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
});
