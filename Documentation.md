## Preprando o Ambiente

## Listar e atualizar os pacotes disponíveis
- sudo apt-get update
- sudo apt-get upgrade

## Instalar o Docker e docker-compose
- sudo apt install docker.io
- sudo apt install docker-compose -y

## Adicionar o usuário ao Docker
- sudo usermod -aG docker $USER

## Instalando o dotnet e configurando a váriavel de ambiente com o mise
- mise ls-remote dotnet
- mise install dotnet@10.0.100
- mise use --global dotnet@10.0.100

## Instalando o tree
- sudo apt-get install tree

## Criando o webapi
 - dotnet new webapi -o src

## Ajustando o arquivo .csproj e sln
- mv ./src/src.csproj ./src/dotnet-api.csproj
- tree 
- more dotnet-api.snl
- dotnet sln dotnet-api.snl add ./src/dotnet-api.- csproj
- more dotnet-api.snl
- dotnet clean

