var M;

class Main implements EventListenerObject{
    private deviceData: Array<Device> = [];

    public initialize() {
        this.modifyDevicesHTML()
    }

    private modifyDevicesHTML() {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    let response = xmlRequest.responseText;
                    this.deviceData = JSON.parse(response);
                    let ulDevices = document.getElementById("deviceList");

                    for (let d of this.deviceData) {
                        ulDevices.innerHTML += this.createDevicesItems(d);
                    }

                    for (let d of this.deviceData) {
                        let deleteButton = document.getElementById("delete_" + d.id);
                        let state = document.getElementById("state_" + d.id);
                        let editButton = document.getElementById("edit_"+ d.id);                  

                        deleteButton.addEventListener("click", this);
                        state.addEventListener("click", this);
                        editButton.addEventListener("click",this); 
                    }
                } else {
                    console.log("Couldn't find any data at /devices");
                }
            }
        }

        xmlRequest.open("GET", "http://localhost:8000/devices", true)
        xmlRequest.send();
    }

    private createDevicesItems(d: Device): string {
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
                <a href="#modal-edit" class="btn-floating modal-trigger" id="edit_${d.id}"><i class="material-icons small">edit</i></a>
            </div>
            <div class="col s4">
                <a href="#!" class="center valign-wrapper">
                    ${typeSwitch}
                </a>
            </div>
            <div class="col s1">
                <a class="btn-floating" id="delete_${d.id}" deviceId="${d.id}"><i class="material-icons small">delete_forever</i></a>
            </div>
        </li>`;
    }

    private deleteDevice (id: number) {
        let xmlRequest = new XMLHttpRequest();
    
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("Device deleted successfully",xmlRequest.responseText);   
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

    private addDevice (): void {
        console.log("submitAddDevice called");
        let nameInput = <HTMLInputElement> document.getElementById("deviceNameAdd");
        let descriptionInput = <HTMLInputElement> document.getElementById("deviceDescriptionAdd");
    
        let saveButton = document.getElementById("saveButtonAdd");
        saveButton.addEventListener("click", this);

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
    
        xmlRequest.open("POST", "http://localhost:8000/addDevice", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            name: nameInput.value,
            description: descriptionInput.value
        };
        xmlRequest.send(JSON.stringify(s));
    }

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

    private modifyDevice (id:number) {
        let nameInput = <HTMLInputElement> document.getElementById("deviceNameModify");
        let descriptionInput = <HTMLInputElement> document.getElementById("deviceDescriptionModify");
        
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
    
        xmlRequest.open("POST", "http://localhost:8000/modifyDevice", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            id:id,
            name: nameInput.value,
            description: descriptionInput.value
        };
        xmlRequest.send(JSON.stringify(s));
    }

    handleEvent(object: Event): void {
        let element = <HTMLElement>object.target;

        if (element.id.startsWith("delete_")) {
            let deviceId = parseInt(element.getAttribute("deviceId"));
            console.log(deviceId);
            this.deleteDevice(deviceId);
        } else if ("saveButtonAdd" == element.id) {
            this.addDevice()
        } else if (element.id.startsWith("state_")) {
            let deviceId = parseInt(element.getAttribute("deviceId"));
            let stateInput = <HTMLInputElement>element;
            let state = stateInput.checked ? 1 : 0;
            console.log(deviceId, state);
            this.changeDeviceState(deviceId, state);
        } else if (element.id.startsWith("edit_")) {
            let device = this.deviceData.find(
                (d) => d.id === Number(element.id.split("_")[1])
            );
            let editDeviceDiv = document.getElementById("editDevice");
            editDeviceDiv.innerHTML = `
            <div class="row">
                <form class="col s12">
                    <div class="row">
                        <div class="input-field col s6">
                            <p>Device name</p>
                            <input placeholder="" id="deviceNameModify" type="text" class="validate" value="${device.name}">
                        </div>
                        <div class="input-field col s6">
                            <p>Device description</p>
                            <input placeholder="" id="deviceDescriptionModify" type="text" value="${device.description}">
                        </div>
                    </div>
                    <a href="#!" id="saveButtonEdit" class="modal-close waves-effect waves-green btn-flat">Save</a>
                </form>
            </div>
            `

            let saveButtonEdit = document.getElementById("saveButtonEdit");
            saveButtonEdit.addEventListener("click",this);

            this.modifyDevice(device.id);
        }
    }
}

window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, "");

    let main: Main = new Main();

    main.initialize();

});


