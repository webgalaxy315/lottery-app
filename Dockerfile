FROM node:8.11.3-alpine
LABEL maintainer="Nguyen Nguyen <nguyenbk92@gmail.com>"
# Set the working directory to /app
WORKDIR /app
RUN  apk add --update \
    python \
    git \
    bash \
    make \
    g++

# Copy the current directory contents into the container at /app
COPY public/* /app/
COPY src/* /app/
COPY package* /app/

RUN npm install
CMD ["npm", "start"]

