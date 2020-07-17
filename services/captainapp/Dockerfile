ARG deploymenttype

ARG CONFIG_PATH=./src/config/index.js

FROM node:latest

ARG deploymenttype

ARG CONFIG_PATH

WORKDIR /app

COPY . .

RUN if [ "${deploymenttype}" = "production" ] ; then \ 
    sed '1d' $CONFIG_PATH > temp.js ; \
    fi

RUN if [ "${deploymenttype}" = "production" ] ; then \ 
    mv temp.js ${CONFIG_PATH} ; \
    fi

RUN if [ "${deploymenttype}" = "production" ] ; then \ 
    sed -i '1iconst type = "production";' ${CONFIG_PATH} ; \
    fi

RUN if [ "${deploymenttype}" = "development" ] ; then \ 
    sed '1d' ${CONFIG_PATH} > temp.js ; \
    fi

RUN if [ "${deploymenttype}" = "development" ] ; then \ 
    mv temp.js ${CONFIG_PATH} ; \
    fi

RUN if [ "${deploymenttype}" = "development" ] ; then \ 
    sed -i '1iconst type = "development";' ${CONFIG_PATH} ; \
    fi

RUN npm install --silent

RUN npm run build

WORKDIR /app/build

RUN npm i -g serve

EXPOSE 8000

CMD [ "serve", "-p", "8000", "-s", "." ]
