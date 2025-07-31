export interface NotificationData {
    text: string
    type: NotificationTypeEnum
}

export enum NotificationTypeEnum {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    DANGER = "danger"
}