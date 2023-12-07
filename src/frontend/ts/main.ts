var M;

class Main implements EventListenerObject{
    private deviceData: Array<Device> = [];

    private createDeviceItem(d: Device): string {
        return`
        <li class="collection-item avatar">
            <div class="col s7">
                <img src="${d.image_url}" alt="N/A" class="circle">
                <span class="title">${d.name}</span>
                <p>${d.description}</p>
            </div>
            <div class="col s1">
                <a href="#modal-edit" id="edit_${d.id}" class="modal-trigger"><i class="material-icons small">edit</i></a>
            </div>
            <div class="col s3">
                <a href="#!" class="center valign-wrapper">
                    <div class="switch">
                        <label>Off
                        <input type="checkbox" deviceId="${d.id}" id="state_${d.id}" ${d.state ? 'checked' : ''} 
                        <span class="lever"></span>
                        On
                        </label>
                    </div>
                </a>
            </div>
            <div class="col s1">
                <a href="#modal-delete" id="delete_${d.id}" class="modal-trigger"><i class="material-icons small">delete_forever</i></a>
            </div>
        </li>`;
    }

    private modifyHTML() {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    let response = xmlRequest.responseText;
                    this.deviceData = JSON.parse(response);
                    let ulDevices = document.getElementById("deviceList");

                    for (let d of this.deviceData) {
                        ulDevices.innerHTML += this.createDeviceItem(d);
                    }

                } else {
                    console.log("Couldn't find any data at /devices");
                }
            }
        }

        xmlRequest.open("GET", "http://localhost:8000/devices", true)
        xmlRequest.send();
    }

    // private modifyHTML() {
    //     let xmlRequest = new XMLHttpRequest();
    //     xmlRequest.onreadystatechange = () => {
    //         if (xmlRequest.readyState == 4) {
    //             if(xmlRequest.status==200){  
    //                 let response = xmlRequest.responseText;
    //                 let deviceData: Array<Device> = JSON.parse(response);
    //                 let ulDevices = document.getElementById("deviceList"); 

    //                 for (let d of deviceData) {
    //                     let itemList =
    //                     `
    //                     <li class="collection-item avatar">
    //                         <div class="col s7">
    //                             <img src="${d.image_url}" alt="N/A" class="circle">
    //                             <span class="title">${d.name}</span>
    //                             <p>${d.description}</p>
    //                         </div>
    //                         <div class="col s1">
    //                             <a href="#modal-edit" class="modal-trigger"><i class="material-icons small">edit</i></a>
    //                         </div>
    //                         <div class="col s3">
    //                             <a href="#!" class="center valign-wrapper">
    //                                 <div class="switch">
    //                                     <label>
    //                                         Off
    //                                         <input type="checkbox"`;
    //                                         itemList +=`nuevoAtt="${d.id}" id="cb_${d.id}"`
    //                                         if (d.state) { itemList+= ` checked `}
    //                                         itemList += `>
    //                                         <span class="lever"></span>
    //                                         On
    //                                     </label>
    //                                 </div>
    //                             </a>
    //                         </div>
    //                         <div class="col s1">
    //                             <a href="#modal-delete" id="delete_${d.id}" class="modal-trigger"><i class="material-icons small">delete_forever</i></a>
    //                         </div>
    //                     </li>
    //                     `
    //                     ulDevices.innerHTML += itemList;
    //                 }

    //                 for (let d of deviceData) {
    //                     let checkbox = document.getElementById("cb_" + d.id);
    //                     checkbox.addEventListener("click", this);
    //                 }
                    
    //                 for (let d of deviceData) {
    //                     let deviceWarning = document.getElementById("deviceWarning");
    //                     let device = document.getElementById("delete_" + d.id);
    //                     device.addEventListener("click",this);
    //                     deviceWarning.innerHTML = `Are you sure you want to delete ${d.name}?`;
    //                 }

    //                 for (let d of deviceData) {
    //                     let deviceWarning2 = document.getElementById("deviceWarning2");
    //                     deviceWarning2.innerHTML = `You are modifying ${d.name}`;
    //                 }

    //                 for (let d of deviceData) {
    //                     let deviceNamePlaceholder = document.getElementById("deviceName") as HTMLInputElement;
    //                     deviceNamePlaceholder.placeholder = d.name;

    //                     let deviceDescPlaceholder = document.getElementById("deviceDescription") as HTMLInputElement;
    //                     deviceDescPlaceholder.placeholder = d.description;
    //                 }

    //             }else{
    //                 console.log("no encontre nada");
    //             }
    //         }
            
    //     }
    //     xmlRequest.open("GET","http://localhost:8000/devices",true)
    //     xmlRequest.send();
    // }

    private postChanges(id:number,state:boolean) {
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
        
        xmlRequest.open("POST", "http://localhost:8000/device", true)
        xmlRequest.setRequestHeader("Content-Type", "application/json");
        let s = {
            id: id,
            state: state   };
        xmlRequest.send(JSON.stringify(s));
    }

    public initGetDevices() {
        this.modifyHTML();
    }

    private findDeviceById(id: number): Device | undefined {
        return this.deviceData.find(device => device.id === id);
    }

    handleEvent(event: Event): void {
        let elemento = <HTMLElement>event.target;
    
        if (elemento.id.startsWith("cb_")) {
            let checkbox = <HTMLInputElement>elemento;
            console.log(checkbox.getAttribute("nuevoAtt"), checkbox.checked, elemento.id.substring(3, elemento.id.length));
    
            this.postChanges(parseInt(checkbox.getAttribute("deviceId")), checkbox.checked);
        } else if (elemento.id.startsWith("delete_")) {
            let deviceId = parseInt(elemento.id.substring(7)); // Extract device ID from element ID
            let device = this.findDeviceById(deviceId);
    
            let deviceWarning = document.getElementById("deviceWarning");
            deviceWarning.innerHTML = `Are you sure you want to delete ${device.name}?`;

            let deleteModal = M.Modal.getInstance(document.getElementById("modal-delete"));
            deleteModal.open();

        } else if (elemento.id.startsWith("edit_")) {
            let deviceId = parseInt(elemento.id.substring(7)); // Extract device ID from element ID
            let device = this.findDeviceById(deviceId);
            let deviceWarning = document.getElementById("deviceWarning2");
            
            deviceWarning.innerHTML = `You are modifying ${device.name}`;
    
                // Trigger your modal opening logic here
                // For example, if you have a modal with ID "deleteModal", you can do:
                // $('#deleteModal').modal('open');

            let deviceNamePlaceholder = document.getElementById("deviceName") as HTMLInputElement;
            let deviceDescPlaceholder = document.getElementById("deviceDescription") as HTMLInputElement;
            deviceNamePlaceholder.placeholder = device.name;
            deviceDescPlaceholder.placeholder = device.description;
        }
    }
}

    
window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, "");

    let main1: Main = new Main();

    main1.initGetDevices();

    let checkbox = document.getElementById("cb");
    checkbox.addEventListener("click", main1);
});

