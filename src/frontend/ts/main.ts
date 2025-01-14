// Declare a variable M (assuming it's a reference to a Materialize object)
var M;

// Define a class named Main that implements the EventListenerObject interface
class Main implements EventListenerObject {
    // Array to store device data
    private deviceData: Array<Device> = [];

    // Method to initialize the application
    public initialize() {
        this.modifyDevicesHTML();
    }

    // Method to fetch and display device data from the server
    private modifyDevicesHTML() {
        // Create a new XMLHttpRequest object
        let xmlRequest = new XMLHttpRequest();

        // Define the callback function for the asynchronous request
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    // Parse the JSON response and update deviceData array
                    let response = xmlRequest.responseText;
                    this.deviceData = JSON.parse(response);

                    // Update the HTML to display devices
                    let ulDevices = document.getElementById("deviceList");
                    for (let d of this.deviceData) {
                        ulDevices.innerHTML += this.createDevicesItems(d);
                    }

                    // Attach event listeners to delete, edit, and state buttons
                    for (let d of this.deviceData) {
                        let deleteButton = document.getElementById("delete_" + d.id);
                        let state = document.getElementById("state_" + d.id);
                        let editButton = document.getElementById("edit_" + d.id);

                        deleteButton.addEventListener("click", this);
                        state.addEventListener("click", this);
                        editButton.addEventListener("click", this);
                    }
                } else {
                    console.log("Couldn't find any data at /devices");
                }
            }
        };

        // Open and send the GET request to the server
        xmlRequest.open("GET", "http://localhost:8000/devices", true);
        xmlRequest.send();
    }

    // Method to create HTML representation of a device item
    private createDevicesItems(d: Device): string {
        // Generate the HTML for the device item
        let state = d.state ? 'checked' : '';

        let typeSwitch = `
        <div class="switch">
            <label>Off
            <input ${state} type="checkbox" deviceId="${d.id}" id="state_${d.id}"> 
            <span class="lever"></span>
            On
            </label>
        </div>`
        
        return `
        <li class="collection-item avatar">
            <div class="col s5">
                <img src="${d.image_url}" alt="N/A" class="circle">
                <span class="title">${d.name}</span>
                <p>${d.description}</p>
            </div>
            <div class="col s2">
                <a href="#modal-edit" class="btn-floating modal-trigger"><i id="edit_${d.id}" class="material-icons small">edit</i></a>
            </div>
            <div class="col s4">
                <a href="#!" class="center valign-wrapper">
                    ${typeSwitch}
                </a>
            </div>
            <div class="col s1">
                <a class="btn-floating"><i id="delete_${d.id}" deviceId="${d.id}" class="material-icons small">delete_forever</i></a>
            </div>
        </li>`;
    }

    // Method to delete a device by sending a request to the server
    private deleteDevice (id: number) {
        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("Device deleted successfully",xmlRequest.responseText);   
                    location.reload();
                } else {
                    alert("Something went wrong");
                }
            }
        }
    
        xmlRequest.open("POST", "http://localhost:8000/removeDevice", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {id: id};
        xmlRequest.send(JSON.stringify(s));
    
    }

    // Method to add a new device by sending a request to the server
    private addDevice (name: string, description:string): void {
        console.log("submitAddDevice called");

        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("Status 200",xmlRequest.responseText);
                    location.reload();
                } else {
                    alert("Something went wrong");
                    location.reload();
                }
            }
        }
    
        xmlRequest.open("POST", "http://localhost:8000/addDevice", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            name: name,
            description: description
        };
        xmlRequest.send(JSON.stringify(s));
    }

    // Method to change the state of a device by sending a request to the server
    private changeDeviceState (id:number,state:number) {
        console.log("changeDeviceState called");
        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("Status 200",xmlRequest.responseText);    
                } else {
                    alert("Something went wrong");
                }
            }
        }
    
        xmlRequest.open("POST", "http://localhost:8000/changeDeviceState", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            id:id,
            state:state
        };
        xmlRequest.send(JSON.stringify(s));
    }

    // Method to modify the details of a device by sending a request to the server
    private modifyDevice (id:number, name:string, description:string) {
        
        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("Status 200",xmlRequest.responseText);
                    location.reload();
                } else {
                    alert("Something went wrong");
                }
            }
        }
    
        xmlRequest.open("POST", "http://localhost:8000/modifyDevice", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            id:id,
            name: name,
            description: description
        };
        xmlRequest.send(JSON.stringify(s));
    }

    // Event handling method for various button clicks
    handleEvent(object: Event): void {
        let element = <HTMLElement>object.target;

        if (element.id.startsWith("delete_")) {
            let deviceId = parseInt(element.getAttribute("deviceId"));
            console.log(deviceId);
            this.deleteDevice(deviceId);
        } else if ("saveButtonAdd" == element.id) {
            console.log("Save Button Clicked");
            let nameInput = <HTMLInputElement> document.getElementById("deviceNameAdd");
            let descriptionInput = <HTMLInputElement> document.getElementById("deviceDescriptionAdd");
            this.addDevice(nameInput.value,descriptionInput.value);
        } else if (element.id.startsWith("state_")) {
            let deviceId = parseInt(element.getAttribute("deviceId"));
            let stateInput = <HTMLInputElement>element;
            let state = stateInput.checked ? 1 : 0;
            console.log(deviceId, state);
            this.changeDeviceState(deviceId, state);
        } else if (element.id.startsWith("saveButtonEdit")) {
            let deviceId = parseInt(element.getAttribute("deviceId"));
            let nameInput = <HTMLInputElement> document.getElementById("deviceNameModify");
            let descriptionInput = <HTMLInputElement> document.getElementById("deviceDescriptionModify");
            this.modifyDevice(deviceId,nameInput.value,descriptionInput.value);
        } else if (element.id.startsWith("edit_")) {
            const d = this.deviceData.find((d) => d.id === Number(element.id.split("_")[1]));
            let editDeviceDiv = document.getElementById("editDevice");
            editDeviceDiv.innerHTML = `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <p>Device name</p>
                            <input placeholder="" id="deviceNameModify" type="text" class="validate" value="${d.name}">
                        </div>
                        <div class="input-field col s6">
                            <p>Device description</p>
                            <input placeholder="" id="deviceDescriptionModify" type="text" value="${d.description}">
                        </div>
                    </div>
                    <button id="saveButtonEdit" deviceId="${d.id}" class="modal-close waves-effect waves-green btn-flat">Save</button>
                </form>
            </div>
            `

            let saveButtonEdit = document.getElementById("saveButtonEdit");
            saveButtonEdit.addEventListener("click",this);
        } 
    }
}

// Log a message when the script is loaded
console.log("Script loaded");

// Execute code when the window is fully loaded
window.addEventListener("load", () => {
    // Initialize Materialize components
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, "");

    // Create an instance of the Main class
    let main: Main = new Main();

    // Log a message and initialize the application
    console.log("Main instance created");
    main.initialize();

    // Add a click event listener to the "Save" button for adding a device
    let addButtonEdit = document.getElementById("saveButtonAdd");
    addButtonEdit.addEventListener("click", main);
});