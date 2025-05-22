const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const csvtojson = require('csvtojson');

async function convertFile(req, res) {
  const file = req.file;
  const targetFormat = req.body.targetFormat;

  if (!file || !targetFormat) {
    return res.status(400).json({ error: 'Arquivo e formato de destino são obrigatórios.' });
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;
  const fileNameWithoutExt = path.parse(file.originalname).name;
  const outputPath = path.join('converted', ${fileNameWithoutExt}.${targetFormat});

  try {
    let content;

    if (ext === '.xml') {
      const xml = fs.readFileSync(filePath);
      content = await xml2js.parseStringPromise(xml);
    } else if (ext === '.csv') {
      content = await csvtojson().fromFile(filePath);
    } else if (ext === '.json') {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else if (ext === '.txt') {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error('Formato de origem não suportado.');
    }

    // Conversão
    let convertedData;

    if (targetFormat === 'json') {
      convertedData = JSON.stringify(content, null, 2);
    } else if (targetFormat === 'xml') {
      const builder = new xml2js.Builder();
      convertedData = builder.buildObject(content);
    } else if (targetFormat === 'txt') {
      convertedData = typeof content === 'string' ? content : JSON.stringify(content);
    } else if (targetFormat === 'csv') {
      const array = Array.isArray(content) ? content : [content];
      const headers = Object.keys(array[0]).join(',');
      const rows = array.map(row => Object.values(row).join(',')).join('\n');
      convertedData = ${headers}\n${rows};
    } else {
      throw new Error('Formato de destino não suportado.');
    }

    fs.writeFileSync(outputPath, convertedData);

    res.download(outputPath, err => {
      if (err) console.error('Erro no download:', err);
      fs.unlinkSync(filePath); // limpa o upload
      // fs.unlinkSync(outputPath); // opcional: remove o convertido após download
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro na conversão do arquivo.' });
  }
}

module.exports = { convertFile };
