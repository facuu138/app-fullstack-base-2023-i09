var M;

class Main implements EventListenerObject{
    public usuarios: Array<Usuario> = new Array<Usuario>();

    private getDevices() {
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if(xmlRequest.status==200){  
                    let response = xmlRequest.responseText;
                    let datos: Array<Device> = JSON.parse(response);
                    
                    let ulDevices = document.getElementById("deviceList"); 

                    for (let d of datos) {
                        let itemList =
                        `
                        <li class="collection-item avatar">
                            <div class="col s7">
                                <img src="${d.image_url}" alt="N/A" class="circle">
                                <span class="title">${d.name}</span>
                                <p>${d.description}</p>
                            </div>
                            <div class="col s1">
                                <a href="#!"><i class="material-icons small">edit</i></a>
                            </div>
                            <div class="col s3">
                                <a href="#!" class="center valign-wrapper">
                                    <div class="switch">
                                        <label>
                                            Off
                                            <input type="checkbox"`;
                                            itemList +=`nuevoAtt="${d.id}" id="cb_${d.id}"`
                                            if (d.state) { itemList+= ` checked `}
                                            itemList += `>
                                            <span class="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </a>
                            </div>
                            <div class="col s1">
                                <a href="#!"><i class="material-icons small">delete_forever</i></a>
                            </div>
                        </li>
                        `
                        ulDevices.innerHTML += itemList;
                    }
                    for (let d of datos) {
                        let checkbox = document.getElementById("cb_" + d.id);
                        checkbox.addEventListener("click", this);
                    }

                }else{
                    console.log("no encontre nada");
                }
            }
            
        }
        xmlRequest.open("GET","http://localhost:8000/devices",true)
        xmlRequest.send();
    }

    private ejecutarPost(id:number,state:boolean) {
        let xmlRequest = new XMLHttpRequest();

        xmlRequest.onreadystatechange = () => {
            if (xmlRequest.readyState == 4) {
                if (xmlRequest.status == 200) {
                    console.log("llego resputa",xmlRequest.responseText);        
                } else {
                    alert("Salio mal la consulta");
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

    private cargarUsuario(): void{
        let iNombre =<HTMLInputElement> document.getElementById("iNombre");
        let iPassword = <HTMLInputElement>document.getElementById("iPassword");
        let pInfo = document.getElementById("pInfo");
        if (iNombre.value.length > 3 && iPassword.value.length > 3) {
            let usuari1: Usuario = new Usuario(iNombre.value, "user", iPassword.value,23);
            this.usuarios.push(usuari1);
            iNombre.value = "";
            iPassword.value = "";
           
            
            pInfo.innerHTML = "Se cargo correctamente!";
            pInfo.className ="textoCorrecto";
            
        } else {
            pInfo.innerHTML = "Usuairo o contraseña incorrecta!!!";
            pInfo.className ="textoError";
        }
        
        
    }

    public initGetDevices() {
        this.getDevices();
    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement>object.target;
        
        if ("btnListar" == elemento.id) {
            this.getDevices();

            
        } else if ("btnGuardar" == elemento.id) {
            this.cargarUsuario();
        } else if (elemento.id.startsWith("cb_")) {
            let checkbox = <HTMLInputElement>elemento;
            console.log(checkbox.getAttribute("nuevoAtt"),checkbox.checked, elemento.id.substring(3, elemento.id.length));
            
            this.ejecutarPost(parseInt(checkbox.getAttribute("nuevoAtt")),checkbox.checked);
        }

    }

}

    
window.addEventListener("load", () => {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, "");

    let main1: Main = new Main();
    let boton = document.getElementById("btnListar");

    main1.initGetDevices();

    let botonGuardar = document.getElementById("btnGuardar");
    botonGuardar.addEventListener("click",main1);

    let checkbox = document.getElementById("cb");
    checkbox.addEventListener("click", main1);
});

