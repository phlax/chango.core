
from unittest.mock import MagicMock

import pytest

from dj.channels.core.data import Data


def test_consumer_data_constructor():

    with pytest.raises(TypeError):
        Data()

    data = Data("USER", "PATH", "KWARGS", "HEADERS")
    assert data.user == "USER"
    assert data.path == "PATH"
    assert data.kwargs == "KWARGS"
    assert data.headers == "HEADERS"
    assert data.page is False

    data = Data("USER", "PATH", "KWARGS", "HEADERS", page=True)
    assert data.user == "USER"
    assert data.path == "PATH"
    assert data.kwargs == "KWARGS"
    assert data.headers == "HEADERS"
    assert data.page is True


def test_consumer_data_get_data():
    user = MagicMock()

    data = Data(user, "PATH", "KWARGS", "HEADERS")
    result = data.get_data()
    assert result == {"route": "PATH", "data": {"__schema__": {}}}

    data = Data(user, "PATH", "KWARGS", "HEADERS", page=True)
    result = data.get_data()
    assert result == {"route": "PATH", "data": {"__schema__": {}}}

    user.is_anonymous = False
    data = Data(user, "PATH", "KWARGS", "HEADERS", page=True)
    result = data.get_data()
    assert (
        result
        == {"route": "PATH",
            "data": {"__schema__": {}},
            "user": {
                "isanon": False,
                "username": user.username}})
