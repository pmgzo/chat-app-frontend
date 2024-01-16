FROM 'node:21-alpine3.18'

ADD . ./

ENV PROD_ENV=true

RUN npm i
RUN npx next build
RUN chown -R node ./node_modules
EXPOSE 80

ENTRYPOINT ["npm", "run", "start"]
