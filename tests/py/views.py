
from collections import OrderedDict
from unittest.mock import patch, MagicMock, PropertyMock

import pytest

from chango.core.views import ChannelView


def test_view_constructor():

    with pytest.raises(KeyError):
        ChannelView()

    view = ChannelView(data="DATA VIEW")
    assert view.data_view == "DATA VIEW"
    assert view.template_name == "channels.html"
    assert view.js_prefix == "Channels"


def test_view_reconnection_policy(settings):
    view = ChannelView(data="DATA VIEW")
    assert view.reconnection_policy is None
    settings.DJ_CHANNELS_RECONNECTS = "RECONNECTION POLICY"
    assert view.reconnection_policy == "RECONNECTION POLICY"


def test_view_socket_address(settings):
    view = ChannelView(data="DATA VIEW")
    assert view.socket_address is None
    settings.DJ_CHANNELS_SOCKET = "SOCKET ADDRESS"
    assert view.socket_address == "SOCKET ADDRESS"


def test_view_use_l10n(settings):
    view = ChannelView(data="DATA VIEW")
    assert view.use_l10n is False
    settings.USE_L10N = True
    assert view.use_l10n is True
    settings.USE_L10N = False
    assert view.use_l10n is False


@patch("chango.core.views.mark_safe")
@patch(
    "chango.core.views.ChannelView.accept_lang",
    new_callable=PropertyMock)
@patch(
    "chango.core.views.ChannelView.language_direction",
    new_callable=PropertyMock)
@patch(
    "chango.core.views.ChannelView.title",
    new_callable=PropertyMock)
@patch("chango.core.views.ChannelView.js_to_string")
def test_view_get_context_data(m_js, m_title, m_dir, m_lang, m_safe):
    view = ChannelView(data="DATA VIEW")
    m_js.return_value = "JS"
    m_title.return_value = "TITLE"
    m_dir.return_value = "DIRECTION"
    m_lang.return_value = "LANGUAGE"
    m_safe.return_value = "SAFE JS, WE HOPE"

    result = view.get_context_data()
    assert (
        list(m_js.call_args)
        == [(), {}])
    assert (
        list(m_title.call_args)
        == [(), {}])
    assert (
        list(m_dir.call_args)
        == [(), {}])
    assert (
        list(m_lang.call_args)
        == [(), {}])
    assert (
        list(m_safe.call_args)
        == [('JS',), {}])
    assert (
        result
        == {'accept_lang': 'LANGUAGE',
            'direction': 'DIRECTION',
            'title': 'TITLE',
            'js': 'SAFE JS, WE HOPE'})


@patch("chango.core.views.ChannelView.get_page_data")
@patch("chango.core.views.ChannelView.title", new_callable=PropertyMock)
@patch("chango.core.views.ChannelView.get_settings")
def test_view_get_js(m_settings, m_title, m_data):
    view = ChannelView(data="DATA VIEW")
    type(view).request = PropertyMock()
    type(view.request).user = PropertyMock()
    type(view.request.user).username = PropertyMock(
        return_value="USERNAME")
    type(view.request.user).is_anonymous = PropertyMock(
        return_value="ANON")
    type(view.request.user).is_superuser = PropertyMock(
        return_value="SUPERUSER")
    m_title.return_value = "TITLE"
    m_settings.return_value = "SETTINGS"
    m_data.return_value = dict(data="DATA", foo="BAR")
    result = view.get_js()
    assert (
        list(m_title.call_args)
        == [(), {}])
    assert (
        list(m_data.call_args)
        == [(), {}])
    assert (
        list(m_settings.call_args)
        == [(), {}])
    assert (
        result
        == {"title": "TITLE",
            "settings": "SETTINGS",
            "data": "DATA",
            "foo": "BAR",
            "user": {
                "is_anon": "ANON",
                "is_superuser": "SUPERUSER",
                "username": "USERNAME"}})


