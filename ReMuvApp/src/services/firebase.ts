// Configuração do Firebase para o app ReMuv
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAnzRGMOCOq88pVmNeGfdq6mGZVGOjBsrw",
  authDomain: "remuve-32d9f.firebaseapp.com",
  projectId: "remuve-32d9f",
  storageBucket: "remuve-32d9f.firebasestorage.app",
  messagingSenderId: "892826159428",
  appId: "1:892826159428:web:75290dfd5e1d392671af11",
  measurementId: "G-ES26E3NGQP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
