
from unittest.mock import patch, MagicMock

import pytest

from django.urls import Resolver404

from dj.channels.core.consumers import Consumer
from dj.channels.core.exceptions import APIException


class DummyConsumer(Consumer):

    def __init__(self):
        pass


@patch("dj.channels.core.consumers.import_module")
def test_consumer_api(m_import, settings):
    m_import.return_value.ConsumerAPI.return_value = "API"

    consumer = DummyConsumer()
    assert consumer.api is None
    assert not m_import.return_value.ConsumerAPI.called
    assert not m_import.called

    settings.DJ_CHANNELS_API = "foo.bar.module.ConsumerAPI"

    assert not consumer.api
    assert not m_import.called
    assert not m_import.return_value.ConsumerAPI.called
    assert consumer.__dict__ == {"api": None}

    # blow the cache
    del consumer.__dict__["api"]

    api = consumer.api
    assert api == "API"
    assert (
        list(m_import.call_args)
        == [("foo.bar.module",), {}])
    assert (
        list(m_import.return_value.ConsumerAPI.call_args)
        == [(consumer, ), {}])


@patch("dj.channels.core.consumers.socket_connect")
def test_consumer_connect(m_connect):
    consumer = DummyConsumer()
    consumer.accept = MagicMock()
    consumer.scope = MagicMock()

    consumer.connect()

    assert (
        list(consumer.accept.call_args)
        == [(), {}])
    assert (
        list(list(c)
             for c
             in consumer.scope.__getitem__.call_args_list)
        == [[("session",), {}],
            [("session",), {}]])
    assert (
        list(m_connect.send_robust.call_args)
        == [(consumer.scope.__getitem__.return_value.__class__,),
            {"session": consumer.scope.__getitem__.return_value}])


@patch("dj.channels.core.consumers.socket_disconnect")
def test_consumer_disconnect(m_disconnect):
    consumer = DummyConsumer()
    consumer.scope = MagicMock()

    consumer.disconnect("CLOSE CODE")

    assert (
        list(list(c)
             for c
             in consumer.scope.__getitem__.call_args_list)
        == [[("session",), {}],
            [("session",), {}]])
    assert (
        list(m_disconnect.send_robust.call_args)
        == [(consumer.scope.__getitem__.return_value.__class__,),
            {"code": "CLOSE CODE",
             "session": consumer.scope.__getitem__.return_value}])


@patch("dj.channels.core.consumers.json")
def test_consumer_load_data(m_json):
    consumer = DummyConsumer()
    m_json.loads.return_value = "JSON"
    result = consumer.load_data("DATA")
    assert (
        list(m_json.loads.call_args)
        == [("DATA",), {}])
    assert result == "JSON"


@patch("dj.channels.core.consumers.json")
def test_consumer_dump_data(m_json):
    consumer = DummyConsumer()
    m_json.dumps.return_value = "DATA"
    result = consumer.dump_data("JSON")
    assert (
        list(m_json.dumps.call_args)
        == [("JSON",), {}])
    assert result == "DATA"


def test_consumer_handle_api():
    consumer = DummyConsumer()
    consumer.api = MagicMock(return_value="API RESULT")

    with pytest.raises(KeyError):
        consumer.handle_api({})

    result = consumer.handle_api(dict(api="API"))
    assert result == "API RESULT"
    assert (
        list(consumer.api.call_args)
        == [(), {"api": "API"}])


def test_consumer_handle_route():
    consumer = DummyConsumer()
    data_view = MagicMock()
    data_view.return_value.get_data.return_value = "DATA"
    resolved = MagicMock()
    consumer.resolve = MagicMock(
        return_value=(resolved, data_view))
    consumer.scope = MagicMock()
    consumer.scope.__getitem__.return_value = "SCOPE"

    with pytest.raises(KeyError):
        consumer.handle_route({})

    result = consumer.handle_route(dict(route="ROUTE"))
    assert result == dict(route="DATA")
    assert (
        list(data_view.call_args)
        == [("SCOPE",
             "ROUTE",
             resolved.kwargs,
             "SCOPE"), {}])
    assert (
        list(list(c)
             for c
             in consumer.scope.__getitem__.call_args_list)
        == [[("user",), {}],
            [("headers",), {}]])
    assert (
        list(consumer.resolve.call_args)
        == [("ROUTE",), {}])


@patch("dj.channels.core.consumers.resolve")
def test_consumer_resolve(m_resolve):
    consumer = DummyConsumer()
    result = consumer.resolve("PATH")
    init_kwargs = m_resolve.return_value.func.view_initkwargs
    assert (
        result
        == (m_resolve.return_value,
            init_kwargs.__getitem__.return_value))
    assert (
        list(m_resolve.call_args)
        == [("PATH",), {}])
    assert (
        list(init_kwargs.__getitem__.call_args)
        == [("data",), {}])


