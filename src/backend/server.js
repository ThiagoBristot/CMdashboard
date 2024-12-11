// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require('bcryptjs');
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
    const { nomeCliente, CPFCliente, enderecoCliente, telefoneCliente, emailCliente } = req.body;
    const query = "INSERT INTO clientes (nomeCliente, CPFCliente, enderecoCliente, telefoneCliente, emailCliente) VALUES (?, ?, ?, ?, ?)";
    console.log('Requisição recebida:', req.body);
    db.query(query, [nomeCliente, CPFCliente, enderecoCliente, telefoneCliente, emailCliente ], (err, result) => {
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
    const { nomeTipoProduto, descricaoTipoProduto } = req.body;
    const query = "INSERT INTO tipoproduto (nomeTipoProduto, descricaoTipoProduto) VALUES (?, ?)";
    db.query(query, [nomeTipoProduto, descricaoTipoProduto], (err, result) => {
        if (err) {
            console.error("Erro ao adicionar tipo de produto:", err);
            res.status(500).json({ error: "Erro ao adicionar tipo de produto", details: err.message });
        } else {
            res.status(201).json({ 
                message: "Tipo de produto adicionado com sucesso", 
                id: result.insertId 
            });
        }
    });
});

// Rota para editar um tipo de produto
app.put("/tipoprodutos/:id", (req, res) => {
    const { id } = req.params;
    const { nomeTipoProduto, descricaoTipoProduto } = req.body;
    const query = "UPDATE tipoproduto SET nomeTipoProduto = ?, descricaoTipoProduto = ? WHERE idTipoProduto = ?";
    db.query(query, [nomeTipoProduto, descricaoTipoProduto, id], (err, result) => {
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

// Rota para listar todas as vendas com nomes de clientes e produtos
app.get("/vendas", (req, res) => {
    const query = `
        SELECT 
            v.idVenda,
            v.idCliente,
            c.nomeCliente AS nomeCliente,
            vp.idProduto,
            p.nomeProduto AS nomeProduto,
            vp.quantidade,
            vp.valorUnitario,
            v.dataVenda
        FROM vendas v
        INNER JOIN clientes c ON v.idCliente = c.idCliente
        INNER JOIN venda_produtos vp ON v.idVenda = vp.idVenda
        INNER JOIN produtos p ON vp.idProduto = p.idProduto
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar vendas:", err);
            res.status(500).send("Erro ao buscar vendas.");
            return;
        }

        // Processar os resultados para agrupar por venda
        const vendasMap = {};

        results.forEach((row) => {
            const {
                idVenda,
                idCliente,
                nomeCliente,
                idProduto,
                nomeProduto,
                quantidade,
                valorUnitario,
                dataVenda,
            } = row;

            // Se a venda ainda não foi adicionada ao mapa, inicializa
            if (!vendasMap[idVenda]) {
                vendasMap[idVenda] = {
                    idVenda,
                    idCliente,
                    nomeCliente,
                    produtos: [],
                    quantidadeTotal: 0,
                    valorTotal: 0,
                    dataVenda,
                };
            }

            // Adiciona o produto ao array de produtos
            vendasMap[idVenda].produtos.push({
                idProduto,
                nomeProduto,
                quantidade,
                valorUnitario,
            });

            // Atualiza a quantidade total e o valor total da venda
            vendasMap[idVenda].quantidadeTotal += quantidade;
            vendasMap[idVenda].valorTotal += quantidade * valorUnitario;
        });

        // Converte o mapa para um array de vendas
        const vendas = Object.values(vendasMap);

        res.json(vendas);
    });
});

// Rota para criar uma nova venda
app.post("/vendas/nova", (req, res) => {
    const { idCliente, produtos, dataVenda } = req.body;

    // Verifica se os dados básicos são válidos
    if (!idCliente || !Array.isArray(produtos) || produtos.length === 0 || !dataVenda) {
        return res.status(400).json({ message: "Dados inválidos." });
    }

    // Calcula o valor total da venda
    const valorVenda = produtos.reduce((total, produto) => {
        const valorUnitario = parseFloat(produto.valorUnitario) || 0; // Usa valorUnitario
        const quantidade = parseInt(produto.quantidade, 10) || 0;
        return total + (quantidade * valorUnitario);
    }, 0);

    // Insere a venda principal
    const queryVenda = `
        INSERT INTO vendas (idCliente, dataVenda, valorVenda)
        VALUES (?, ?, ?)
    `;

    db.query(queryVenda, [idCliente, dataVenda, valorVenda], (err, results) => {
        if (err) {
            console.error("Erro ao registrar venda:", err);
            return res.status(500).json({ message: "Erro ao registrar venda." });
        }

        // ID da venda recém-criada
        const idVenda = results.insertId;

        // Insere os produtos associados à venda
        const queryVendaProdutos = `
            INSERT INTO venda_produtos (idVenda, idProduto, quantidade, valorUnitario)
            VALUES ?
        `;

        // Prepara os valores para inserção em lote
        const valoresProdutos = produtos.map((produto) => [
            idVenda,
            produto.idProduto,
            produto.quantidade,
            produto.valorUnitario, // Usa o valor unitário correto
        ]);

        db.query(queryVendaProdutos, [valoresProdutos], (err) => {
            if (err) {
                console.error("Erro ao adicionar produtos à venda:", err);
                return res.status(500).json({ message: "Erro ao adicionar produtos à venda." });
            }

            // Atualiza o estoque de forma assíncrona
            const promises = produtos.map((produto) => {
                return new Promise((resolve, reject) => {
                    const queryEstoque = `
                        UPDATE produtos
                        SET estoque = estoque - ?
                        WHERE idProduto = ?
                    `;
                    db.query(queryEstoque, [produto.quantidade, produto.idProduto], (err) => {
                        if (err) {
                            console.error("Erro ao atualizar estoque:", err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Aguarda todas as atualizações do estoque
            Promise.all(promises)
                .then(() => {
                    res.status(201).json({ message: `Venda registrada com sucesso! ID: ${idVenda}` });
                })
                .catch(() => {
                    res.status(500).json({ message: "Venda registrada, mas houve um erro ao atualizar o estoque." });
                });
        });
    });
});

// Rota para registrar produtos da venda
app.post("/venda_produtos", (req, res) => {
    const produtos = req.body;  // Array de produtos da venda

    // Valida se a requisição possui dados de produtos
    if (!produtos || produtos.length === 0) {
        return res.status(400).json({ message: "Nenhum produto fornecido." });
    }

    // Para cada produto, vamos realizar a inserção na tabela `venda_produtos`
    const queries = produtos.map((produto) => {
        return new Promise((resolve, reject) => {
            const { idVenda, idProduto, quantidade, valorUnitario } = produto;

            // Comando SQL para inserir o produto na tabela `venda_produtos`
            const query = `
                INSERT INTO venda_produtos (idVenda, idProduto, quantidade, valorUnitario)
                VALUES (?, ?, ?, ?)
            `;

            db.query(query, [idVenda, idProduto, quantidade, valorUnitario], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    });

    // Aguarda todas as queries serem executadas antes de responder
    Promise.all(queries)
        .then(() => {
            res.status(201).json({ message: "Produtos registrados com sucesso!" });
        })
        .catch((error) => {
            console.error("Erro ao registrar produtos:", error);
            res.status(500).json({ message: "Erro ao registrar produtos da venda." });
        });
});

//rota para editar uma venda existente

app.put("/vendas/:idVenda", (req, res) => {
    const { idVenda } = req.params;
    const { idCliente, idProduto, quantidade, dataVenda, valorVenda } = req.body;

    const query = `
        UPDATE vendas
        SET idCliente = ?, idProduto = ?, quantidade = ?, dataVenda = ?, valorVenda = ?
        WHERE idVenda = ?`;

    db.query(query, [idCliente, idProduto, quantidade, dataVenda, valorVenda, idVenda], (err, results) => {
        if (err) {
            console.error("Erro ao editar venda:", err);
            res.status(500).send("Erro ao editar venda.");
        } else if (results.affectedRows === 0) {
            res.status(404).send("Venda não encontrada.");
        } else {
            res.send("Venda editada com sucesso!");
        }
    });
});

//rota para excluir uma venda

app.delete("/vendas/:idVenda", (req, res) => {
    const { idVenda } = req.params;

    const query = `DELETE FROM vendas WHERE idVenda = ?`;

    db.query(query, [idVenda], (err, results) => {
        if (err) {
            console.error("Erro ao excluir venda:", err);
            res.status(500).send("Erro ao excluir venda.");
        } else if (results.affectedRows === 0) {
            res.status(404).send("Venda não encontrada.");
        } else {
            res.send("Venda excluída com sucesso!");
        }
    });
});

// Rota para buscar dados de vendas
app.post('/sumvendas', (req, res) => {
    const { startMonth, endMonth } = req.body;

    // Validação dos parâmetros
    if (startMonth == null || endMonth == null) {
        return res.status(400).json({ error: "Parâmetros startMonth e endMonth são obrigatórios." });
    }

    // Consulta SQL
    const query = `
        SELECT 
            MONTH(datavenda) AS monthIndex,
            SUM(valorVenda) AS ganho
        FROM vendas
        WHERE MONTH(datavenda) BETWEEN ? AND ?
        GROUP BY MONTH(datavenda)
        ORDER BY monthIndex
    `;

    db.query(query, [Number(startMonth) + 1, Number(endMonth) + 1], (err, rows) => {
        if (err) {
            console.error("Erro ao executar a rota /sumvendas:", err);
            return res.status(500).json({ error: "Erro ao buscar dados financeiros." });
        }

        // Transformação dos dados
        const data = rows.map(row => ({
            monthIndex: row.monthIndex - 1,
            month: new Date(0, row.monthIndex - 1).toLocaleString('pt-BR', { month: 'short' }),
            ganho: row.ganho || 0
        }));

        // Retorno da resposta
        res.json(data);
    });
});

// Rota para buscar dados de gastos
app.post('/sumgastos', (req, res) => {
    const { startMonth, endMonth } = req.body;

    // Validação dos parâmetros
    if (startMonth == null || endMonth == null) {
        return res.status(400).json({ error: "Parâmetros startMonth e endMonth são obrigatórios." });
    }

    // Consulta para obter os gastos no intervalo
    const query = `
        SELECT 
            MONTH(datacadastro) AS monthIndex,
            SUM(valorEntrada) AS gasto
        FROM produtos
        WHERE MONTH(datacadastro) BETWEEN ? AND ?
        GROUP BY MONTH(datacadastro)
        ORDER BY monthIndex
    `;

    db.query(query, [Number(startMonth) + 1, Number(endMonth) + 1], (err, rows) => {
        if (err) {
            console.error("Erro ao executar a rota /sumgastos:", err);
            return res.status(500).json({ error: "Erro ao buscar dados de gastos." });
        }

        const data = rows.map(row => ({
            monthIndex: row.monthIndex - 1,
            month: new Date(0, row.monthIndex - 1).toLocaleString('pt-BR', { month: 'short' }),
            gasto: row.gasto || 0
        }));

        res.json(data);
    });
});

// Endpoint para login
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;

    // Verifica se o usuário existe no banco
    const query = "SELECT * FROM cmusuario WHERE usuario = ?";
    db.query(query, [usuario], async (err, results) => {
        if (err) {
            return res.status(500).send("Erro ao buscar usuário.");
        }

        if (results.length === 0) {
            return res.status(401).send("Usuário não encontrado.");
        }

        const user = results[0];

        try {
            // Compara a senha enviada com o hash armazenado
            const match = await bcrypt.compare(senha, user.senhaHash);

            if (match) {
                // Atualiza o último login do usuário
                const updateQuery = "UPDATE cmusuario SET ultimoLogin = NOW() WHERE idUsuario = ?";
                db.query(updateQuery, [user.idUsuario], (err, result) => {
                    if (err) {
                        return res.status(500).send("Erro ao atualizar o último login.");
                    }

                    // Retorna o usuário e o cargo após login bem-sucedido
                    res.status(200).json({
                        message: "Login bem-sucedido!",
                        usuario: user.usuario,
                        cargo: user.cargo,
                    });
                });
            } else {
                res.status(401).send("Senha incorreta.");
            }
        } catch (err) {
            res.status(500).send("Erro ao verificar a senha.");
        }
    });
});

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
    const { usuario, senha, cargo } = req.body;
  
    // Verificar se todos os dados foram enviados
    if (!usuario || !senha || !cargo) {
      return res.status(400).send('Dados incompletos');
    }
  
    // Verificar se o usuário já existe
    db.query('SELECT * FROM cmusuario WHERE usuario = ?', [usuario], async (err, result) => {
      if (err) {
        return res.status(500).send('Erro ao verificar usuário');
      }
  
      if (result.length > 0) {
        return res.status(400).send('Usuário já existe');
      }
  
      // Criptografar a senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);
  
      // Inserir novo usuário no banco de dados
      const query = 'INSERT INTO cmusuario (usuario, senhaHash, cargo) VALUES (?, ?, ?)';
      db.query(query, [usuario, senhaHash, cargo], (err, result) => {
        if (err) {
          return res.status(500).send('Erro ao registrar usuário');
        }
  
        // Retornar a resposta com os dados do usuário
        res.status(201).json({ idUsuario: result.insertId, usuario, cargo });
      });
    });
  });

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
