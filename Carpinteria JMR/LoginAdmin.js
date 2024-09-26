import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAa3ydRkiuR79uIRur4NZO3kkHcaq0EC3g",
    authDomain: "logincarpinteria.firebaseapp.com",
    projectId: "logincarpinteria",
    storageBucket: "logincarpinteria.appspot.com",
    messagingSenderId: "175583000054",
    appId: "1:175583000054:web:bb3ad7ee07cea6652dc3d7",
    measurementId: "G-BHHS9ZQ1G4"
};
// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

document.getElementById("login").addEventListener("click", async function() {
    var email = document.getElementById("email").value;
    var contraseña = document.getElementById("Contraseña").value;

    if (email === "" || contraseña === "") {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        // Iniciar sesión con Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, contraseña);
        const user = userCredential.user;

        alert("Inicio de sesión exitosa")
            // Redirigir a la página deseada después del inicio de sesión
        window.location.href = "CarpinteriaJMR.html";
    } catch (error) {
        console.log("Error al iniciar sesión: ", error);
        alert("Correo electrónico o contraseña incorrectos.");
    }

    // Limpiar los campos del formulario
    document.getElementById("email").value = "";
    document.getElementById("contraseña").value = "";
});