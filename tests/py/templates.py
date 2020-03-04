
from unittest.mock import patch

from dj.channels.core.templates import ChannelsTemplateLoader


@patch("dj.channels.core.templates.Origin")
def test_template_loader_sources(m_origin):
    loader = ChannelsTemplateLoader(None)
    m_origin.return_value = "ORIGIN"

    sources = list(loader.get_template_sources("index.html"))
    assert sources == []
    assert not m_origin.call_args

    sources = list(loader.get_template_sources("channels.html"))
    assert sources == ["ORIGIN"]
    assert (
        m_origin.call_args
        == [(),
            {'name': 'channels.html',
             'template_name': 'channels.html',
             'loader': loader}])


@patch("dj.channels.core.templates.os")
@patch("dj.channels.core.templates.open")
def test_template_loader_get_contents(m_open, m_os, settings):
    loader = ChannelsTemplateLoader(None)
    settings.DJ_CHANNELS_ASSETS = "/SOME/PATH"
    m_open.return_value.__enter__.return_value.read.return_value = "CONTENTS"
    m_os.path.join.return_value = "JOINED PATH"

    contents = loader.get_contents("ORIGIN")
    assert contents == "CONTENTS"
    assert (
        list(list(c) for c in m_os.path.join.mock_calls)
        == [['', ('/SOME/PATH', 'index.html'), {}]])
    assert (
        list(m_open.call_args)
        == [('JOINED PATH',), {}])
