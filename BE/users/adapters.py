from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.utils import user_field


class CustomUserAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """

        user = super().save_user(request, user, form, False)
        user_field(user, "nickname", request.data.get("nickname"))
        user.save()
        return user

    def get_email_confirmation_url(self, request, emailconfirmation):
        """
            Changing the confirmation URL to fit the domain that we are working on
        """

        url = (
                "http://localhost:8080/users-confirm-email/"
                + emailconfirmation.key
        )
        return url
