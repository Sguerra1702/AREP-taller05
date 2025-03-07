import DeleteModal from "../modals/DeleteModal.js";
import SuccessModal from "../modals/SuccessModal.js";

const deleteModal = new DeleteModal();
const successModal = new SuccessModal();
const apiUrl = `${window.location.origin}/properties`;


let allProperties = []; // Almacena todas las propiedades originales
let filteredProperties = []; // Almacena las propiedades filtradas
let currentFilters = {}; // Mantiene los filtros activos

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();

    // Evento para crear una propiedad
    document.getElementById("propertyForm").addEventListener("submit", createProperty);

    // Evento para aplicar filtros
    document.getElementById("searchButton").addEventListener("click", applyFilters);

    // Evento para resetear filtros
    document.getElementById("resetFilters").addEventListener("click", resetFilters);

    // Control de apertura y cierre de filtros
    setupFilterControls();
});

// ✅ Cargar propiedades desde la API
function loadProperties() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("❌ Respuesta no es un array de propiedades");
            }
            allProperties = data;
            filteredProperties = [...allProperties]; // Inicialmente, todas las propiedades están visibles
            renderProperties(filteredProperties);
        })
        .catch(error => {
            console.error("❌ Error cargando propiedades:", error);
            showNotification("❌ Error cargando propiedades", "error");
        });
}

// ✅ Renderizar la tabla de propiedades
function renderProperties(properties) {
    const tableBody = document.querySelector("#propertyTable tbody");
    tableBody.innerHTML = "";

    properties.forEach(prop => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${prop.address}</td>
            <td>${formatCurrency(prop.price)}</td>
            <td>${prop.size}</td>
            <td>${prop.description}</td>
            <td>
                <button class="delete-btn" data-id="${prop.id}" data-address="${prop.address}">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const address = this.getAttribute("data-address");
            showDeleteModal(id, address);
        });
    });
}

// ✅ Crear una propiedad
function createProperty(event) {
    event.preventDefault();

    const property = {
        address: document.getElementById("address").value,
        price: parseFloat(document.getElementById("price").value),
        size: parseFloat(document.getElementById("size").value),
        description: document.getElementById("description").value
    };

    fetch(`${apiUrl}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById("propertyForm").reset();
            showNotification("✅ Propiedad creada exitosamente", "success");
            loadProperties();
        })
        .catch(() => showNotification("❌ Error creando la propiedad", "error"));
}

// ✅ Eliminar una propiedad
function deleteProperty(id) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error();
            showNotification("✅ Propiedad eliminada", "success");
            successModal.show();
            loadProperties();
        })
        .catch(() => showNotification("❌ Error eliminando la propiedad", "error"));
}

// ✅ Aplicar filtros
function applyFilters() {
    const filterType = document.getElementById("filterType").value;
    const filterValue = document.getElementById("filterValue").value.trim();

    if (!filterValue) {
        showNotification("⚠️ Ingrese un valor para filtrar", "error");
        return;
    }

    currentFilters[filterType] = filterValue;
    filterProperties();
}

// ✅ Filtrar propiedades localmente
function filterProperties() {
    filteredProperties = allProperties.filter(prop => {
        return Object.keys(currentFilters).every(filter => {
            const value = currentFilters[filter];
            switch (filter) {
                case "address":
                    return prop.address.toLowerCase().includes(value.toLowerCase());
                case "minPrice":
                    return prop.price >= parseFloat(value);
                case "maxPrice":
                    return prop.price <= parseFloat(value);
                case "minSize":
                    return prop.size >= parseFloat(value);
                default:
                    return true;
            }
        });
    });

    renderProperties(filteredProperties);
}

// ✅ Resetear filtros
function resetFilters() {
    currentFilters = {};
    filteredProperties = [...allProperties];
    renderProperties(filteredProperties);
    document.getElementById("filterValue").value = "";
    showNotification("🔄 Filtros restablecidos", "success");
}

// ✅ Mostrar el modal de confirmación de eliminación
function showDeleteModal(id, address) {
    deleteModal.show(id, address);
}

deleteModal.setOnConfirm((id) => {
    deleteProperty(id);
});

// ✅ Configurar control de apertura y cierre de filtros
function setupFilterControls() {
    const filterSection = document.getElementById("filterSection");
    const toggleFilters = document.getElementById("toggleFilters");
    const closeFilters = document.getElementById("closeFilters");
    const overlay = document.getElementById("overlay");

    toggleFilters.addEventListener("click", () => {
        filterSection.classList.add("show");
        overlay.classList.add("show");
    });

    closeFilters.addEventListener("click", () => {
        filterSection.classList.remove("show");
        overlay.classList.remove("show");
    });

    overlay.addEventListener("click", () => {
        filterSection.classList.remove("show");
        overlay.classList.remove("show");
    });
}

// ✅ Notificaciones flotantes
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ✅ Formatear moneda
function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0
    }).format(value);
}
