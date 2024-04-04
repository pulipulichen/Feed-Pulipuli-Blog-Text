# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- `docker image ls` 找出合適的名稱，例如「feed-pulipuli-blog-text_app」
- 建立合適的repo https://hub.docker.com/
- `docker tag feed-pulipuli-blog-text_app pudding/github-action-app:puppeteer-20230621-0111`
- `docker push pudding/github-action-app:puppeteer-20230621-0111`
- 修改Dockerfile 

````
FROM pudding/github-action-app:puppeteer-20230621-0111
````