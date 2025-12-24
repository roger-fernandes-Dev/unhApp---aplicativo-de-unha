// Hook que executa efeitos quando a tela ganha foco
import { useFocusEffect } from '@react-navigation/native';

// Controle de rotas
import { router } from 'expo-router';

// Hooks do React
import React, { useCallback, useState } from 'react';

// Componentes base
import { ScrollView, StyleSheet, View } from 'react-native';

// Componentes de UI
import {
  Avatar,
  Badge,
  Card,
  FAB,
  IconButton,
  List,
  Menu,
  Text,
} from 'react-native-paper';

// Modais de data e hora
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

// Área segura
import { SafeAreaView } from 'react-native-safe-area-context';

// Funções de persistência
import {
  clearCurrentManicure,
  getClient,
  getProfile,
  saveClients,
} from '../storage/localStorage';

// Estrutura de dados do cliente
interface Client {
  id: string;
  name: string;
  type: 'avulso' | 'pacote';
  nextDate: string;
  nextTime: string;
  attended?: boolean;
}

export default function Perfil() {
  // Lista de clientes
  const [clients, setClients] = useState<Client[]>([]);

  // Controle de menus
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [headerMenuVisible, setHeaderMenuVisible] = useState(false);

  // Controle de edição
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // Dados da manicure
  const [manicureName, setManicureName] = useState('');
  const [pricePacote, setPricePacote] = useState(0);
  const [priceAvulso, setPriceAvulso] = useState(0);

  // Data atual em formato ISO
  const hojeISO = new Date().toISOString().split('T')[0];

  // Carrega dados sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const profile = await getProfile();
        if (!profile) {
          router.replace('/');
          return;
        }

        setManicureName(profile.name);
        setPricePacote(profile.pricePacote);
        setPriceAvulso(profile.priceAvulso);

        const list = await getClient();
        setClients(list);
      };
      load();
    }, [])
  );

  // Atualiza clientes no estado e no armazenamento
  const updateClients = async (updated: Client[]) => {
    setClients(updated);
    await saveClients(updated);
  };

  // Marca cliente como atendido ou não
  const toggleAttended = (id: string) => {
    updateClients(
      clients.map(c =>
        c.id === id ? { ...c, attended: !c.attended } : c
      )
    );
  };

  // Ordenação cronológica crescente (data + hora)
  const orderedClients = [...clients].sort((a, b) => {
    const d1 = new Date(`${a.nextDate}T${a.nextTime}`);
    const d2 = new Date(`${b.nextDate}T${b.nextTime}`);
    return d1.getTime() - d2.getTime();
  });

  // Formata data para padrão brasileiro
  const formatDateBR = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8FB' }}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Icon size={44} icon="account" />
          <View>
            <Text style={styles.headerName}>{manicureName}</Text>
            <Text style={styles.headerPrices}>
              Pacote: R$ {pricePacote} • Avulso: R$ {priceAvulso}
            </Text>
          </View>
        </View>

        {/* AÇÕES DO CABEÇALHO */}
        <View style={styles.headerRight}>
          <IconButton
            icon="logout"
            onPress={async () => {
              await clearCurrentManicure();
              router.replace('/');
            }}
          />

          <Menu
            visible={headerMenuVisible}
            onDismiss={() => setHeaderMenuVisible(false)}
            anchor={
              <IconButton
                icon="menu"
                onPress={() => {
                  setHeaderMenuVisible(false);
                  setTimeout(() => setHeaderMenuVisible(true), 0);
                }}
              />
            }
          >
            <Menu.Item
              leadingIcon="history"
              title="Histórico"
              onPress={() => {
                setHeaderMenuVisible(false);
                router.push('/Historico');
              }}
            />
          </Menu>
        </View>
      </View>

      {/* LISTA DE CLIENTES */}
      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 160 }}>
        {orderedClients.map(client => {
          const locked = client.attended === true;
          const isToday = client.nextDate === hojeISO;

          return (
            <Card key={client.id} style={styles.card}>
              <List.Item
                title={client.name}
                description={`${formatDateBR(client.nextDate)} • ${client.nextTime}`}
                left={() => (
                  <IconButton
                    icon={client.attended ? 'thumb-up' : 'close-circle'}
                    onPress={() => toggleAttended(client.id)}
                  />
                )}
                right={() => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isToday && <Badge>HOJE</Badge>}

                    <Badge>
                      {client.type === 'pacote' ? 'PACOTE' : 'AVULSO'}
                    </Badge>

                    {!locked && (
                      <Menu
                        visible={menuVisible === client.id}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                          <IconButton
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(client.id)}
                          />
                        }
                      >
                        <Menu.Item
                          title="Alterar data"
                          onPress={() => {
                            setEditingClient(client.id);
                            setOpenDate(true);
                            setMenuVisible(null);
                          }}
                        />
                        <Menu.Item
                          title="Alterar horário"
                          onPress={() => {
                            setEditingClient(client.id);
                            setOpenTime(true);
                            setMenuVisible(null);
                          }}
                        />
                        <Menu.Item
                          title="Excluir"
                          onPress={() =>
                            updateClients(
                              clients.filter(c => c.id !== client.id)
                            )
                          }
                        />
                      </Menu>
                    )}
                  </View>
                )}
              />
            </Card>
          );
        })}
      </ScrollView>

      {/* MODAIS DE DATA E HORA */}
      <DatePickerModal
        locale="pt"
        mode="single"
        visible={openDate}
        onDismiss={() => setOpenDate(false)}
        onConfirm={({ date }) => {
          if (!editingClient || !date) return;
          updateClients(
            clients.map(c =>
              c.id === editingClient
                ? { ...c, nextDate: date.toISOString().split('T')[0] }
                : c
            )
          );
          setOpenDate(false);
          setEditingClient(null);
        }}
      />

      <TimePickerModal
        visible={openTime}
        onDismiss={() => setOpenTime(false)}
        onConfirm={({ hours, minutes }) => {
          if (!editingClient) return;
          updateClients(
            clients.map(c =>
              c.id === editingClient
                ? {
                    ...c,
                    nextTime: `${hours.toString().padStart(2, '0')}:${minutes
                      .toString()
                      .padStart(2, '0')}`,
                  }
                : c
            )
          );
          setOpenTime(false);
          setEditingClient(null);
        }}
      />

      {/* BOTÃO FLUTUANTE */}
      <FAB
        icon="plus"
        style={styles.fabAdd}
        onPress={() => router.push('NewClient')}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerPrices: {
    fontSize: 13,
    color: '#555',
  },
  headerMenu: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    width: 220,
    borderRadius: 12,
    paddingVertical: 6,
  },
  menuItem: {
    height: 56,
    justifyContent: 'center',
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeHoje: {
    backgroundColor: '#a5d8ff',
    color: '#1c7ed6',
    marginRight: 6,
  },
  badgeTipo: {
    marginRight: 6,
  },
  badgePacote: {
    backgroundColor: '#9b59b6',
  },
  badgeAvulso: {
    backgroundColor: '#3498db',
  },
  fabAdd: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#ff9ebeff',
  },
});
