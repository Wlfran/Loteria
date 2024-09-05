
const btnGenerar = document.getElementById('generarN')
const btnUsuario = document.getElementById('usuarioR')
const btnUsuarioContenido = document.getElementById('btnUsuarioContenido')
const btnGenerarContenido = document.getElementById('generarNuContenido')



const correo = sessionStorage.getItem('correo');
const userId = sessionStorage.getItem(correo);

console.log(userId)
if(userId){
    btnGenerar.style.display = 'block'
    btnGenerarContenido.style.display = 'inline'
    btnUsuario.style.display = 'none'
    btnUsuarioContenido.style.display = 'none'
}

function cerrarSesion() {
    Swal.fire({
        title: "",
        text: "¿Está seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Cerrar Sesión",
        cancelButtonText: "Cerrar",
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();  // Limpia sessionStorage
            return Swal.fire({
                text: "Sesión cerrada",
                icon: "success"
            });
        }
    }).then((result) => {
        // Solo recarga la página después de que el segundo Swal.fire se haya cerrado
        if (result && result.isConfirmed) {
            location.reload();
        }
    });
    
}