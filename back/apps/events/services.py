from django.utils import timezone
from .models import Event, Registration


def register_event(event: Event, member, depositor_name: str = '') -> Registration:
    """이벤트 신청 — 잔여석 체크 후 Registration 생성."""
    if event.remaining is not None and event.remaining <= 0:
        raise ValueError('잔여석이 없습니다.')

    reg = Registration.objects.create(
        event=event,
        member=member,
        amount=event.price,
        depositor_name=depositor_name,
    )
    if event.remaining is not None:
        Event.objects.filter(pk=event.pk).update(remaining=event.remaining - 1)
    return reg


def confirm_payment(registration: Registration) -> Registration:
    registration.status = 'confirmed'
    registration.paid_at = timezone.now()
    registration.save(update_fields=['status', 'paid_at'])
    return registration


def mark_attended(registration: Registration) -> Registration:
    registration.status = 'attended'
    registration.attended_at = timezone.now()
    registration.save(update_fields=['status', 'attended_at'])
    return registration
