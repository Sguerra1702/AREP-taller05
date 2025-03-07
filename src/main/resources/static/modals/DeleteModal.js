export default class DeleteModal {
    constructor() {
        this.modal = document.createElement("div");
        this.modal.classList.add("modal-overlay");
        this.modal.innerHTML = `
            <div class="modal">
                <h3>¿Estás seguro de eliminar esta propiedad?</h3>
                <p id="modal-address"></p>
                <div class="modal-buttons">
                    <button class="confirm-btn">Eliminar</button>
                    <button class="cancel-btn">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.confirmButton = this.modal.querySelector(".confirm-btn");
        this.cancelButton = this.modal.querySelector(".cancel-btn");

        this.modal.style.display = "none"; // Ocultamos por defecto

        this.cancelButton.addEventListener("click", () => this.hide());
        this.confirmButton.addEventListener("click", () => {
            if (this.onConfirm) this.onConfirm(this.propertyId);
            this.hide();
        });
    }

    show(id, address) {
        this.propertyId = id;
        document.getElementById("modal-address").innerText = `Dirección: ${address}`;
        this.modal.style.display = "flex";
        document.body.classList.add("modal-open"); // Activa el fondo difuminado
    }

    hide() {
        this.modal.style.display = "none";
        document.body.classList.remove("modal-open"); // Quita el efecto difuminado
    }

    setOnConfirm(callback) {
        this.onConfirm = callback;
    }
}
