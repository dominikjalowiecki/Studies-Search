from rest_framework import permissions

class IsModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(request.user, 'is_moderator'):
            return request.user.is_moderator
        return False