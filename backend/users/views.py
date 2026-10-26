from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from .serializers import UsersSerializers,ProfileSerializers,Profile_2Serializers
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from django.db import transaction






class RegisterView(APIView):

    def post(self, request):
        serializer = UsersSerializers(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "User registered successfully",
                    "user": serializer.data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
   



class LogInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Step 1: React se username aur password lena
        username = request.data.get("username")
        password = request.data.get("password")

        # Step 2: Check karo ki dono fields di gayi hain
        if not username or not password:
            return Response(
                {"message": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 3: Django se user authenticate karna
        user = authenticate(
            request,
            username=username,
            password=password
        )

        # Step 4: Credentials galat hon toh error return karna
        if user is None:
            return Response(
                {"message": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Step 5: Inactive user ko login karne se rokna
        if not user.is_active:
            return Response(
                {"message": "This account is inactive"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Step 6: JWT refresh token banana
        refresh = RefreshToken.for_user(user)

        # Step 7: Access aur refresh tokens React ko return karna
        return Response(
            {
                "message": "Login successful",
                "username": user.username,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK
        )



# class Create_User(APIView):
    
#     def post(self, request):
#         user_serializer = ProfileSerializers(data=request.data)

#         if not user_serializer.is_valid():
#             return Response(
#                 user_serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         profile_serializer = Profile_2Serializers(data=request.data)

#         if not profile_serializer.is_valid():
#             return Response(
#                 profile_serializer.errors,
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             with transaction.atomic():
#                 # Table 1: auth_user
#                 user = user_serializer.save()

#                 # Table 2: m_user
#                 profile = profile_serializer.save(user_id=user)

#             return Response(
#                 {
#                     "message": "User created successfully",
#                     "user": ProfileSerializers(user).data,
#                     "profile": Profile_2Serializers(profile).data,
#                 },
#                 status=status.HTTP_201_CREATED
#             )

#         except Exception as e:
#             return Response(
#                 {"error": str(e)},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

    
class ProfileView(APIView):
     def get (self, request):
            if not request.user.is_authenticated:
                        return Response(
                        {"message": "Authentication credentials were not provided."},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            user = User.objects.filter(id=request.user.id,is_active=True)
            print(user)
            serializer = ProfileSerializers(user, many=True)


            return Response(serializer.data)