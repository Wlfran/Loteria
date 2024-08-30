import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDh1rTFzP_TaPZYG1N_vsln10XqGan-fvw",
  authDomain: "db-loteria.firebaseapp.com",
  projectId: "db-loteria",
  storageBucket: "db-loteria.appspot.com",
  messagingSenderId: "481276152488",
  appId: "1:481276152488:web:88543f55f23db803a7d09d",
  measurementId: "G-3TRGKZPS66"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar reCAPTCHA
export const setupRecaptcha = (elementId) => {
  if (!auth) {
    throw new Error('Firebase auth no está inicializado');
  }

  return new RecaptchaVerifier(auth, elementId, {
    'size': 'invisible',
    'callback': (response) => {
    }
  }, auth);
};

// Enviar código de verificación al número de teléfono
export const signInWithPhone = (phoneNumber, appVerifier) => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// Guardar información adicional del usuario en Firestore
export const saveUsuario = async (uid, name, lastName, phone, email, password) => {
  try {
    await addDoc(collection(db, 'users'), {
      uid,
      name,
      lastName,
      phone,
      email,
      password,
      createdAt: new Date()
    });
    console.log('Usuario guardado en Firestore');
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    throw error;
  }
};

export const getUsuarios = () => getDocs(collection(db, 'users'))
