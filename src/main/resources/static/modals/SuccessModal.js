export default class SuccessModal {
    constructor() {
        this.modal = document.createElement("div");
        this.modal.classList.add("modal-overlay");
        this.modal.innerHTML = `
            <div class="modal">
                <h3>✅ Propiedad eliminada con éxito</h3>
                <p>La propiedad ha sido eliminada correctamente.</p>
                <button class="ok-btn">Aceptar</button>
            </div>
        `;

        document.body.appendChild(this.modal);
        this.okButton = this.modal.querySelector(".ok-btn");

        this.modal.style.display = "none";

        this.okButton.addEventListener("click", () => this.hide());
    }

    show() {
        this.modal.style.display = "flex";
        document.body.classList.add("modal-open");
    }

    hide() {
        this.modal.style.display = "none";
        document.body.classList.remove("modal-open");
    }
}
