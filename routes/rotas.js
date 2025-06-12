const express = require('express');
const multer = require('multer');
const path = require('path');
const { convertFile } = require('../controllers/Controllers.js');

const router = express.Router();

// Configuração do Multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Rota de conversão
router.post('/', upload.single('file'), convertFile);
