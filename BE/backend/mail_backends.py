import ssl
import smtplib

from django.core.mail.backends.smtp import EmailBackend as BaseEmailBackend


class CustomEmailBackend(BaseEmailBackend):
    def open(self):
        if not self.connection:
            context = ssl._create_unverified_context()  # pylint: disable=protected-access

            if self.use_ssl:
                self.connection = smtplib.SMTP_SSL(self.host, self.port, context=context)
            else:
                self.connection = smtplib.SMTP(self.host, self.port)

            if self.use_tls:
                self.connection.starttls(context=context)

            if self.username and self.password:
                self.connection.login(self.username, self.password)

        return super().open()
