// Conectando con firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5txYAXVNjJHKtOAnRZeDsVGhR_296SsI",
    authDomain: "registroweb1-1772d.firebaseapp.com",
    projectId: "registroweb1-1772d",
    storageBucket: "registroweb1-1772d.appspot.com",
    messagingSenderId: "760411379614",
    appId: "1:760411379614:web:3ba72a8ce427cdc06e288f"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// llamando elementos de html
let btnRegistrar = document.getElementById('btnRegistrar');
let btnIngresar = document.getElementById('btnIngresar');
let contenidoDeLaWeb = document.getElementById('contenidoDeLaWeb');
let formulario = document.getElementById('formulario');
let btnCerrarSesion = document.getElementById('btnCerrarSesion');
let btnGoogle=document.getElementById('btnGoogle');
let txtTitulo=document.getElementById('txtTitulo');
let txtDescripcion=document.getElementById('txtDescripcion');
let btnPublicar=document.getElementById('btnPublicar');
let verDatosEnPantalla=document.getElementById('verDatosEnPantalla');

//Función Registrar
btnRegistrar.addEventListener('click', () => {
    let email = document.getElementById('txtEmail').value;
    let password = document.getElementById('txtPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            console.log("Inicio de sesión correcto");
            cargarJSON();
            contenidoDeLaWeb.classList.replace('ocultar','mostrar');
            formulario.classList.replace('mostrar','ocultar');
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            // ..
        });
})

//Funcion de iniciar Sesion

btnIngresar.addEventListener('click',()=>{
    let email = document.getElementById('txtEmail').value;
    let password=document.getElementById('txtPassword').value;
    console.log("tu email" +email +" y tu contraseña es " + password)

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log("Inicio sesion correctamente")
    cargarJSON();
    contenidoDeLaWeb.classList.replace('ocultar','mostrar');
    formulario.classList.replace('mostrar','ocultar');
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
  });
    
})

//Funcion de cerrar sesión

btnCerrarSesion.addEventListener('click',()=>{
firebase.auth().signOut().then(()=>{
    console.log("Cierre de sesion correcto");
    contenidoDeLaWeb.classList.replace('mostrar','ocultar');
    formulario.classList.replace('ocultar','mostrar');
}).catch((error)=>{
    console.log("Error con el cierre de Sesión");
});

})

//Funcion que escucha el estado de conexion
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      
      var uid = user.uid;
      
      contenidoDeLaWeb.classList.replace('ocultar','mostrar');
      formulario.classList.replace('mostrar','ocultar')
    } else {
        contenidoDeLaWeb.classList.replace('mostrar','ocultar');
        formulario.classList.replace('ocultar','mostrar');
      
    }
  });

  //Funcion que lleva a google

  btnGoogle.addEventListener('click',()=>{
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    console.log("Inicio de sesion con google")

    
    var token = credential.accessToken;
    var user = result.user;
  }).catch((error) => {
    
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error de login con google")
  });
  })

  //Funcion llamando al Json

function cargarJSON(){
    fetch('data.json')
    .then(function(res) {
        return res.json();
    })

.then((data) => {
    console.log(data);
    let html = '';
    data.forEach((e) => {
      
         html += `
         <div class="producto">
         <h1>${e.nombre}</h1>
         <h2>${e.precio}</h2> 
         <img src=${e.imge} height="150px"> 
         <h3>${e.id}</h3> 
         </div>
       `;
       
    });
    document.getElementById('resultado').innerHTML= html;
})
}  
//Funcion agregar datos 
btnPublicar.addEventListener('click',()=>{
  db.collection("comentarios").add({
    titulo: txtTitulo= document.getElementById('txtTitulo').value,
    descripcion: txtDescripcion = document.getElementById('txtDescripcion').value,
})
.then((docRef) => {
    console.log("Se guardo tu comentario correctamente");
    imprimirComentariosEnPantalla();
})
.catch((error) => {
    console.error("Error al enviar tu comentario",error);
});
})

//Funcion leer datos o imprimir comentarios en pantalla
function imprimirComentariosEnPantalla(){
  db.collection("comentarios").get().then((querySnapshot) => {
    let html = '';
    querySnapshot.forEach((doc)=>{
      console.log(`${doc.data().titulo}`);
      console.log(`${doc.data().descripcion}`);
      var listarDatos = `
      <div style = "border: solid" "background-color: red";>
      <br>
      <li class = "listarDatos">
      <h5 class ="listarDatosH5"> ${doc.data().titulo} </h5>
      <p> ${doc.data().descripcion} </p>
      </li>
      <br>
      </div>
      `;
      html += listarDatos;
    }); document.getElementById('imprimirComentariosEnPantalla').innerHTML= html;
});

}



