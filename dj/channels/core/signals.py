
from django.dispatch import Signal


socket_connect = Signal(providing_args=["session"])
socket_disconnect = Signal(providing_args=["session"])
