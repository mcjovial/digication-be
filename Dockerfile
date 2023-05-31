# development stage
FROM node:alpine AS development
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# test stage
FROM node:alpine AS test
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3001

# production stage
FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
RUN yarn build
COPY --from=development /app/dist ./dist
CMD ["node", "dist/app.js"]
