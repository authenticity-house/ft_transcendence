FROM nginx:alpine

ARG SERVER_IP CERTS_ CERTS_KEY_

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY run.sh .
RUN chmod +x run.sh

WORKDIR /usr/share/nginx/html/FE

RUN sed -i "s|my_ip_address|${SERVER_IP}|g" /etc/nginx/conf.d/default.conf \
      && sed -i "s|secret.crt;|${CERTS_};|g" /etc/nginx/conf.d/default.conf \
      && sed -i "s|secret.key;|${CERTS_KEY_};|g" /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["/bin/sh", "/run.sh"]
