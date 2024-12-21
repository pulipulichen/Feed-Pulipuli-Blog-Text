FROM pudding/github-action-app:puppeteer-20230621-0111

RUN rm -f /etc/apt/sources.list.d/*
RUN apt-get update
RUN apt-get install -y ffmpeg

COPY package.json ./
RUN npm i
