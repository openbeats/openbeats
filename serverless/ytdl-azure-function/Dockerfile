FROM mcr.microsoft.com/azure-functions/node:2.0

USER root

RUN apt-get update

RUN apt-get -y install curl gnupg

RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -

RUN apt-get -y install nodejs

# Define required envvars
ENV AzureWebJobsScriptRoot=/home/site/wwwroot

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

# Specify the work dir and do a npm install
WORKDIR /home/site/wwwroot

COPY . /home/site/wwwroot

RUN npm i ytdl-core