#Specify the version of nodejs.
FROM buildkite/puppeteer:10.0.0
#FROM dayyass/muse_as_service:1.1.2

RUN npm link iconv-lite@0.6.3

RUN npm link sequelize@6.7.0
RUN npm link sqlite3@5.0.2

RUN npm link papaparse@5.3.2

RUN npm link jquery@3.6.3
RUN npm link jsdom@21.1.0

RUN npm link rss-parser@3.13.0
RUN npm link feed@4.2.2
RUN npm link @extractus/feed-extractor@6.2.2

RUN npm link axios@1.4.0
RUN npm link cheerio@1.0.0-rc.12

RUN npm link htmlentities@1.0.0

CMD ["node", "/app/index.js"]