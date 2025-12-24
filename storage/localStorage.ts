import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * =====================================================
 * STORAGE KEYS
 * =====================================================
 * Centralização das chaves utilizadas no AsyncStorage.
 * Cada chave representa um domínio específico da aplicação.
 */

// Identificador da manicure atualmente autenticada
const STORAGE_KEY_CURRENT_USER = "@current_manicure_id";

// Coleção de perfis de manicures, indexados por ID
const STORAGE_KEY_PROFILES = "@profiles_by_id";

// Coleção de clientes agrupados por manicure
const STORAGE_KEY_CLIENTS = "@clients_by_manicure";

/**
 * =====================================================
 * SESSION MANAGEMENT
 * =====================================================
 * Responsável pelo controle de autenticação da manicure.
 */

/**
 * Persiste o ID da manicure autenticada.
 * @param manicureId Identificador único da manicure
 */
export const setCurrentManicure = async (manicureId: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY_CURRENT_USER, manicureId);
};

/**
 * Recupera o ID da manicure atualmente autenticada.
 * @returns ID da manicure ou null caso não exista sessão ativa
 */
export const getCurrentManicure = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEY_CURRENT_USER);
};

/**
 * Encerra a sessão da manicure autenticada.
 */
export const clearCurrentManicure = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY_CURRENT_USER);
};

/**
 * =====================================================
 * MANICURE PROFILE
 * =====================================================
 * Estrutura e operações relacionadas ao perfil da manicure.
 */

/**
 * Modelo de dados do perfil da manicure.
 */
export interface ManicureProfile {
  /** Identificador único */
  id: string;

  /** Nome da manicure */
  name: string;

  /** Valor cobrado por atendimento avulso */
  priceAvulso: number;

  /** Valor cobrado por pacote */
  pricePacote: number;

  /** Data de criação do perfil (ISO string) */
  createdAt: string;
}

/**
 * Cria ou atualiza um perfil de manicure.
 * Após a persistência, a manicure é automaticamente autenticada.
 *
 * @param profile Dados do perfil da manicure
 */
export const saveProfile = async (
  profile: ManicureProfile
): Promise<void> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY_PROFILES);
  const profiles: Record<string, ManicureProfile> = json
    ? JSON.parse(json)
    : {};

  profiles[profile.id] = profile;

  await AsyncStorage.setItem(
    STORAGE_KEY_PROFILES,
    JSON.stringify(profiles)
  );

  // Autentica automaticamente a manicure criada/atualizada
  await setCurrentManicure(profile.id);
};

/**
 * Recupera o perfil da manicure autenticada.
 *
 * @returns Perfil da manicure ou null caso não exista sessão ativa
 */
export const getProfile = async (): Promise<ManicureProfile | null> => {
  const manicureId = await getCurrentManicure();
  if (!manicureId) return null;

  const json = await AsyncStorage.getItem(STORAGE_KEY_PROFILES);
  const profiles: Record<string, ManicureProfile> = json
    ? JSON.parse(json)
    : {};

  return profiles[manicureId] ?? null;
};

/**
 * =====================================================
 * PROFILE LOOKUP
 * =====================================================
 * Busca de perfil por nome (login simplificado).
 */

/**
 * Localiza um perfil de manicure pelo nome.
 * A comparação é feita de forma case-insensitive.
 *
 * @param name Nome informado no login
 * @returns Perfil correspondente ou null
 */
export const findProfileByName = async (
  name: string
): Promise<ManicureProfile | null> => {
  const json = await AsyncStorage.getItem(STORAGE_KEY_PROFILES);
  const profiles: Record<string, ManicureProfile> = json
    ? JSON.parse(json)
    : {};

  const normalizedName = name.trim().toLowerCase();

  return (
    Object.values(profiles).find(
      profile => profile.name.toLowerCase() === normalizedName
    ) ?? null
  );
};

/**
 * =====================================================
 * CLIENT MANAGEMENT
 * =====================================================
 * Operações relacionadas aos clientes da manicure.
 */

/**
 * Recupera a lista de clientes da manicure autenticada.
 *
 * @returns Lista de clientes ou array vazio
 */
export const getClient = async (): Promise<any[]> => {
  const manicureId = await getCurrentManicure();
  if (!manicureId) return [];

  const json = await AsyncStorage.getItem(STORAGE_KEY_CLIENTS);
  const allClients = json ? JSON.parse(json) : {};

  return allClients[manicureId] ?? [];
};

/**
 * Persiste a lista de clientes da manicure autenticada.
 *
 * @param clients Lista completa de clientes
 */
export const saveClients = async (clients: any[]): Promise<void> => {
  const manicureId = await getCurrentManicure();
  if (!manicureId) return;

  const json = await AsyncStorage.getItem(STORAGE_KEY_CLIENTS);
  const allClients = json ? JSON.parse(json) : {};

  allClients[manicureId] = clients;

  await AsyncStorage.setItem(
    STORAGE_KEY_CLIENTS,
    JSON.stringify(allClients)
  );
};

/**
 * Adiciona um novo cliente à lista existente.
 *
 * @param newClient Objeto do novo cliente
 */
export const addClient = async (newClient: any): Promise<void> => {
  const currentClients = await getClient();
  await saveClients([...currentClients, newClient]);
};

/**
 * =====================================================
 * DEVELOPMENT UTILITIES
 * =====================================================
 * Utilitários exclusivos para ambiente de desenvolvimento.
 */

/**
 * Remove todos os dados persistidos da aplicação.
 * ⚠️ Uso restrito a ambiente de desenvolvimento.
 */
export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEY_CURRENT_USER,
    STORAGE_KEY_PROFILES,
    STORAGE_KEY_CLIENTS,
  ]);
};
