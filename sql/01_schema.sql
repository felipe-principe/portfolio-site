-- =====================================================================
-- Central de Atendimento · modelo estrela em SQL
-- Mesmo modelo do dashboard Power BI: 3 tabelas fato e 5 dimensões.
-- Sintaxe MySQL 8 (também roda no DuckDB, usado para gerar os resultados do site).
-- Campos Sim/Nao ficam como texto, igual aos arquivos de origem.
-- =====================================================================

CREATE TABLE dim_data (
    data             DATE PRIMARY KEY,
    ano              INT NOT NULL,
    mes              INT NOT NULL,
    nome_mes         VARCHAR(20) NOT NULL,
    trimestre        VARCHAR(2) NOT NULL,
    dia              INT NOT NULL,
    nome_dia_semana  VARCHAR(20) NOT NULL,
    fim_de_semana    VARCHAR(3) NOT NULL,
    feriado          VARCHAR(3) NOT NULL,
    nome_feriado     VARCHAR(60)
);

CREATE TABLE dim_canal (
    id_canal                VARCHAR(10) PRIMARY KEY,
    nome_canal              VARCHAR(20) NOT NULL,
    tipo_canal              VARCHAR(20) NOT NULL,
    meta_sla_min            INT NOT NULL,          -- tempo máximo de resolução
    meta_nivel_servico_seg  INT NOT NULL,          -- tempo máximo de espera na fila
    meta_nivel_servico_pct  DECIMAL(5,2) NOT NULL
);

CREATE TABLE dim_agente (
    id_agente         VARCHAR(10) PRIMARY KEY,
    usuario           VARCHAR(60) NOT NULL,
    nome_agente       VARCHAR(80) NOT NULL,
    supervisor        VARCHAR(80) NOT NULL,        -- cada supervisor lidera uma equipe
    turno             VARCHAR(10) NOT NULL,
    data_contratacao  DATE NOT NULL
);

CREATE TABLE dim_cliente (
    id_cliente       VARCHAR(12) PRIMARY KEY,
    plano            VARCHAR(40) NOT NULL,
    regiao           VARCHAR(20) NOT NULL,
    pais             VARCHAR(30) NOT NULL,
    data_assinatura  DATE NOT NULL
);

CREATE TABLE dim_motivo (
    id_motivo     VARCHAR(10) PRIMARY KEY,
    categoria     VARCHAR(60) NOT NULL,
    subcategoria  VARCHAR(80) NOT NULL
);

-- Um registro por chamado atendido.
CREATE TABLE fato_chamados (
    id_chamado              VARCHAR(12) PRIMARY KEY,
    data_abertura           DATETIME NOT NULL,
    data_fechamento         DATETIME,
    id_cliente              VARCHAR(12) NOT NULL,
    id_agente               VARCHAR(10) NOT NULL,
    id_canal                VARCHAR(10) NOT NULL,
    id_motivo               VARCHAR(10) NOT NULL,
    duracao_min             DECIMAL(6,1) NOT NULL,
    sla_cumprido            VARCHAR(3) NOT NULL,   -- 'Sim' / 'Nao'
    tempo_espera_seg        DECIMAL(7,1) NOT NULL,
    nivel_servico_cumprido  VARCHAR(3) NOT NULL,
    pesquisa_respondida     VARCHAR(3) NOT NULL,
    nota_experiencia        INT,                   -- 1 a 5; vazio sem pesquisa
    problema_resolvido      VARCHAR(3),            -- vazio sem pesquisa
    reaberto                VARCHAR(3) NOT NULL,
    status_caso             VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES dim_cliente (id_cliente),
    FOREIGN KEY (id_agente)  REFERENCES dim_agente (id_agente),
    FOREIGN KEY (id_canal)   REFERENCES dim_canal (id_canal),
    FOREIGN KEY (id_motivo)  REFERENCES dim_motivo (id_motivo)
);

-- Um registro por contato que desistiu da fila.
CREATE TABLE fato_abandonos (
    id_abandono       VARCHAR(12) PRIMARY KEY,
    data_hora         DATETIME NOT NULL,
    id_canal          VARCHAR(10) NOT NULL,
    tempo_espera_seg  DECIMAL(7,1) NOT NULL,
    FOREIGN KEY (id_canal) REFERENCES dim_canal (id_canal)
);

-- Um registro por dia de escala de cada agente.
CREATE TABLE fato_escala (
    id_escala               VARCHAR(12) PRIMARY KEY,
    data                    DATE NOT NULL,
    id_agente               VARCHAR(10) NOT NULL,
    minutos_escalados       INT NOT NULL,
    falta                   VARCHAR(3) NOT NULL,   -- 'Sim' / 'Nao'
    tipo_ausencia           VARCHAR(30),
    minutos_aderentes       INT NOT NULL,
    minutos_base_aderencia  INT NOT NULL,
    FOREIGN KEY (id_agente) REFERENCES dim_agente (id_agente)
);
