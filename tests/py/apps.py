
from chango.core import default_app_config
from chango.core.apps import ChangoConfig


def test_config_default():
    assert default_app_config == 'chango.core.apps.ChangoConfig'


def test_config():
    assert ChangoConfig.name == "chango.core"
    assert ChangoConfig.label == "chango_core"
    assert ChangoConfig.verbose_name == "Chango"
