
import os

from django.conf import settings
from django.template import Origin
from django.template.loaders.base import Loader


class ChannelsTemplateLoader(Loader):

    def get_contents(self, origin):
        contents = os.path.join(settings.DJ_CHANNELS_ASSETS, "index.html")
        with open(contents) as f:
            return f.read()

    def get_template_sources(self, template_name):
        if template_name == "channels.html":
            yield Origin(
                name=template_name,
                template_name=template_name,
                loader=self)
