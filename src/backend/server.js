// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
    origin: 'https://cm-dashboard-wine.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};


//app.use(cors(corsOptions));
app.use(cors());

app.use(bodyParser.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "CMdashboard",
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Conectado ao banco de dados MySQL");
    }
});

// Rota para obter todos os clientes
app.get("/clientes", (req, res) => {
    const query = "SELECT * FROM clientes";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Erro ao buscar clientes");
        } else {
            res.json(results);
        }
    });
});

// Rota para adicionar um cliente
app.post("/clientes", (req, res) => {
    const { nomeCliente, enderecoCliente, telefoneCliente, emailCliente } = req.body;
    const query = "INSERT INTO clientes (nomeCliente, enderecoCliente, telefoneCliente, emailCliente) VALUES (?, ?, ?, ?)";
    console.log('Requisição recebida:', req.body);
    db.query(query, [nomeCliente, enderecoCliente, telefoneCliente, emailCliente ], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao adicionar cliente");
        } else {
            res.json({ id: result.insertId, ...req.body });
        }
    });
});

// Rota para atualizar um cliente
app.put('/clientes/:id', async (req, res) => {
    const id = req.params.id;
    const { nomeCliente, enderecoCliente, telefoneCliente, emailCliente } = req.body;
    console.log('Requisição recebida:', req.body);

    // Verifique se todos os campos obrigatórios estão presentes
    if (!nomeCliente || !enderecoCliente || !telefoneCliente || !emailCliente) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    try {
        // Atualiza o cliente no banco de dados aqui
        const query = `
            UPDATE clientes 
            SET nomeCliente = ?, enderecoCliente = ?, telefoneCliente = ?, emailCliente = ? 
            WHERE idCliente = ?
        `;
        
        // Execute a query para atualizar o cliente
        db.query(query, [nomeCliente, enderecoCliente, telefoneCliente, emailCliente, id], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar cliente:', err);
                return res.status(500).send("Erro ao atualizar cliente");
            }
            
            // Verifica se o cliente foi encontrado e atualizado
            if (result.affectedRows === 0) {
                return res.status(404).send('Cliente não encontrado.');
            }

            res.status(200).send('Cliente atualizado com sucesso.');
        });

    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).send('Erro ao atualizar cliente.');
    }
});

// Rota para deletar um cliente
app.delete("/clientes/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM clientes WHERE idCliente = ?";
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).send("Erro ao deletar cliente");
        } else {
            res.send("Cliente deletado com sucesso");
        }
    });
});


// Endpoint para obter produtos com seus tipos
app.get('/produtos', (req, res) => {
    const sql = `
        SELECT 
            produtos.idProduto,
            produtos.nomeProduto, 
            produtos.descricaoProduto, 
            tipoProduto.nomeTipoProduto AS nomeTipoProduto, 
            produtos.valorEntrada, 
            produtos.valorSaida
        FROM produtos
        LEFT JOIN tipoProduto ON produtos.idTipoProduto = tipoProduto.idTipoProduto;
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ produtos: results });
    });
});

// Rota para listar os tipos de produto

app.get("/tipoprodutos", (req, res) => {
    const query = "SELECT * FROM tipoproduto";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send("Erro ao buscar tipos de produtos");
        } else {
            res.json(results);
        }
    });
});

// Rota para adicionar um tipo de produto
app.post("/tipoprodutos", (req, res) => {
    const { nomeTipoProduto } = req.body;
    const query = "INSERT INTO tipoproduto (nomeTipoProduto) VALUES (?)";
    db.query(query, [nomeTipoProduto], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao adicionar tipo de produto");
        } else {
            res.status(201).send("Tipo de produto adicionado com sucesso");
        }
    });
});

// Rota para editar um tipo de produto
app.put("/tipoprodutos/:id", (req, res) => {
    const { id } = req.params;
    const { nomeTipoProduto } = req.body;
    const query = "UPDATE tipoproduto SET nomeTipoProduto = ? WHERE idTipoProduto = ?";
    db.query(query, [nomeTipoProduto, id], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao editar tipo de produto");
        } else {
            res.status(200).send("Tipo de produto atualizado com sucesso");
        }
    });
});

// Rota para excluir um tipo de produto
app.delete("/tipoprodutos/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tipoproduto WHERE idTipoProduto = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao excluir tipo de produto");
        } else {
            res.status(200).send("Tipo de produto excluído com sucesso");
        }
    });
});

// Rota para adicionar um produto
app.post("/produtos", (req, res) => {
    const { nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida, numeroSerie } = req.body;
    const query = "INSERT INTO produtos (nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida, numeroSerie) VALUES (?, ?, ?, ?, ?, ?)";
    console.log('Requisição recebida:', req.body);
    db.query(query, [nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida, numeroSerie], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao adicionar produto");
        } else {
            res.json({ id: result.insertId, ...req.body });
        }
    });
});

// Rota para editar um produto
app.put("/produtos/:idProduto", (req, res) => {
    const { idProduto } = req.params;
    const { nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida } = req.body;

    const query = `
        UPDATE produtos 
        SET nomeProduto = ?, descricaoProduto = ?, idTipoProduto = ?, valorEntrada = ?, valorSaida = ?
        WHERE idProduto = ?`;

    db.query(query, [nomeProduto, descricaoProduto, idTipoProduto, valorEntrada, valorSaida, idProduto], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao editar produto");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Produto não encontrado");
        } else {
            res.send("Produto atualizado com sucesso");
        }
    });
});

// Rota para deletar um produto
app.delete("/produtos/:idProduto", (req, res) => {
    const { idProduto } = req.params;
    const query = "DELETE FROM produtos WHERE idProduto = ?";

    db.query(query, [idProduto], (err, result) => {
        if (err) {
            res.status(500).send("Erro ao deletar produto");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Produto não encontrado");
        } else {
            res.send("Produto deletado com sucesso");
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
