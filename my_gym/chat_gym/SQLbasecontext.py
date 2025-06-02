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
    
    Tabela: gasto
    - id: inteiro, chave primaria
    - tipo: texto, choice:
    - descrcao: texto 

    Exemplo de consulta validas e funcionais:

    SELECT "aluno".nome, "pagamento".data_pagamento
    FROM "aluno"
    INNER JOIN "aluno_plano" ON "aluno".id = "aluno_plano".aluno
    INNER JOIN "pagamento" ON "aluno_plano".id = "pagamento".aluno_plano
    INNER JOIN "plano" ON "aluno_plano".plano = "plano".id
    INNER JOIN "academia" ON "plano".academia = "academia".id
    WHERE "academia".id = 1
    ORDER BY "pagamento".data_pagamento DESC
    LIMIT 1;
    
    SELECT AVG(total_ganhos) AS media_ganhos
    FROM (
      SELECT SUM("pagamento".valor) AS total_ganhos
      FROM "pagamento"
      INNER JOIN "aluno_plano" ON "pagamento".aluno_plano = "aluno_plano".id
      INNER JOIN "plano" ON "aluno_plano".plano = "plano".id
      INNER JOIN "academia" ON "plano".academia = "academia".id
      WHERE "academia".id = 2
        AND EXTRACT(MONTH FROM "pagamento".data_pagamento) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM "pagamento".data_pagamento) = EXTRACT(YEAR FROM CURRENT_DATE)
    ) AS subquery;
    
        SELECT 
        COALESCE(SUM(p.valor_pago), 0) AS total_mensalidades,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'aluno_plano__plano__nome', pl.nome,
                'total', COALESCE(SUM(p.valor_pago), 0)
            )
        ) AS detalhamento_mensalidades
        FROM pagamento p
        INNER JOIN aluno_plano ap ON p.aluno_plano_id = ap.id
        INNER JOIN plano pl ON ap.plano_id = pl.id
        INNER JOIN academia a ON pl.academia_id = a.id
        WHERE a.id = :academia_id
          AND EXTRACT(YEAR FROM p.data_pagamento) = :ano
          AND EXTRACT(MONTH FROM p.data_pagamento) = :mes
        GROUP BY pl.nome;
        
        SELECT 
        COALESCE(SUM(g.valor), 0) AS total_gastos,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'tipo', g.tipo,
                'total', COALESCE(SUM(g.valor), 0)
            )
        ) AS detalhamento_gastos
        FROM gasto g
        INNER JOIN academia a ON g.academia_id = a.id
        WHERE a.id = :academia_id
          AND EXTRACT(YEAR FROM g.data) = :ano
          AND EXTRACT(MONTH FROM g.data) = :mes
        GROUP BY g.tipo;
        
            SELECT 
        AVG(total_ganhos) AS media_ganhos_mensais
    FROM (
        SELECT 
            EXTRACT(YEAR FROM data_periodo) AS ano,
            EXTRACT(MONTH FROM data_periodo) AS mes,
            COALESCE(SUM(ganhos), 0) AS total_ganhos
        FROM (
            SELECT 
                p.data_pagamento AS data_periodo,
                p.valor_pago AS ganhos
            FROM pagamento p
            INNER JOIN aluno_plano ap ON p.aluno_plano_id = ap.id
            INNER JOIN plano pl ON ap.plano_id = pl.id
            INNER JOIN academia a ON pl.academia_id = a.id
            WHERE a.id = :academia_id
              AND p.data_pagamento >= CURRENT_DATE - INTERVAL '12 months'
            UNION ALL
            SELECT 
                v.data_venda AS data_periodo,
                iv.preco_unitario * iv.quantidade AS ganhos
            FROM item_venda iv
            INNER JOIN venda v ON iv.venda_id = v.id
            INNER JOIN academia a ON v.academia_id = a.id
            WHERE a.id = :academia_id
              AND v.data_venda >= CURRENT_DATE - INTERVAL '12 months'
        ) AS ganhos
        GROUP BY EXTRACT(YEAR FROM data_periodo), EXTRACT(MONTH FROM data_periodo)
    ) AS subquery;
    
    """
