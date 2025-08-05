export interface NotificationData {
    text: string
    type: NotificationTypeEnum
}

export enum NotificationTypeEnum {
    SUCCESS = "success",
    WARNING = "warning",
    DANGER = "danger"
}

// ✅ Função pura - sem useState
export const getNotificationClasses = (type: NotificationTypeEnum) => {
    switch (type) {
        case NotificationTypeEnum.SUCCESS:
            return 'bg-green-100 border-green-400 text-green-700'
        case NotificationTypeEnum.DANGER:
            return 'bg-red-100 border-red-400 text-red-700'
        default:
            return 'bg-gray-100 border-gray-400 text-gray-700'
    }
}