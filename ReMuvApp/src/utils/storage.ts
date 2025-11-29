import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData(key: string, value: any) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData(key: string) {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function removeData(key: string) {
  await AsyncStorage.removeItem(key);
}
