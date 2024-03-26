FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY run.sh .
RUN chmod +x run.sh

WORKDIR /usr/share/nginx/html/FE

CMD ["/bin/sh", "/run.sh"]
