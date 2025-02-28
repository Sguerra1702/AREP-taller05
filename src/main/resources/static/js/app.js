const apiUrl = "http://localhost:8080/properties";

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
    document.getElementById("propertyForm").addEventListener("submit", createProperty);
});

function loadProperties() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(properties => {
            const tableBody = document.querySelector("#propertyTable tbody");
            tableBody.innerHTML = "";
            properties.forEach(prop => {
                let row = `
                    <tr>
                        <td>${prop.address}</td>
                        <td>${prop.price}</td>
                        <td>${prop.size}</td>
                        <td>${prop.description}</td>
                        <td>
                            <button onclick="deleteProperty(${prop.id})">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error loading properties:", error));
}

function createProperty(event) {
    event.preventDefault();

    const property = {
        address: document.getElementById("address").value,
        price: parseFloat(document.getElementById("price").value),
        size: parseFloat(document.getElementById("size").value),
        description: document.getElementById("description").value
    };

    fetch(apiUrl + "/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById("propertyForm").reset();
            loadProperties();
        })
        .catch(error => console.error("Error creating property:", error));
}

function deleteProperty(id) {
    fetch(`${apiUrl}/delete/${id}`, { method: "DELETE" })
        .then(() => loadProperties())
        .catch(error => console.error("Error deleting property:", error));
}
