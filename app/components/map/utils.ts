export const popupPortalName = (markerKey: string) => `popup_${markerKey}`;

export const getSenderKey = (orderId: number) => `sender_${orderId}`;

export const getReceiverKey = (orderId: number) => `receiver_${orderId}`;

export const getCourierKey = (courierId: number) => `courier_${courierId}`;
