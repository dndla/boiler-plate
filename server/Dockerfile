FROM node:18

WORKDIR /home/node/app

COPY ./ ./
RUN apt-get update && apt-get install -y npm && npm install

# RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "start"]
