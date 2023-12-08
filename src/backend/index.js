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

/*ADD DEVICE*/
app.post("/addDevice", (req, res) => {
    console.log("Executing POST to add new device...");

    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).send("Name and description are required fields.");
    }

    const defaultState = req.body.state || 0;
    const defaultType = req.body.type || 0;
    const defaultImage = './static/images/iot.png'

    const query = 'INSERT INTO Devices (name, description, state, type, image_url) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [name, description, defaultState, defaultType, defaultImage], (err, results) => {
        if (err) {
            console.error('Error adding device:', err);
            return res.status(500).send('Internal Server Error');
        }

        const insertedId = results.insertId;
        res.status(200).send(`Device added successfully with ID: ${insertedId}`);
    });
});


/*REMOVE DEVICE*/
app.post("/removeDevice", (req, res) => {
    console.log("Executing POST to remove Device " + req.body.id);

    const deviceId = req.body.id;

    if (!deviceId) {
        return res.status(400).send("Device ID is required.");
    }

    const query = 'DELETE FROM Devices WHERE id = ?';

    connection.query(query, [deviceId], (err, results) => {
        if (err) {
            console.error('Error removing device:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows === 0) {
            return res.status(404).send('Device not found.');
        }

        res.status(200).send('Device removed successfully.');
    });
});


/*MODIFY DEVICE NAME AND DESCRIPTION*/
app.post("/modifyDevice", (req, res) => {
    console.log("Executing POST for Device: ", req.body.id);

    if (!req.body.id) {
        return res.status(400).send("Device ID is required.");
    }

    let query;

    if (req.body.name !== "") {
        query = `UPDATE Devices SET name = "${req.body.name}" WHERE id = ${req.body.id}`;
    } else if (req.body.description !== "") {
        query = `UPDATE Devices SET description = "${req.body.description}" WHERE id = ${req.body.id}`;
    } else {
        return res.status(409).send("Please provide either device name or description.");
    }

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error updating device:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows > 0) {
            res.status(200).send("Device updated successfully.");
        } else {
            res.status(404).send("Device not found.");
        }
    });
});

/*CHANGE DEVICE STATE*/
app.post("/changeDeviceState", (req,res) => {
    console.log("Executing POST for Device: ", req.body.id);

    if (!req.body.id) {
        return res.status(400).send("Device ID is required.");
    }

    let query;
    query = `UPDATE Devices SET state = ${req.body.state} WHERE id = ${req.body.id}`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error updating device:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.affectedRows > 0) {
            res.status(200).send("Device updated successfully.");
        } else {
            res.status(404).send("Device not found.");
        }
    });
})

/*GET DEVICE BY ID*/
app.get('/device/:id', (req, res) => {
    const deviceId = req.params.id;

    if (!deviceId) {
        return res.status(400).send('Device ID is missing.');
    }

    const query = 'SELECT * FROM Devices WHERE id = ?';
    console.log('Executing GET Device: ', deviceId);

    connection.query(query, [deviceId], (err, results) => {
        if (err) {
            console.error('Error querying smart_home.Devices:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('Device not found.');
        }

        res.json(results[0]);
    });
});

/*GET ALL DEVICES*/
app.get('/devices', (req, res) => {
    const query = 'SELECT * FROM Devices';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error querying smart_home.Devices:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('No devices found.');
        }

        res.json(results);
    });
});


app.listen(PORT, () => {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
