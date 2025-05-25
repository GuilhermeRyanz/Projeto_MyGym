class CustomTableInfo:
    Base = """
    Tabela: academia
    - id: inteiro, chave primária
    - nome: texto
    - endereco: texto
    - telefone: texto
    - email: texto

    Tabela: aluno
    - id: inteiro, chave primária
    - nome: texto
    - telefone: texto
    - email: texto
    - matricula: texto
    - data_nascimento: data

    Tabela: frequencia
    - id: inteiro, chave primária
    - aluno_id: inteiro, chave estrangeira para aluno.id
    - academia_id: inteiro, chave estrangeira para academia.id
    - data_frequencia: data

    Tabela: plano
    - id: inteiro, chave primária
    - nome: texto
    - preco: decimal
    - descricao: texto
    - duracao: inteiro
    - dias_permitidos: texto
    - desconto: decimal
    - beneficios: texto
    - academia_id: inteiro, chave estrangeira para academia.id

    Tabela: aluno_plano
    - id: inteiro, chave primária
    - aluno_id: inteiro, chave estrangeira para aluno.id
    - plano_id: inteiro, chave estrangeira para plano.id
    - data_vencimento: data

    Tabela: pagamento
    - id: inteiro, chave primária
    - aluno_plano_id: inteiro, chave estrangeira para aluno_plano.id
    - valor_pago: decimal
    - data_pagamento: data
    - data_vencimento: data
    - tipo_pagamento: texto

    Tabela: produto
    - id: inteiro, chave primária
    - nome: texto
    - descricao: texto
    - preco: decimal
    - validade: data
    - quantidade_estoque: inteiro
    - academia_id: inteiro, chave estrangeira para academia.id

    Tabela: lote_produto
    - id: inteiro, chave primária
    - produto_id: inteiro, chave estrangeira para produto.id
    - quantidade: inteiro
    - data_validade: data

    Tabela: venda
    - id: inteiro, chave primária
    - aluno_id: inteiro, chave estrangeira para aluno.id
    - academia_id: inteiro, chave estrangeira para academia.id
    - usuario_id: inteiro, chave estrangeira para usuario.id
    - data_venda: data
    - valor_total: decimal

    Tabela: item_venda
    - id: inteiro, chave primária
    - venda_id: inteiro, chave estrangeira para venda.id
    - produto_id: inteiro, chave estrangeira para produto.id
    - quantidade: inteiro
    - preco_unitario: decimal

    Tabela: usuario
    - id: inteiro, chave primária
    - nome: texto
    - email: texto
    - senha: texto
    - tipo: texto

    Tabela: usuario_academia
    - id: inteiro, chave primária
    - usuario_id: inteiro, chave estrangeira para usuario.id
    - academia_id: inteiro, chave estrangeira para academia.id
    - funcao: texto

    as unicas tabelas que se relacionem com academias diretamente são:
    plano,
    frequencia,
    usuario_academia,
    venda,
    produto,

    Exemplo de consulta:

    SELECT "aluno".nome, "pagamento".data_pagamento
    FROM "aluno"
    INNER JOIN "aluno_plano" ON "aluno".id = "aluno_plano".aluno
    INNER JOIN "pagamento" ON "aluno_plano".id = "pagamento".aluno_plano
    INNER JOIN "plano" ON "aluno_plano".plano = "plano".id
    INNER JOIN "academia" ON "plano".academia = "academia".id
    WHERE "academia".id = 1
    ORDER BY "pagamento".data_pagamento DESC
    LIMIT 1;

    """