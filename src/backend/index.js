//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var cors = require("cors");
var corsOptions = {origin:"*",optionSuccessStatus:200};


var app     = express();
app.use(cors(corsOptions));

var connection   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.get("/otraCosa/:id/:algo",(req,res,next)=>{
    console.log("id",req.params.id)
    console.log("algo",req.params.algo)
    connection.query("select * from Devices where id="+req.params.id,(err,rsp,fields)=>{
        if(err==null){
            
            console.log("rsp",rsp);
            res.status(200).send(JSON.stringify(rsp));
        }else{
            console.log("err",err);
            res.status(409).send(err);
        }
        
        //console.log(fields);
    });
    
});

app.post("/addDevice", (req,res) => {
    console.log("Agregando nuevo dispositivo...")
    console.log("Nuevo dispositivo agregado")
})

app.post("/removeDevice", (req,res) => {
    console.log("Eliminando dispositivo...")
    console.log("Dispositivo eliminado")
})

app.post("/modifyDevice",(req,res)=>{
    console.log("Llego el post",
    "UPDATE Devices SET state = "+req.body.state+" WHERE id = "+req.body.id);
    if(req.body.name==""){
        res.status(409).send("no tengo nada que hacer");
    }else{
        res.status(200).send("se guardo el dispositivo");
    }
    
});

app.post("/changeDeviceState", (req,res) => {
    console.log("Cambiando estado de dispositivo...")
    console.log("Estado actualizado")    
})

app.get('/devices', (req, res) => {
    const query = 'SELECT * FROM Devices';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying devices:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
