FROM golang:1.13-alpine3.11
RUN apk add --no-cache git

WORKDIR /go/src/jade
COPY . .

RUN go get -d -v ./...
RUN go install -v ./...

CMD ["jade"]