@patch(
    "chango.core.views.ChannelView.use_l10n",
    new_callable=PropertyMock)
@patch(
    "chango.core.views.ChannelView.socket_address",
    new_callable=PropertyMock)
@patch(
    "chango.core.views.ChannelView.reconnection_policy",
    new_callable=PropertyMock)
@patch(
    "chango.core.views.ChannelView.auth_settings",
    new_callable=PropertyMock)
def test_view_get_settings(m_auth, m_connect, m_address, m_l10n):
    view = ChannelView(data="DATA VIEW")

    m_l10n.return_value = "L10N"
    m_auth.return_value = "AUTH"
    m_connect.return_value = "CONNECT"
    m_address.return_value = "ADDRESS"
    result = view.get_settings()
    assert (
        list(m_l10n.call_args)
        == [(), {}])
    assert (
        list(m_auth.call_args)
        == [(), {}])
    assert (
        list(m_connect.call_args)
        == [(), {}])
    assert (
        list(m_address.call_args)
        == [(), {}])
    assert (
        result
        == {'django.use_l10n': 'L10N',
            'channels.core.auth': 'AUTH',
            'channels.core.reconnection_policy': 'CONNECT',
            'channels.core.socket_address': 'ADDRESS'})

    m_l10n.reset_mock()
    m_auth.reset_mock()
    m_l10n.return_value = False
    m_auth.return_value = None
    m_connect.return_value = 0
    m_address.return_value = "ADDRESS"
    result = view.get_settings()
    assert (
        list(m_l10n.call_args)
        == [(), {}])
    assert (
        list(m_auth.call_args)
        == [(), {}])
    assert (
        list(m_connect.call_args)
        == [(), {}])
    assert (
        list(m_address.call_args)
        == [(), {}])
    assert (
        result
        == {'django.use_l10n': False,
            'channels.core.reconnection_policy': 0,
            'channels.core.socket_address': 'ADDRESS'})


@patch("chango.core.views.dumpjs")
@patch(
    "chango.core.views.ChannelView.js_prefix",
    new_callable=PropertyMock)
@patch("chango.core.views.ChannelView.get_js")
def test_view_js_to_string(m_js, m_prefix, m_dump):
    view = ChannelView(data="DATA VIEW")

    m_js.return_value = OrderedDict([
        ["js1", "JS 1"],
        ["js2", "JS 2"]])
    m_prefix.return_value = "PREFIX"
    m_dump.return_value = "DUMPED JS"

    result = view.js_to_string()

    assert (
        list(list(c) for c in m_dump.call_args_list)
        == [[('JS 1',), {}],
            [('JS 2',), {}]])
    assert (
        list(list(c) for c in m_prefix.call_args_list)
        == [[(), {}], [(), {}], [(), {}]])
    assert (
        list(list(c) for c in m_js.call_args_list)
        == [[(), {}]])
    assert (
        result
        == ("window.PREFIX = {}\n"
            "window.PREFIX.js1 = JSON.parse(\"DUMPED JS\");\n"
            "window.PREFIX.js2 = JSON.parse(\"DUMPED JS\");"))


def test_view_get_page_data():
    view = ChannelView(data="DATA VIEW")
    type(view).request = PropertyMock()
    type(view.request).user = PropertyMock(
        return_value="USER")
    type(view.request).path = PropertyMock(
        return_value="PATH")
    type(view.request).headers = PropertyMock(
        return_value="HEADERS")
    view.kwargs = dict(foo="BAR")
    view.data_view = MagicMock()
    view.data_view.return_value.get_data.return_value = "DATA"
    result = view.get_page_data()
    assert (
        list(view.data_view.call_args)
        == [('USER',
             'PATH',
             {'foo': 'BAR'},
             'HEADERS'), {}])
    assert (
        list(view.data_view.return_value.get_data.call_args)
        == [(), {}])
    assert result == "DATA"
