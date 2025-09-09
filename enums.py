from enum import Enum, unique

@unique
class UserRole(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"
    MANAGER = "manager"