@patch("dj.channels.core.consumers.Consumer.send")
@patch("dj.channels.core.consumers.Consumer.dump_data")
@patch("dj.channels.core.consumers.Consumer.handle_api")
@patch("dj.channels.core.consumers.Consumer.handle_route")
@patch("dj.channels.core.consumers.Consumer.log")
def test_consumer_handle(m_log, m_route, m_api, m_dump, m_send):
    consumer = DummyConsumer()
    m_dump.return_value = "DUMPED"
    m_api.return_value = "API"
    m_route.return_value = "ROUTE"

    with pytest.raises(APIException):
        consumer.handle(dict(foo="BAR"))

    consumer.handle(dict(route="ROUTE", foo="BAR"))
    assert (
        list(m_log.call_args)
        == [({"route": "ROUTE", "foo": "BAR"},), {}])
    assert (
        list(m_route.call_args)
        == [({"route": "ROUTE", "foo": "BAR"},), {}])
    assert not m_api.called
    assert (
        list(m_dump.call_args)
        == [("ROUTE",), {}])
    assert (
        list(m_send.call_args)
        == [(), {"text_data": "DUMPED"}])
    m_route.reset_mock()
    m_log.reset_mock()
    m_dump.reset_mock()
    m_send.reset_mock()

    consumer.handle(dict(api="API", foo="BAR"))
    assert (
        list(m_log.call_args)
        == [({"api": "API", "foo": "BAR"},), {}])
    assert (
        list(m_api.call_args)
        == [({"api": "API", "foo": "BAR"},), {}])
    assert not m_route.called
    assert (
        list(m_dump.call_args)
        == [("API",), {}])
    assert (
        list(m_send.call_args)
        == [(), {"text_data": "DUMPED"}])
    m_api.reset_mock()
    m_log.reset_mock()
    m_dump.reset_mock()
    m_send.reset_mock()

    consumer.handle(dict(
        route="ROUTE",
        api="API",
        foo="BAR"))
    assert (
        list(m_log.call_args)
        == [({"api": "API",
              "foo": "BAR",
              "route": "ROUTE"},),
            {}])
    assert (
        list(m_route.call_args)
        == [({"api": "API",
              "foo": "BAR",
              "route": "ROUTE"},),
            {}])
    assert not m_api.called
    assert (
        list(m_dump.call_args)
        == [("ROUTE",), {}])
    assert (
        list(m_send.call_args)
        == [(), {"text_data": "DUMPED"}])


@patch("dj.channels.core.consumers.Consumer.dump_data")
@patch("dj.channels.core.consumers.Consumer.send")
@patch("dj.channels.core.consumers.Consumer.log_errors")
@patch("dj.channels.core.consumers.Consumer.handle")
@patch("dj.channels.core.consumers.Consumer.load_data")
def test_consumer_receive(m_load, m_handle, m_errors, m_send, m_dump):
    consumer = DummyConsumer()
    m_dump.return_value = "DUMPED DATA"
    m_load.return_value = "LOADED DATA"

    consumer.receive("TEXT DATA")
    assert (
        list(m_load.call_args)
        == [("TEXT DATA",), {}])
    assert (
        list(m_handle.call_args)
        == [("LOADED DATA",), {}])
    assert not m_errors.called
    assert not m_dump.called
    assert not m_send.called
    m_load.reset_mock()
    m_handle.reset_mock()

    def handle(data):
        raise APIException("Oops")

    m_handle.side_effect = handle
    consumer.receive("TEXT DATA")
    assert (
        list(m_load.call_args)
        == [("TEXT DATA",), {}])
    assert (
        list(m_handle.call_args)
        == [("LOADED DATA",), {}])
    assert (
        list(m_errors.call_args)
        == [(("Oops",),), {}])
    assert (
        list(m_dump.call_args)
        == [({"errors": ("Oops",)},), {}])
    assert (
        list(m_send.call_args)
        == [(), {"text_data": "DUMPED DATA"}])
    m_load.reset_mock()
    m_handle.reset_mock()
    m_errors.reset_mock()
    m_dump.reset_mock()
    m_send.reset_mock()

    def handle(data):
        raise Resolver404("GOT A 404")

    m_handle.side_effect = handle
    m_load.return_value = dict(route="ROUTE")
    consumer.receive("TEXT DATA")
    assert (
        list(m_load.call_args)
        == [("TEXT DATA",), {}])
    assert (
        list(m_handle.call_args)
        == [({"route": "ROUTE"},), {}])
    assert (
        list(m_errors.call_args)
        == [(("GOT A 404",),), {}])
    assert (
        list(m_dump.call_args)
        == [({"redirect": "ROUTE"},), {}])
    assert (
        list(m_send.call_args)
        == [(), {"text_data": "DUMPED DATA"}])
