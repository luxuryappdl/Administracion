
/* =========================================================
   DL LUXURY
   SISTEMA DE ADMINISTRACIÓN
   SCRIPT PRINCIPAL

   ESTE ARCHIVO MANEJA ÚNICAMENTE:

   - Inicio
   - Ingresos
   - Ventas
   - Egresos
   - Stock
   - Dashboard

   =========================================================

   CATEGORÍAS INDEPENDIENTES:

   Gorras:
   gorras.html → gorras.js

   Playeras:
   playeras.html → playeras.js

   Hoodies:
   hoodies.html → hoodies.js

   Perfumes:
   perfumes.html → perfumes.js

   Accesorios:
   accesorios.html → accesorios.js

   Descuentos:
   descuentos.html → descuentos.js

   =========================================================

   IMPORTANTE:

   ESTE ARCHIVO NO MANEJA:

   - Productos
   - Modal de productos
   - Gorras
   - Playeras
   - Hoodies
   - Perfumes
   - Accesorios
   - Descuentos
   - Imágenes de productos
========================================================= */


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SUPABASE
    ===================================================== */

    const SUPABASE_URL =
        "https://brnyvkqwkosgtpugxcge.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_Qdae9GUtmuosAPP4kemF3A_Vr4HFo0n";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const ANO_KEY =
        "dlLuxuryAñoSeleccionado";

    const VENTAS_KEY =
        "dlLuxuryVentas";

    const EGRESOS_KEY =
        "dlLuxuryEgresos";


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function dinero(numero) {

        const valor =
            Number(numero);

        return "Q" +
            (
                Number.isFinite(valor)
                    ? valor
                    : 0
            ).toFixed(2);
    }


    function escaparHTML(texto) {

        return String(texto ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatearFecha(fecha) {

        if (!fecha) {
            return "";
        }

        const fechaObj =
            new Date(fecha);

        if (
            Number.isNaN(
                fechaObj.getTime()
            )
        ) {
            return "";
        }

        return fechaObj.toLocaleDateString(
            "es-GT",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    }


    function obtenerAno(fecha) {

        if (!fecha) {

            return new Date()
                .getFullYear();
        }

        const fechaObj =
            new Date(fecha);

        if (
            Number.isNaN(
                fechaObj.getTime()
            )
        ) {

            return new Date()
                .getFullYear();
        }

        return fechaObj.getFullYear();
    }


    /* =====================================================
       LOCAL STORAGE

       SOLO PARA:

       - Ventas
       - Egresos
       - Año seleccionado

       NO SE USA PARA PRODUCTOS.
    ===================================================== */

    function leerDatos(clave) {

        try {

            const datos =
                localStorage.getItem(clave);

            if (!datos) {
                return [];
            }

            const resultado =
                JSON.parse(datos);

            return Array.isArray(resultado)
                ? resultado
                : [];

        } catch (error) {

            console.error(
                "❌ Error leyendo:",
                clave,
                error
            );

            return [];
        }
    }


    function guardarDatos(clave, datos) {

        try {

            localStorage.setItem(
                clave,
                JSON.stringify(datos)
            );

            return true;

        } catch (error) {

            console.error(
                "❌ Error guardando:",
                clave,
                error
            );

            alert(
                "No se pudo guardar la información."
            );

            return false;
        }
    }


    function obtenerVentas() {

        return leerDatos(
            VENTAS_KEY
        );
    }


    function guardarVentas(ventas) {

        return guardarDatos(
            VENTAS_KEY,
            ventas
        );
    }


    function obtenerEgresos() {

        return leerDatos(
            EGRESOS_KEY
        );
    }


    function guardarEgresos(egresos) {

        return guardarDatos(
            EGRESOS_KEY,
            egresos
        );
    }


    /* =====================================================
       NAVEGACIÓN

       LAS CATEGORÍAS ABREN SU PROPIO HTML.
    ===================================================== */

    window.mostrarSeccion =
        function (
            id,
            boton = null
        ) {

            /* =============================================
               CATEGORÍAS INDEPENDIENTES
            ============================================= */

            const paginas = {

                gorras:
                    "gorras.html",

                playeras:
                    "playeras.html",

                hoodies:
                    "hoodies.html",

                perfumes:
                    "perfumes.html",

                accesorios:
                    "accesorios.html",

                descuentos:
                    "descuentos.html"

            };


            if (
                paginas[id]
            ) {

                window.location.href =
                    paginas[id];

                return;
            }


            /* =============================================
               SECCIONES DEL PANEL PRINCIPAL
            ============================================= */

            const secciones =
                document.querySelectorAll(
                    ".seccion"
                );


            secciones.forEach(
                function (seccion) {

                    seccion.classList.remove(
                        "activa"
                    );
                }
            );


            const seccion =
                document.getElementById(
                    id
                );


            if (seccion) {

                seccion.classList.add(
                    "activa"
                );
            }


            /* =============================================
               MENÚ
            ============================================= */

            const menus =
                document.querySelectorAll(
                    ".menu"
                );


            menus.forEach(
                function (menu) {

                    menu.classList.remove(
                        "active"
                    );
                }
            );


            if (boton) {

                boton.classList.add(
                    "active"
                );
            }


            /* =============================================
               INICIO
            ============================================= */

            if (
                id === "inicio"
            ) {

                return;
            }


            /* =============================================
               INGRESOS
            ============================================= */

            if (
                id === "ingresos"
            ) {

                cargarIngresos();

                return;
            }


            /* =============================================
               VENTAS
            ============================================= */

            if (
                id === "ventas"
            ) {

                llenarSelectorAnios();

                actualizarDashboard();

                return;
            }


            /* =============================================
               EGRESOS
            ============================================= */

            if (
                id === "egresos"
            ) {

                mostrarEgresos();

                return;
            }


            /* =============================================
               STOCK
            ============================================= */

            if (
                id === "stock"
            ) {

                cargarStock();

                return;
            }
        };


    /* =====================================================
       MODAL EGRESO
    ===================================================== */

    window.abrirModalEgreso =
        function () {

            const modal =
                document.getElementById(
                    "modalEgreso"
                );

            const formulario =
                document.getElementById(
                    "formEgreso"
                );


            if (!modal) {
                return;
            }


            if (formulario) {
                formulario.reset();
            }


            modal.style.display =
                "flex";

            modal.classList.add(
                "activo"
            );
        };


    window.cerrarModalEgreso =
        function () {

            const modal =
                document.getElementById(
                    "modalEgreso"
                );


            if (!modal) {
                return;
            }


            modal.style.display =
                "none";

            modal.classList.remove(
                "activo"
            );
        };


    /* =====================================================
       GUARDAR EGRESO
    ===================================================== */

    const formularioEgreso =
        document.getElementById(
            "formEgreso"
        );


    if (formularioEgreso) {

        formularioEgreso.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                const descripcionInput =
                    document.getElementById(
                        "descripcionEgreso"
                    );


                const montoInput =
                    document.getElementById(
                        "montoEgreso"
                    );


                const descripcion =
                    descripcionInput
                        ? descripcionInput.value.trim()
                        : "";


                const monto =
                    montoInput
                        ? Number(
                            montoInput.value
                        )
                        : 0;


                if (!descripcion) {

                    alert(
                        "Escribe una descripción."
                    );

                    return;
                }


                if (
                    !Number.isFinite(monto) ||
                    monto <= 0
                ) {

                    alert(
                        "Ingresa un monto válido."
                    );

                    return;
                }


                const egresos =
                    obtenerEgresos();


                egresos.push({

                    id:
                        Date.now().toString(),

                    descripcion:
                        descripcion,

                    monto:
                        monto,

                    fecha:
                        new Date().toISOString()

                });


                if (
                    !guardarEgresos(
                        egresos
                    )
                ) {

                    return;
                }


                alert(
                    "Egreso guardado correctamente."
                );


                window.cerrarModalEgreso();


                mostrarEgresos();

                cargarIngresos();

                actualizarDashboard();

            }
        );
    }


    /* =====================================================
       MOSTRAR EGRESOS
    ===================================================== */

    function mostrarEgresos() {

        const contenedor =
            document.getElementById(
                "listaEgresos"
            );


        if (!contenedor) {
            return;
        }


        const egresos =
            obtenerEgresos();


        contenedor.innerHTML =
            "";


        if (
            egresos.length === 0
        ) {

            contenedor.innerHTML = `
                <div class="sin-productos">

                    <i class="fa-solid fa-money-bill-transfer"></i>

                    <h3>
                        No hay egresos
                    </h3>

                    <p>
                        Registra tu primer egreso.
                    </p>

                </div>
            `;

            return;
        }


        egresos
            .slice()
            .reverse()
            .forEach(
                function (egreso) {

                    const tarjeta =
                        document.createElement(
                            "div"
                        );


                    tarjeta.className =
                        "producto-card";


                    tarjeta.innerHTML = `
                        <div class="producto-info">

                            <span class="mini-titulo">
                                ${formatearFecha(
                        egreso.fecha
                    )}
                            </span>

                            <h3>
                                ${escaparHTML(
                        egreso.descripcion
                    )}
                            </h3>

                            <div class="producto-precio">

                                <strong>
                                    ${dinero(
                        egreso.monto
                    )}
                                </strong>

                            </div>

                        </div>
                    `;


                    contenedor.appendChild(
                        tarjeta
                    );
                }
            );
    }


    /* =====================================================
       CARGAR STOCK

       EL STOCK REAL ESTÁ EN SUPABASE.
    ===================================================== */

    async function cargarStock() {

        const tabla =
            document.getElementById(
                "listaStock"
            );


        const totalProductosElemento =
            document.getElementById(
                "totalProductos"
            );


        const stockTotalElemento =
            document.getElementById(
                "stockTotal"
            );


        const stockBajoElemento =
            document.getElementById(
                "stockBajo"
            );


        if (
            !tabla &&
            !totalProductosElemento &&
            !stockTotalElemento &&
            !stockBajoElemento
        ) {

            return;
        }


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("productos")
                    .select(
                        "id,nombre,precio,stock,categoria_id,activo"
                    );


            if (error) {

                console.error(
                    "❌ Error cargando stock:",
                    error
                );


                if (tabla) {

                    tabla.innerHTML = `
                        <tr>
                            <td colspan="5">
                                Error al cargar el inventario.
                            </td>
                        </tr>
                    `;
                }


                return;
            }


            const productos =
                (data || [])
                    .filter(
                        function (producto) {

                            return (
                                producto.activo !== false
                            );
                        }
                    );


            let stockTotal = 0;

            let stockBajo = 0;


            productos.forEach(
                function (producto) {

                    const stock =
                        Number(
                            producto.stock || 0
                        );


                    stockTotal +=
                        stock;


                    if (
                        stock <= 5
                    ) {

                        stockBajo++;
                    }
                }
            );


            if (totalProductosElemento) {

                totalProductosElemento.textContent =
                    productos.length;
            }


            if (stockTotalElemento) {

                stockTotalElemento.textContent =
                    stockTotal;
            }


            if (stockBajoElemento) {

                stockBajoElemento.textContent =
                    stockBajo;
            }


            if (!tabla) {
                return;
            }


            tabla.innerHTML =
                "";


            if (
                productos.length === 0
            ) {

                tabla.innerHTML = `
                    <tr>
                        <td colspan="5">
                            No hay productos registrados.
                        </td>
                    </tr>
                `;

                return;
            }


            productos.forEach(
                function (producto) {

                    const stock =
                        Number(
                            producto.stock || 0
                        );


                    let estado =
                        "Disponible";


                    if (
                        stock <= 0
                    ) {

                        estado =
                            "Agotado";

                    } else if (
                        stock <= 5
                    ) {

                        estado =
                            "Stock bajo";
                    }


                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `
                        <td>
                            ${escaparHTML(
                        producto.nombre
                    )}
                        </td>

                        <td>
                            ${obtenerNombreCategoria(
                        producto.categoria_id
                    )}
                        </td>

                        <td>
                            ${dinero(
                        producto.precio
                    )}
                        </td>

                        <td>
                            ${stock}
                        </td>

                        <td>
                            ${estado}
                        </td>
                    `;


                    tabla.appendChild(
                        fila
                    );
                }
            );


        } catch (error) {

            console.error(
                "❌ Error inesperado cargando stock:",
                error
            );
        }
    }


    /* =====================================================
       NOMBRE DE CATEGORÍA

       IDs CORRECTOS:

       Gorras      = 1
       Playeras    = 2
       Hoodies     = 3
       Perfumes    = 4
       Accesorios  = 5
    ===================================================== */

    function obtenerNombreCategoria(
        categoriaId
    ) {

        const categorias = {

            1:
                "Gorras",

            2:
                "Playeras",

            3:
                "Hoodies",

            4:
                "Perfumes",

            5:
                "Accesorios"

        };


        return escaparHTML(
            categorias[categoriaId] ||
            "Sin categoría"
        );
    }


    /* =====================================================
       CARGAR VENTAS
    ===================================================== */

    function cargarVentas() {

        const tabla =
            document.getElementById(
                "tablaVentas"
            );


        if (!tabla) {
            return;
        }


        const ventas =
            obtenerVentas();


        tabla.innerHTML =
            "";


        if (
            ventas.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4">
                        No hay ventas registradas.
                    </td>
                </tr>
            `;

            return;
        }


        ventas
            .slice()
            .reverse()
            .slice(0, 20)
            .forEach(
                function (venta) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `
                        <td>
                            ${escaparHTML(
                        venta.producto ||
                        "Producto"
                    )}
                        </td>

                        <td>
                            ${Number(
                        venta.cantidad || 0
                    )}
                        </td>

                        <td>
                            ${dinero(
                        venta.total || 0
                    )}
                        </td>

                        <td>
                            ${escaparHTML(
                        venta.estado ||
                        "Completada"
                    )}
                        </td>
                    `;


                    tabla.appendChild(
                        fila
                    );
                }
            );
    }


    /* =====================================================
       CARGAR INGRESOS
    ===================================================== */

    function cargarIngresos() {

        const ventas =
            obtenerVentas();


        let total =
            0;


        ventas.forEach(
            function (venta) {

                total +=
                    Number(
                        venta.total ||
                        venta.monto ||
                        0
                    );
            }
        );


        const totalIngresos =
            document.getElementById(
                "totalIngresos"
            );


        const cantidadIngresos =
            document.getElementById(
                "cantidadIngresos"
            );


        const gananciaIngresos =
            document.getElementById(
                "gananciaIngresos"
            );


        if (totalIngresos) {

            totalIngresos.textContent =
                dinero(total);
        }


        if (cantidadIngresos) {

            cantidadIngresos.textContent =
                ventas.length;
        }


        const egresos =
            obtenerEgresos();


        let totalEgresos =
            0;


        egresos.forEach(
            function (egreso) {

                totalEgresos +=
                    Number(
                        egreso.monto ||
                        0
                    );
            }
        );


        if (gananciaIngresos) {

            gananciaIngresos.textContent =
                dinero(
                    total -
                    totalEgresos
                );
        }


        const tabla =
            document.getElementById(
                "tablaIngresos"
            );


        if (!tabla) {
            return;
        }


        tabla.innerHTML =
            "";


        if (
            ventas.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4">
                        No hay ingresos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        ventas
            .slice()
            .reverse()
            .slice(0, 20)
            .forEach(
                function (venta) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `
                        <td>
                            ${formatearFecha(
                        venta.fecha
                    )}
                        </td>

                        <td>
                            ${escaparHTML(
                        venta.producto ||
                        "Producto"
                    )}
                        </td>

                        <td>
                            ${Number(
                        venta.cantidad || 0
                    )}
                        </td>

                        <td>
                            ${dinero(
                        venta.total || 0
                    )}
                        </td>
                    `;


                    tabla.appendChild(
                        fila
                    );
                }
            );
    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    function actualizarDashboard() {

        const selector =
            document.getElementById(
                "selectorAño"
            );


        const anoActual =
            Number(
                localStorage.getItem(
                    ANO_KEY
                )
            ) ||
            new Date().getFullYear();


        if (selector) {

            selector.value =
                String(
                    anoActual
                );
        }


        const anoTexto =
            document.getElementById(
                "añoActual"
            );


        if (anoTexto) {

            anoTexto.textContent =
                anoActual;
        }


        const ventas =
            obtenerVentas()
                .filter(
                    function (venta) {

                        return (
                            obtenerAno(
                                venta.fecha
                            ) ===
                            anoActual
                        );
                    }
                );


        const egresos =
            obtenerEgresos()
                .filter(
                    function (egreso) {

                        return (
                            obtenerAno(
                                egreso.fecha
                            ) ===
                            anoActual
                        );
                    }
                );


        let totalVentas =
            0;


        let totalEgresos =
            0;


        let productosVendidos =
            0;


        ventas.forEach(
            function (venta) {

                totalVentas +=
                    Number(
                        venta.total ||
                        0
                    );


                productosVendidos +=
                    Number(
                        venta.cantidad ||
                        0
                    );
            }
        );


        egresos.forEach(
            function (egreso) {

                totalEgresos +=
                    Number(
                        egreso.monto ||
                        0
                    );
            }
        );


        const ganancia =
            totalVentas -
            totalEgresos;


        const elementoVentas =
            document.getElementById(
                "totalVentas"
            );


        const elementoEgresos =
            document.getElementById(
                "totalEgresos"
            );


        const elementoGanancia =
            document.getElementById(
                "gananciaTotal"
            );


        const elementoProductos =
            document.getElementById(
                "productosVendidos"
            );


        if (elementoVentas) {

            elementoVentas.textContent =
                dinero(
                    totalVentas
                );
        }


        if (elementoEgresos) {

            elementoEgresos.textContent =
                dinero(
                    totalEgresos
                );
        }


        if (elementoGanancia) {

            elementoGanancia.textContent =
                dinero(
                    ganancia
                );
        }


        if (elementoProductos) {

            elementoProductos.textContent =
                productosVendidos;
        }


        cargarTablaVentasAno(
            ventas
        );
    }


    /* =====================================================
       TABLA VENTAS POR AÑO
    ===================================================== */

    function cargarTablaVentasAno(
        ventas
    ) {

        const tabla =
            document.getElementById(
                "tablaVentas"
            );


        if (!tabla) {
            return;
        }


        tabla.innerHTML =
            "";


        if (
            ventas.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="4">
                        No hay ventas registradas
                        para este año.
                    </td>
                </tr>
            `;

            return;
        }


        ventas
            .slice()
            .reverse()
            .slice(0, 20)
            .forEach(
                function (venta) {

                    const fila =
                        document.createElement(
                            "tr"
                        );


                    fila.innerHTML = `
                        <td>
                            ${escaparHTML(
                        venta.producto ||
                        "Producto"
                    )}
                        </td>

                        <td>
                            ${Number(
                        venta.cantidad || 0
                    )}
                        </td>

                        <td>
                            ${dinero(
                        venta.total || 0
                    )}
                        </td>

                        <td>
                            ${escaparHTML(
                        venta.estado ||
                        "Completada"
                    )}
                        </td>
                    `;


                    tabla.appendChild(
                        fila
                    );
                }
            );
    }


    /* =====================================================
       SELECTOR DE AÑOS
    ===================================================== */

    function llenarSelectorAnios() {

        const selector =
            document.getElementById(
                "selectorAño"
            );


        if (!selector) {
            return;
        }


        const anoActual =
            new Date().getFullYear();


        const anos =
            new Set();


        anos.add(
            anoActual
        );


        obtenerVentas().forEach(
            function (venta) {

                anos.add(
                    obtenerAno(
                        venta.fecha
                    )
                );
            }
        );


        obtenerEgresos().forEach(
            function (egreso) {

                anos.add(
                    obtenerAno(
                        egreso.fecha
                    )
                );
            }
        );


        const anosOrdenados =
            Array.from(anos)
                .sort(
                    function (a, b) {

                        return b - a;
                    }
                );


        selector.innerHTML =
            "";


        anosOrdenados.forEach(
            function (ano) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    String(
                        ano
                    );


                opcion.textContent =
                    String(
                        ano
                    );


                selector.appendChild(
                    opcion
                );
            }
        );


        const guardado =
            Number(
                localStorage.getItem(
                    ANO_KEY
                )
            );


        const anoSeleccionado =
            guardado &&
                anosOrdenados.includes(
                    guardado
                )
                ? guardado
                : anoActual;


        selector.value =
            String(
                anoSeleccionado
            );


        localStorage.setItem(
            ANO_KEY,
            String(
                anoSeleccionado
            )
        );
    }


    /* =====================================================
       SELECTOR DE AÑO
    ===================================================== */

    const selectorAño =
        document.getElementById(
            "selectorAño"
        );


    if (selectorAño) {

        selectorAño.addEventListener(
            "change",
            function () {

                const ano =
                    Number(
                        selectorAño.value
                    );


                localStorage.setItem(
                    ANO_KEY,
                    String(
                        ano
                    )
                );


                actualizarDashboard();
            }
        );
    }


    /* =====================================================
       CERRAR MODAL EGRESO
       AL HACER CLICK FUERA
    ===================================================== */

    const modalEgreso =
        document.getElementById(
            "modalEgreso"
        );


    if (modalEgreso) {

        modalEgreso.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target !==
                    modalEgreso
                ) {
                    return;
                }


                window.cerrarModalEgreso();
            }
        );
    }


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    llenarSelectorAnios();

    cargarVentas();

    cargarIngresos();

    mostrarEgresos();

    cargarStock();

    actualizarDashboard();


    /* =====================================================
       EXPONER FUNCIONES
    ===================================================== */

    window.cargarStock =
        cargarStock;


    window.cargarVentas =
        cargarVentas;


    window.cargarIngresos =
        cargarIngresos;


    window.mostrarEgresos =
        mostrarEgresos;


    window.actualizarDashboard =
        actualizarDashboard;


    window.llenarSelectorAnios =
        llenarSelectorAnios;

});
