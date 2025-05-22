const express = require('express');
const multer = require('multer');
const path = require('path');
const convertRoute = require('./routes/convert');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/upload', express.estatic('uploads'));
app.use('/converted', express.static('converted'));

app.use('/api/convert', convertRoutes);

app.get('/', (req, res) => {
res.send ('<h1>Fileconvertpro - api rodando<h1>')
));

app.listen(PORT, () => {
console.log('Servidor rodando em http:// localhost:${PORT}');
));

