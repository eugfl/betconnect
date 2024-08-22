# BetConnect

BetConnect é uma aplicação para gerenciamento de clientes e contatos, projetada para facilitar a criação, visualização, edição e exclusão de registros. O sistema também oferece funcionalidades para relatórios e autenticação de usuários.

## Tecnologias Utilizadas

- **Frontend**: React, Next.js, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth
- **Outras Dependências**: Zod, React Hook Form, Sonner

## Instalação

Para configurar o ambiente de desenvolvimento e rodar a aplicação localmente, siga os passos abaixo:

1. **Clone o Repositório**
   `git clone https://github.com/eugfl/betconnect.git`
   
2. **Entre na pasta do projeto**
   `cd betconnect`
   
3. **Abra com o seu editor de código**
    `code .`
    
4. **Instale as dependências**
    `npm install`

5. **Configure o Postgres com suas credenciais no .env**

6. **Rode o Docker Compose**
   `docker compose up -d`

7. **Rode o prisma migrate**
   `npx prisma migrate dev`

8. **Rode o comando do nextauth e ele irá gerar uma chave, você deverá colar no .env em "AUTH_SECRET="**
   `npx auth secret`

9. **Adicione suas credenciais de email no .env para o nodemailer funcionar**


10. **Inicie o projeto**
   `npm run dev`

Feito com ♥ by [eugfl](https://www.linkedin.com/in/eugfl/)
