# Use a imagem oficial do SDK .NET 10 para build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copia arquivos de projeto e restaura dependências
COPY src/*.csproj ./
RUN dotnet restore

# Copia o restante do código e faz o build da aplicação
COPY src/. ./
RUN dotnet publish -c Release -o out

# Usa a imagem runtime .NET 10 para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Define variáveis de ambiente para configurar a porta
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expõe a porta padrão
EXPOSE 8080

# Executa a aplicação
ENTRYPOINT ["dotnet", "dotnet-api.dll"]