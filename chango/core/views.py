
import os

from django.conf import settings
from django.utils import translation
from django.utils.safestring import mark_safe
from django.views.generic.base import TemplateView

from .l10n import AcceptLangParser
from .utils import dumpjs


class ChannelView(TemplateView):
    js_prefix = "Channels"
    template_name = "channels.html"
    data = None

    def __init__(self, *args, **kwargs):
        self.data_view = kwargs.pop("data")
        super(ChannelView, self).__init__(*args, **kwargs)

    @property
    def accept_lang(self):
        header = self.request.headers['Accept-Language']
        return self.accept_lang_parser.get_accept_lang(
            header, os.listdir('locale'))

    @property
    def accept_lang_parser(self):
        return AcceptLangParser()

    @property
    def auth_settings(self):
        return dict(
            local_auth=True,
            allow_registration=True,
            providers=["github"])

    @property
    def language_direction(self):
        return (
            "rtl"
            if translation.get_language_info(self.accept_lang)["bidi"]
            else "ltr")

    @property
    def reconnection_policy(self):
        return getattr(settings, "DJ_CHANNELS_RECONNECTS", None)

    @property
    def socket_address(self):
        return getattr(settings, "DJ_CHANNELS_SOCKET", None)

    @property
    def title(self):
        return getattr(settings, "DJ_CHANNELS_SITE_TITLE", None)

    @property
    def use_l10n(self):
        return getattr(settings, "USE_L10N", False)

    def get_context_data(self, *args, **kwargs):
        return dict(
            accept_lang=self.accept_lang,
            direction=self.language_direction,
            title=self.title,
            js=mark_safe(self.js_to_string()))

    def get_js(self):
        js = dict(
            title=self.title,
            user=dict(
                username=self.request.user.username,
                is_superuser=self.request.user.is_superuser,
                is_anon=self.request.user.is_anonymous),
            settings=self.get_settings())
        js.update(self.get_page_data())
        return js

    def get_page_data(self):
        return self.data_view(
            self.request.user,
            self.request.path,
            self.kwargs,
            self.request.headers).get_data()

    def get_settings(self):
        settings = {
            "django.use_l10n": self.use_l10n,
            "channels.core.auth": self.auth_settings,
            "channels.core.reconnection_policy": self.reconnection_policy,
            "channels.core.socket_address": self.socket_address}
        return {k: v for k, v in settings.items() if v is not None}

    def js_to_string(self):
        js = ["window.%s = {}" % self.js_prefix]
        for k, v in self.get_js().items():
            js += [
                'window.%s.%s = JSON.parse("%s");'
                % (self.js_prefix, k, dumpjs(v))]
        return "\n".join(js)
