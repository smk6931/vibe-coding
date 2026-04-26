from .models import Member


def get_or_create_kakao_member(kakao_id: str, nickname: str, avatar_url: str = '') -> Member:
    """카카오 토큰으로 회원 조회·생성."""
    member, _ = Member.objects.get_or_create(
        provider='kakao',
        provider_id=str(kakao_id),
        defaults={'nickname': nickname, 'avatar_url': avatar_url},
    )
    return member
