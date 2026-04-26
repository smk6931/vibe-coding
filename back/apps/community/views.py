from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from .models import ShowcaseItem, Post, Comment
from .serializers import ShowcaseSerializer, PostSerializer, CommentSerializer


class ShowcaseViewSet(viewsets.ModelViewSet):
    queryset = ShowcaseItem.objects.filter(published=True)
    serializer_class = ShowcaseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        obj = self.get_object()
        ShowcaseItem.objects.filter(pk=obj.pk).update(likes_count=obj.likes_count + 1)
        return Response({'likes_count': obj.likes_count + 1})


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        board = self.request.query_params.get('board')
        if board:
            qs = qs.filter(board=board)
        return qs

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        if request.method == 'GET':
            return Response(CommentSerializer(post.comments.all(), many=True).data)
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        s = CommentSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save(post=post, author=request.user)
        return Response(s.data, status=status.HTTP_201_CREATED)
