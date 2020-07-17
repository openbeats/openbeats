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

EXPOSE 7000

CMD [ "npm", "run", "server" ]
