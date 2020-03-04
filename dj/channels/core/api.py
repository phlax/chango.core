
from asgiref.sync import async_to_sync
from channels.auth import login, logout

from django.contrib.auth import authenticate

from .exceptions import APIException


class ChannelsAPI(object):

    api = (
        ("channels.auth.logout", "api_logout"),
        ("channels.auth.login", "api_login"))

    def __init__(self, consumer):
        self.consumer = consumer

    def __call__(self, *args, **kwargs):
        try:
            api = dict(self.api).get(kwargs["api"])
        except KeyError:
            raise APIException("No API specified")
        if not api or not getattr(self, api, None):
            raise APIException("API not recognized")
        return getattr(self, api)(*args, **kwargs)

    def api_login(self, *args, **kwargs):
        user = self.authenticate(kwargs)
        return (
            self.login_user(user)
            if user is not None
            else {"channels.auth.login": dict(errors=["login.fail"])})

    def api_logout(self, *args, **kwargs):
        async_to_sync(logout)(self.consumer.scope)
        return dict(
            user=dict(user=dict(username="")),
            api={"channels.auth.logout": True})

    def authenticate(self, kwargs):
        return authenticate(
            **{k: v
               for k, v
               in kwargs.items()
               if k in ["username", "password"]})

    def login_user(self, user):
        async_to_sync(login)(self.consumer.scope, user)
        session = self.consumer.scope["session"]
        session.save()
        return dict(
            api={
                "channels.auth.login": dict(
                    user=dict(
                        username=user.username))},
            cookies=dict(
                sessionid=session.session_key))
