# Watchlist: Tracker de Filmes

![CI](https://github.com/ventosincaos/Watchlist-tracker/actions/workflows/ci.yml/badge.svg)
![Python](https://img.shields.io/badge/python-3.12-blue)
![Flask](https://img.shields.io/badge/flask-3.x-lightgrey)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## O Problema

As soluções disponíveis para manter registro de filmes são plataformas sociais completas, que exigem cadastro, conexão com internet e armazenam dados em servidores de terceiros. 
Para quem quer apenas um diário cinematográfico simples, local e privado, essas plataformas oferecem muito mais do que o necessário.

## A Solução

O **Watchlist Tracker** é uma aplicação web que roda localmente, sem cadastro, sem rastreamento e sem dependência de serviços externos. 
É um diário cinematográfico minimalista: você registra, organiza e revisita seus filmes com total controle sobre seus dados.

## Público-alvo

Qualquer pessoa que assista filmes e queira manter um registro pessoal simples, organizado e visualmente agradável de seus filmes ou séries.

## Funcionalidades

- Adicionar filmes com capa, título, gênero, plataforma, ano de lançamento, avaliação (1-10 estrelas) e review pessoal
- Navegar entre os filmes em um slider de cards
- Registrar a data em que o filme foi assistido
- Remover filmes individualmente
- Exportar a lista em formato `.json`
- Importar uma lista previamente exportada

## Tecnologias

- Python 3.12
- Flask
- HTML + CSS + JavaScript
- pytest
- ruff

## Estrutura do Projeto
Watchlist-tracker/
├── app/
│   ├── init.py
│   ├── data_store.py
│   └── routes.py
├── static/
│   ├── main.js
│   └── style.css
├── templates/
│   └── index.html
├── tests/
│   └── test_routes.py
├── .github/workflows/ci.yml
├── conftest.py
├── pyproject.toml
├── requirements.txt
├── VERSION
├── README.md
└── run.py

## Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/ventosincaos/Watchlist-tracker.git
cd Watchlist-tracker
```

2. Crie e ative o ambiente virtual:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Rode o servidor:
```bash
python run.py
```

5. Acesse no navegador na porta indicada

## Testes

```bash
pytest tests/ -v
```

## Linting

```bash
ruff check app/
```

## Versão

1.0.0

## Autor

ventosincaos — https://github.com/ventosincaos

## Repositório

https://github.com/ventosincaos/Watchlist-tracker