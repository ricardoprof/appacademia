const express = require('express');
const app = express();
const multer = require('multer'); // para lidar com o upload de arquivos

// Configuração do multer para armazenar arquivos no servidor
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './dash/images/aluno'); // substitua com o caminho correto no seu servidor
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // salva o arquivo com o nome original
  }
});
const upload = multer({ storage: storage });

// Endpoint para lidar com o upload de imagens
app.post('/upload', upload.single('imagem'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Nenhuma imagem enviada');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

// Endpoint para lidar com a atualização de imagens
app.patch('/atualizar-imagem', (req, res) => {
  // Lógica para atualizar a imagem no diretório
  // Receba os dados da nova imagem e faça as alterações necessárias no servidor
  res.send('Imagem atualizada com sucesso');
});

// Inicializa o servidor na porta desejada
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
