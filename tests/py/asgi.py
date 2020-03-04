
from channels.auth import AuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.sessions import SessionMiddleware
from channels.security.websocket import OriginValidator

from dj.channels.core.asgi import application
from dj.channels.core.routing import websocket_urlpatterns
from dj.channels.core.consumers import Consumer


def test_application(settings):
    assert isinstance(application, ProtocolTypeRouter)
    websocket = application.application_mapping["websocket"]
    assert isinstance(
        websocket,
        OriginValidator)
    assert isinstance(
        websocket.application.inner,
        SessionMiddleware)
    assert isinstance(
        websocket.application.inner.inner,
        AuthMiddleware)
    assert isinstance(
        websocket.application.inner.inner.inner,
        URLRouter)
    assert (
        websocket.application.inner.inner.inner.routes
        == websocket_urlpatterns)


def test_patterns():
    assert websocket_urlpatterns[0].callback is Consumer
    assert str(websocket_urlpatterns[0].pattern) == 'ws$'
