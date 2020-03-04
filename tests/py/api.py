
from unittest.mock import patch

import pytest

from dj.channels.core.api import ChannelsAPI
from dj.channels.core.exceptions import APIException


def test_api_constructor():
    api = ChannelsAPI("CONSUMER")
    assert api.consumer == "CONSUMER"
    assert (
        api.api
        == (("channels.auth.logout", "api_logout"),
            ("channels.auth.login", "api_login")))


@patch("dj.channels.core.api.ChannelsAPI.api_logout")
@patch("dj.channels.core.api.ChannelsAPI.api_login")
def test_api_call(m_login, m_logout):
    api = ChannelsAPI("CONSUMER")
    m_login.return_value = "LOGIN"
    m_logout.return_value = "LOGOUT"

    with pytest.raises(APIException):
        api()
    assert not m_login.called
    assert not m_logout.called

    with pytest.raises(APIException):
        api(api="DOESNOTEXIST")
    assert not m_login.called
    assert not m_logout.called

    api(api="channels.auth.login",
        params={
            "username": "USER",
            "password": "FOO"})
    assert (
        list(m_login.call_args)
        == [(), {'api': 'channels.auth.login',
                 'params': {
                     'username': 'USER',
                     'password': 'FOO'}}])
    assert not m_logout.called
    m_login.reset_mock()

    api(api="channels.auth.logout")
    assert (
        list(m_logout.call_args)
        == [(), {'api': 'channels.auth.logout'}])
    assert not m_login.called


@patch("dj.channels.core.api.ChannelsAPI.authenticate")
@patch("dj.channels.core.api.ChannelsAPI.login_user")
def test_api_login(m_login, m_auth):
    api = ChannelsAPI("CONSUMER")
    m_login.return_value = "LOGIN"
    m_auth.return_value = None

    result = api.api_login("KWARGS")
    assert not m_login.called
    assert (
        list(m_auth.call_args)
        == [({},), {}])
    assert (
        result
        == {'channels.auth.login':
            {'errors': ['login.fail']}})
    m_auth.reset_mock()

    m_auth.return_value = "USER"

    result = api.api_login("KWARGS")
    assert (
        list(m_auth.call_args)
        == [({},), {}])
    assert (
        list(m_login.call_args)
        == [("USER",), {}])
    assert result == "LOGIN"


@patch("dj.channels.core.api.authenticate")
def test_api_authenticate(m_auth):
    api = ChannelsAPI("CONSUMER")
    m_auth.return_value = "AUTH"
    result = api.authenticate(
        dict(creds="CREDS"))
    assert result == "AUTH"
    assert (
        list(m_auth.call_args)
        == [(), {}])
    result = api.authenticate(
        dict(username="USER",
             password="PASSWORD"))
    assert result == "AUTH"
    assert (
        list(m_auth.call_args)
        == [(),
            {'password': 'PASSWORD',
             'username': 'USER'}])
