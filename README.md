# Watchlist: tracker de filmes

Aplicação web para registrar e organizar os filmes que você assistiu.

## Funcionalidades

- Adicionar filmes com capa, gênero, plataforma, ano, avaliação e review
- Navegar entre os filmes em um slider de cards
- Remover filmes individualmente
- Exportar e importar sua lista em formato .JSON

## Tecnologias

- Python 3.12
- Flask
- HTML + CSS + JavaScript
- pytest
- ruff

## Versão

1.0.0

## Como executar

1. Clone o repositório
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
5. Abra no navegador

## Testes

```bash
pytest tests/ -v
```

## Linting

```bash
ruff check app/
```