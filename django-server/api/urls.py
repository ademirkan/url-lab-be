from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("redirects/<str:id>", views.crud),
    path("redirects/", views.post)
    # path("redirects/update/<str:id>", views.update),
]