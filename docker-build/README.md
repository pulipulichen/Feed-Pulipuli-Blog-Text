# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- `docker image ls` 找出合適的名稱，例如「html-webpage-dashboard_app」
- 建立合適的repo https://hub.docker.com/
- `docker tag feed-pulipuli-blog-text_app pudding/github-action-app:puppeteer-10`
- `docker push pudding/github-action-app:puppeteer-10`
- 修改Dockerfile `FROM pudding/github-action-app:puppeteer-10`