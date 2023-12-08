FROM satantime/puppeteer-node:latest
WORKDIR /usr/app
ENV NODE_PATH=/usr/app/node_modules"
RUN apt-get update && apt-get install -y chromium && apt-get clean
RUN npm install puppeteer-core
#ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium" - needed only with full puppeteer. with puppeteer-core it is not needed
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true" - we use puppeteer-core and chromium from apt, since puppeteer can't download arm chromium by itself