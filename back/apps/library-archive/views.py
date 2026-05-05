from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import LibraryItem
from .serializers import LibraryItemSerializer, LibraryItemListSerializer


class LibraryItemViewSet(viewsets.ModelViewSet):
    queryset = LibraryItem.objects.filter(published=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'summary', 'tags']

    def get_serializer_class(self):
        if self.action == 'list':
            return LibraryItemListSerializer
        return LibraryItemSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        for field in ['format', 'category', 'level', 'access']:
            val = self.request.query_params.get(field)
            if val:
                qs = qs.filter(**{field: val})
        return qs
