
from chango.core import default_app_config
from chango.core.apps import DjChannelsConfig


def test_config_default():
    assert default_app_config == 'chango.core.apps.DjChannelsConfig'


def test_config():
    assert DjChannelsConfig.name == "chango.core"
    assert DjChannelsConfig.label == "dj_channels_core"
    assert DjChannelsConfig.verbose_name == "Dj channels"
