
from django.urls import path
from .views import RegisterView,LogInView,ProfileView




urlpatterns = [
    path("", LogInView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    # path("create_user/", Create_User.as_view(), name="create_user"),
    path("profile/<int:user_id>", ProfileView.as_view(), name="profile"),
]
