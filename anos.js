document.addEventListener("DOMContentLoaded", function () {

    const selector = document.getElementById("selectorAño");

    if (!selector) return;

    const ANO_INICIAL = 2026;
    const CANTIDAD_ANOS = 42;

    selector.innerHTML = "";

    for (let i = 0; i < CANTIDAD_ANOS; i++) {

        const ano = ANO_INICIAL + i;

        const option = document.createElement("option");

        option.value = ano;
        option.textContent = ano;

        selector.appendChild(option);
    }

    // Año seleccionado anteriormente
    const guardado = Number(
        localStorage.getItem("dlLuxuryAñoSeleccionado")
    );

    // Si existe un año guardado y está dentro del rango
    if (
        Number.isInteger(guardado) &&
        guardado >= ANO_INICIAL &&
        guardado <= ANO_INICIAL + CANTIDAD_ANOS - 1
    ) {

        selector.value = guardado;

    } else {

        // Por defecto 2026
        selector.value = ANO_INICIAL;

        localStorage.setItem(
            "dlLuxuryAñoSeleccionado",
            ANO_INICIAL
        );
    }

    // Cuando cambie el año
    selector.addEventListener("change", function () {

        const anoSeleccionado = Number(this.value);

        localStorage.setItem(
            "dlLuxuryAñoSeleccionado",
            anoSeleccionado
        );

        // Avisar al admin.js que cambió el año
        document.dispatchEvent(
            new CustomEvent("añoDashboardCambiado", {
                detail: {
                    año: anoSeleccionado
                }
            })
        );

    });

});