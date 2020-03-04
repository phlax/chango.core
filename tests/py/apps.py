
from dj.channels.core import default_app_config
from dj.channels.core.apps import DjChannelsConfig


def test_config_default():
    assert default_app_config == 'dj.channels.core.apps.DjChannelsConfig'


def test_config():
    assert DjChannelsConfig.name == "dj.channels.core"
    assert DjChannelsConfig.label == "dj_channels_core"
    assert DjChannelsConfig.verbose_name == "Dj channels"
