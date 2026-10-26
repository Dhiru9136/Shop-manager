
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.core.cache import cache

from .models import Customer
from .serializers import CustomerSerializers


class CustomerView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
            {"message": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )
        customers = Customer.objects.filter(user_id=request.user.id,is_active=True)
        serializer = CustomerSerializers(customers, many=True)

        return Response(serializer.data)

    def post(self,request):
        if not request.user.is_authenticated:
            return Response(
            {"message": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )
 
        
        customer_name = request.data.get("customer_name")
        phone_number = request.data.get("phone_number")
        account_number = request.data.get("account_number")
        bank_name = request.data.get("bank_name")
        amount = request.data.get("amount")
        payment_method = request.data.get("payment_method")
        payment_date = request.data.get("payment_date")
        transaction = request.data.get("transaction")

        customer = Customer.objects.create(
            user=request.user,
            customer_name=customer_name,
            phone_number=phone_number,
            account_number=account_number,
            bank_name=bank_name,
            amount=amount,
            payment_method=payment_method,
            payment_date=payment_date,
            transaction=transaction,
        )
        return Response(
    {
        "message": "Customer created successfully",
        "data": {
            "id": customer.id,
            "user": customer.user.id,
            "customer_name": customer.customer_name,
            "phone_number": customer.phone_number,
            "account_number": customer.account_number,
            "bank_name": customer.bank_name,
            "amount": str(customer.amount),
            "payment_method": customer.payment_method,
            "payment_date": customer.payment_date,
            "transaction": customer.transaction,
            "is_active": customer.is_active,
            "created_at": customer.created_at,
            "updated_at": customer.updated_at,
        }
    },
    status=status.HTTP_201_CREATED
)
    
    def patch(self, request, customer_id=None):
        if not request.user.is_authenticated:
            return Response(
                {"message": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            customer = Customer.objects.get(
                id=customer_id,
                user=request.user,
                is_active=True
            )
        except Customer.DoesNotExist:
            return Response(
                {"message": "Customer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        allowed_fields = [
            "customer_name",
            "phone_number",
            "account_number",
            "bank_name",
            "amount",
            "payment_method",
            "payment_date",
            "transaction",
            "transaction_status",
        ]

        for field in allowed_fields:
            if field in request.data:
                if not hasattr(customer, field):
                    return Response(
                        {"message": f"Field '{field}' does not exist in Customer model."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                setattr(customer, field, request.data[field])

        customer.save()

        return Response(
            {
                "message": "Customer updated successfully",
                "data": {
                    "id": customer.id,
                    "customer_name": customer.customer_name,
                    "phone_number": customer.phone_number,
                    "account_number": customer.account_number,
                    "bank_name": customer.bank_name,
                    "amount": str(customer.amount),
                    "payment_method": customer.payment_method,
                    "payment_date": customer.payment_date,
                    "transaction": customer.transaction,
                    "is_active": customer.is_active,
                }
            },
            status=status.HTTP_200_OK
        )
    def delete(self, request, customer_id):
        try:
            customer = Customer.objects.get(
            id=customer_id,
            user=request.user,
            is_active=True,
        )
        except Customer.DoesNotExist:
            return Response(
            {"message": "Customer not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

        customer.is_active = False
        customer.save(update_fields=["is_active"])

        return Response(
        {"message": "Customer soft deleted successfully"},
        status=status.HTTP_200_OK,
    )
