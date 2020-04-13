# Álcool+

Este projeto foi construído com objetivo de aprendizado e demonstração de conhecimento através da criação de um sistema capaz de fornecer um cadastro à clientes e fornecedores, afim de que estes possam requisitar(fazer pedido ao fornecedor) e cadastrar produtos (atualmente focado em Álcool em Gel). Também é possível que administradores possam controlar o cadastro de clientes, fornecedores, produtos e pedidos.
O projeto está separado em:
* Database: conexão com banco de dados (PHP e mysql driver);
* Backend: Controllers construídos com PHP responsáveis pela busca e manipulação dos dados enviados;
* Frontend: Telas construídas com HTML, Javascript/Jquery e CSS 3 para visualização e uso dos tipos de usuários (cliente, fornecedor e administrador);

### Requisitos

* [PHP] - PHP 7 (ou superior)
* [MySql] - Banco de dados MySql instalado
* [Apache] - Servidor web para acesso de arquivos localhost (pode ser outro)

### Instalação

Criar um banco de dados com nome 'alcool', criar um usuário no mysql com nome e senha 'root' ou alterar no arquivo connection dentro da pasta 'database' o usuário e senha para outro que tenha acesso ao banco. Utilizar este [sql] para gerar as tabelas necessárias. Clonar projeto, colocá-lo na pasta de seu localhost e acessar o arquivo index.html dentro da pasta frontend.
Já deve existir em seu banco de dados um usuário administrador (usuário 'adm@email.com', senha 'adm'), caso não exista, deve-se criar um preenchendo as informações manualmente na tabela 'user' (obs.: setar o campo 'type' com valor 'adm'). Em seguida você pode criar um usuário (comercial ou cliente) clicando no "clique aqui" na tela de login.
Todo cadastro comercial (usuário comercial e novos produtos) precisam passar por uma aprovação de um administrador, ou seja, não estará disponível para uso até que o administrador aprove seu cadastro. Diferente de um usuário cliente, que é aprovado automaticamente no sistema. Caso queira observar o retorno de requisições no backend utilizando [Postman], você pode baixar e importar [este arquivo].

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


[PHP]: <https://www.php.net/manual/pt_BR/install.windows.php>
[MySql]: <https://dev.mysql.com/doc/>
[Apache]: <https://www.apache.org/>
[sql]: <https://drive.google.com/open?id=1nJKN337P8rtlidn574DNzkLPsj4LpkgT>
[Postman]: <https://www.postman.com/downloads/>
[este arquivo]: <https://drive.google.com/open?id=1JTDgzv-_so3s8EZORsBsS-Jpk7ZQhVjI>

