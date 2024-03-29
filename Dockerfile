FROM node:20.11.1-alpine3.19
ADD . /app
WORKDIR /app
RUN apk add git
RUN npm install -g pnpm
RUN pnpm install 
RUN pnpm run build 
CMD ["pnpm", "run","start","-H","0.0.0.0"]
