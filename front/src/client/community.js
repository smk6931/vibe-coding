import api from './index';

export const communityClient = {
  // 쇼케이스
  showcaseList: (params = {}) => api.get('/community/showcase/', { params }),
  showcaseDetail: (id) => api.get(`/community/showcase/${id}/`),
  showcaseCreate: (data) => api.post('/community/showcase/', data),
  showcaseLike: (id) => api.post(`/community/showcase/${id}/like/`),

  // 게시글
  postList: (board) => api.get('/community/posts/', { params: { board } }),
  postDetail: (id) => api.get(`/community/posts/${id}/`),
  postCreate: (data) => api.post('/community/posts/', data),
  comments: (postId) => api.get(`/community/posts/${postId}/comments/`),
  addComment: (postId, content) =>
    api.post(`/community/posts/${postId}/comments/`, { content }),
};
