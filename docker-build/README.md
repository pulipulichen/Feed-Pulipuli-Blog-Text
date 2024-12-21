# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- https://hub.docker.com/
- `docker image ls` 找出合適的名稱，例如「feed-pulipuli-blog-text_app」
- 建立合適的repo https://hub.docker.com/
- `docker tag feed-pulipuli-blog-text_app pudding/github-action-app:puppeteer-20230712-2317`
- `docker push pudding/github-action-app:puppeteer-20230712-2317`
- 修改Dockerfile 

````
FROM pudding/github-action-app:puppeteer-20230712-2317
````