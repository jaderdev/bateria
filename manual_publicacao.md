# Manual de Publicação - Sistema de Testes de Baterias ER18505M

Este manual contém instruções detalhadas para publicar o Sistema de Testes de Baterias ER18505M no domínio DPSbateria.laager.com.br.

## Índice

1. [Requisitos](#requisitos)
2. [Conteúdo do Pacote](#conteúdo-do-pacote)
3. [Configuração do Domínio](#configuração-do-domínio)
4. [Upload dos Arquivos](#upload-dos-arquivos)
5. [Verificação da Instalação](#verificação-da-instalação)
6. [Solução de Problemas](#solução-de-problemas)
7. [Manutenção](#manutenção)

## Requisitos

Para publicar o sistema, você precisará de:

- Acesso ao painel de controle do seu provedor de hospedagem
- Acesso FTP ou gerenciador de arquivos do seu provedor
- Domínio DPSbateria.laager.com.br configurado e apontando para sua hospedagem
- Navegador web atualizado (Chrome, Firefox, Edge ou Safari)

## Conteúdo do Pacote

O pacote de instalação contém os seguintes arquivos e pastas:

```
dpsbateria-server-deploy/
├── css/
│   ├── styles.css         # Estilos personalizados
│   └── tailwind.min.css   # Framework CSS
├── img/
│   ├── favicon.ico        # Ícone do site
│   └── logo_laager.jpg    # Logo da Laager
├── js/
│   ├── app.js             # Código JavaScript principal
│   └── xlsx.full.min.js   # Biblioteca para exportação Excel
└── index.html             # Página principal do sistema
```

## Configuração do Domínio

### Opção 1: Subdomínio em Hospedagem Existente

Se você já possui o domínio laager.com.br hospedado:

1. Acesse o painel de controle do seu provedor de hospedagem
2. Navegue até a seção de "Domínios" ou "DNS"
3. Adicione um subdomínio com o nome "DPSbateria"
4. Aponte o subdomínio para a pasta onde você fará o upload dos arquivos

### Opção 2: Configuração de DNS Externo

Se o domínio laager.com.br está registrado em um provedor diferente da hospedagem:

1. Acesse o painel de controle do registrador do domínio
2. Navegue até a seção de "Gerenciamento de DNS"
3. Adicione um registro CNAME:
   - Nome: DPSbateria
   - Valor: seu-servidor-de-hospedagem.com (fornecido pelo seu provedor)
4. Aguarde a propagação do DNS (pode levar até 48 horas)

## Upload dos Arquivos

### Método 1: Usando FTP

1. Conecte-se ao seu servidor usando um cliente FTP (como FileZilla)
   - Servidor: fornecido pelo seu provedor
   - Usuário: seu nome de usuário FTP
   - Senha: sua senha FTP
   - Porta: geralmente 21 (ou fornecida pelo provedor)

2. Navegue até a pasta raiz do subdomínio DPSbateria
   - Geralmente algo como `/public_html/DPSbateria/` ou `/www/DPSbateria/`

3. Faça upload de todos os arquivos e pastas do pacote `dpsbateria-server-deploy`
   - Certifique-se de manter a estrutura de pastas intacta
   - O arquivo `index.html` deve estar na raiz do diretório

### Método 2: Usando o Gerenciador de Arquivos do Painel de Controle

1. Acesse o painel de controle do seu provedor de hospedagem (cPanel, Plesk, etc.)
2. Abra o "Gerenciador de Arquivos"
3. Navegue até a pasta raiz do subdomínio DPSbateria
4. Faça upload do pacote ZIP (se disponível) e extraia-o, ou
5. Crie as pastas necessárias (css, img, js) e faça upload dos arquivos individualmente

## Verificação da Instalação

Após concluir o upload, verifique se a instalação foi bem-sucedida:

1. Abra um navegador web
2. Acesse o endereço: `https://DPSbateria.laager.com.br`
3. Você deve ver a página inicial do Sistema de Testes de Baterias
4. Teste as seguintes funcionalidades:
   - Alternância entre tema claro e escuro
   - Navegação entre as abas "Formulário" e "Registros"
   - Inserção de um código de barras para ativar o formulário
   - Preenchimento e envio de um teste
   - Visualização do registro na aba "Registros"
   - Exportação para CSV e Excel

## Solução de Problemas

### Página não encontrada (404)

- Verifique se o arquivo `index.html` está na pasta correta
- Confirme se o subdomínio está configurado corretamente
- Verifique se o DNS propagou completamente (pode levar até 48 horas)

### Problemas de Layout ou Estilo

- Verifique se a pasta `css` foi carregada corretamente
- Confirme se os arquivos CSS estão na estrutura correta
- Limpe o cache do navegador e recarregue a página

### Funcionalidades JavaScript não Funcionam

- Verifique se a pasta `js` foi carregada corretamente
- Confirme se os arquivos JavaScript estão na estrutura correta
- Verifique o console do navegador (F12) para identificar erros

### Imagens não Aparecem

- Verifique se a pasta `img` foi carregada corretamente
- Confirme se os arquivos de imagem estão na estrutura correta

## Manutenção

### Backup dos Dados

O sistema armazena todos os dados no localStorage do navegador do usuário. Para preservar os dados:

1. Exporte regularmente os registros para Excel ou CSV
2. Armazene os arquivos exportados em local seguro

### Atualização do Sistema

Para atualizar o sistema no futuro:

1. Faça backup dos dados conforme descrito acima
2. Substitua os arquivos no servidor pelos novos arquivos
3. Mantenha a mesma estrutura de pastas
4. Teste o sistema após a atualização

### Personalização

Se desejar personalizar o sistema:

- `css/styles.css`: Modifique para alterar a aparência
- `js/app.js`: Modifique para alterar o comportamento
- `index.html`: Modifique para alterar a estrutura

## Suporte

Para suporte adicional, entre em contato com a equipe de TI da Laager ou com o desenvolvedor do sistema.

---

© 2025 Laager Tecnologia - Todos os direitos reservados
