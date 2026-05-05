from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignupSerializer, MemberSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """POST /api/v1/auth/signup
    body: { email, password, name, phone, age?, handle?, display_name? }
    """
    s = SignupSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    member = s.save()
    token = RefreshToken.for_user(member)
    return Response({
        'access': str(token.access_token),
        'refresh': str(token),
        'user': MemberSerializer(member).data,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def me(request):
    """GET / PATCH / DELETE /api/v1/auth/me"""
    if request.method == 'GET':
        return Response(MemberSerializer(request.user).data)

    if request.method == 'PATCH':
        s = MemberSerializer(request.user, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)

    # DELETE — purge=true 면 hard delete, 아니면 휴면(soft)
    if request.query_params.get('purge') == 'true':
        request.user.delete()  # cascade SET NULL → registrations·testimonials 익명화
    else:
        request.user.is_active = False
        request.user.save(update_fields=['is_active'])
    return Response(status=status.HTTP_204_NO_CONTENT)
