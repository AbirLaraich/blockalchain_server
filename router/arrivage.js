const express = require('express');
const ArrivageController = require('../controller/arrivageControler');
const router = express.Router();
const fs = require('fs');

module.exports = () => {
      const arrivageController = new ArrivageController();

      router.post('/ancrage-arrivage', async (req, res) => {
            await arrivageController.controleurAncrage(req, res);
      });

      router.post('/write-file', async (req, res) => {
            try {
                  const data = req.body.data;
                  const filename = req.body.filename;

                  const directory = './';
                  const filePath = directory + filename;

                  let existingData = [];

                  if (fs.existsSync(filePath)) {
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        console.log('File content:', fileContent);

                        if (fileContent.trim() !== '') {
                              existingData = JSON.parse(fileContent);
                        }
                  }

                  const newData = Array.isArray(data) ? data : [data];

                  existingData.push(...newData);
                  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2)); // null, 2 for pretty printing

                  console.log(`Data has been appended successfully to ${filePath}`);
                  res.send('Data appended successfully');
            } catch (error) {
                  console.error('Error appending data:', error);
                  res.status(500).send('Error appending data');
            }
      });

      router.get('/data/:numLot', async (req, res) => {
            const numLot = req.params.numLot;
            console.log(numLot);
      });


      return router;
};
