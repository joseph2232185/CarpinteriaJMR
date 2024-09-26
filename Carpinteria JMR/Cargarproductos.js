// Importar las librerías de Firebase necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBofV75tElxXDfjAfOP74MNPjAEJqvcTIE",
    authDomain: "catalgocarpinteria.firebaseapp.com",
    projectId: "catalgocarpinteria",
    storageBucket: "catalgocarpinteria.appspot.com",
    messagingSenderId: "382600614317",
    appId: "1:382600614317:web:3e0341352f85fc74bb1124",
    measurementId: "G-QL7JSZJ8TK"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Variable global para almacenar productos cargados desde Firebase
let products = [];

// Función para cargar productos desde Firebase
async function loadProductsFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        products = []; // Limpiar la lista de productos

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                name: data.nombre,
                price: data.precio,
                image: data.imageUrl || 'https://via.placeholder.com/150'
            });
        });

        // Renderizar productos después de cargarlos
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar productos: ', e);
    }
}

// Función para renderizar productos
function renderProducts(productsList) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Limpiar catálogo

    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const price = parseFloat(product.price);
        const formattedPrice = isNaN(price) ? "Precio no disponible" : price.toFixed(2);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: Q${formattedPrice}</p>
            <button class="whatsappButton" data-product-name="${product.name}" data-product-price="${formattedPrice}" data-product-image="${product.image}">Me interesa</button>
        `;

        catalog.appendChild(productCard);
    });

    // Añadir eventos de WhatsApp a los botones
    const whatsappButtons = document.querySelectorAll('.whatsappButton');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productImage = this.getAttribute('data-product-image');
            const mensaje = `Hola, estoy interesado en el producto: ${productName}\nPrecio: Q${productPrice}\nImagen: ${productImage}`;
            const numeroTelefono = "+50247012204";
            const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    });
}

// Función para manejar la subida de productos
document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];

    try {
        // Subir imagen a Firebase Storage
        const storageRef = ref(storage, `productos/${productImage.name}`);
        await uploadBytes(storageRef, productImage);
        const imageUrl = await getDownloadURL(storageRef);

        // Guardar producto en Firestore
        await addDoc(collection(db, 'productos'), {
            nombre: productName,
            precio: productPrice,
            imageUrl: imageUrl
        });

        // Recargar productos
        loadProductsFromFirebase();
        alert('Producto subido correctamente');
    } catch (error) {
        console.error('Error al subir producto: ', error);
        alert('Error al subir el producto');
    }
});

// Inicializar la carga de productos
loadProductsFromFirebase();