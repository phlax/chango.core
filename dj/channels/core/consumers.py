
import json
from importlib import import_module

from django.conf import settings
from django.urls import resolve, Resolver404
from django.utils.functional import cached_property

from channels.generic.websocket import WebsocketConsumer

from .exceptions import APIException
from .signals import socket_connect, socket_disconnect


class Consumer(WebsocketConsumer):

    @cached_property
    def api(self):
        if not hasattr(settings, "DJ_CHANNELS_API"):
            return
        p, m = settings.DJ_CHANNELS_API.rsplit('.', 1)
        return getattr(import_module(p), m)(self)

    def connect(self):
        socket_connect.send_robust(
            self.scope["session"].__class__,
            session=self.scope["session"])
        self.accept()

    def disconnect(self, close_code):
        socket_disconnect.send_robust(
            self.scope["session"].__class__,
            code=close_code,
            session=self.scope["session"])

    def dump_data(self, data):
        return json.dumps(data)

    def handle(self, data):
        self.log(data)
        if data.get("route"):
            response = self.handle_route(data)
        elif "api" in data:
            response = self.handle_api(data)
        else:
            raise APIException("Unrecognized request")
        self.send(text_data=self.dump_data(response))

    def handle_api(self, data):
        return self.api(
            api=data["api"],
            **data.get("params", {}))

    def handle_route(self, data):
        resolved, data_view = self.resolve(data["route"])
        return dict(
            route=data_view(
                self.scope["user"],
                data["route"],
                resolved.kwargs,
                self.scope["headers"]).get_data())

    def load_data(self, text_data):
        return json.loads(text_data)

    def log(self, data):
        print("recv", data)

    def log_errors(self, errors):
        for error in errors:
            print("error", error)

    def receive(self, text_data):
        data = self.load_data(text_data)
        try:
            self.handle(data)
        except APIException as e:
            self.log_errors(e.args)
            self.send(
                text_data=self.dump_data(
                    dict(errors=e.args)))
        except Resolver404 as e:
            self.log_errors(e.args)
            self.send(
                text_data=self.dump_data(dict(redirect=data["route"])))

    def resolve(self, path):
        resolved = resolve(path)
        return resolved, resolved.func.view_initkwargs["data"]
