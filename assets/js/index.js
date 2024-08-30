import { setupRecaptcha, signInWithPhone, saveUsuario, getUsuarios } from './firebase.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth();
const userForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

document.getElementById('closeModalUsuario').addEventListener('click', closeModal);
document.getElementById('overlay').addEventListener('click', closeModal);

// Evento de inicio de sesión
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  try {
    const login = await signInWithEmailAndPassword(auth, email, password);

    // Guardar el accessToken
    const accessToken = login.user.accessToken;

    // Obtener usuarios de Firestore
    const querySnapshot = await getUsuarios();

    // Recorrer la lista de usuarios para obtener el ID de usuario de Firestore
    querySnapshot.forEach(doc => {
      const docFirebase = doc.data();
      if (docFirebase.email === email) {
        console.log(docFirebase)
        const userIdFirestore = doc.id; // Obtén el ID del documento en Firestore
        sessionStorage.setItem('correo', email)
        sessionStorage.setItem(email, userIdFirestore)
        localStorage.setItem("token", userIdFirestore)
        console.log(localStorage)
        // console.log(`Usuario autenticado con ID de Firestore: ${userIdFirestore}`);
        // location.href = '../../sorteo/sorteo.html';
      }
    });
  } catch (e) {
    console.error(e);
    alert('Datos incorrectos');
  }
});

// Evento de registro de usuario
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombres = userForm['nombres'].value;
  const apellidos = userForm['apellidos'].value;
  const celular = userForm['celular'].value;
  const correo = userForm['correo'].value;
  const contraseña = userForm['contraseña'].value;
  const compras = [];
  
  try {
    viewModal();
    const appVerifier = setupRecaptcha('recaptcha-container');
    
    const confirmationResult = await signInWithPhone(celular, appVerifier);

    const verificationCode = await showModalAndAwaitConfirmation();

    const result = await confirmationResult.confirm(verificationCode);
    const user = result.user;

    await createUserWithEmailAndPassword(auth, correo, contraseña)
    .then(res => alert('Usuario Creado Existosamente'))
    .catch(er => alert('El usuario ya existe'))

    await saveUsuario(user.uid, nombres, apellidos, celular, correo, contraseña, compras);

    alert('Registro completado y usuario guardado en Firestore');
    userForm.reset();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error durante la autenticación o registro:', error);
    alert('Hubo un error al registrar el usuario. Inténtalo de nuevo.');
  }
});

function viewModal() {
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

const showModalAndAwaitConfirmation = () => {
  return new Promise((resolve) => {
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModal');
    const form = document.getElementById('verification-form');

    modal.style.display = 'flex';

    closeModalButton.addEventListener('click', () => {
      const code = Array.from(form.querySelectorAll('input')).map(input => input.value).join('');
      modal.style.display = 'none';
      resolve(code);
    });
  });
};

// Evento botones ingreso y registro
document.getElementById('login-tab').addEventListener('click', function() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  this.classList.add('active');
  document.getElementById('register-tab').classList.remove('active');
});

document.getElementById('register-tab').addEventListener('click', function() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  this.classList.add('active');
  document.getElementById('login-tab').classList.remove('active');
});