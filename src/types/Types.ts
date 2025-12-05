// export char array for gameslots containing N I R D L and then use keyof to create a type from this array:
export const gameSlots = ['N', 'I', 'R', 'D', 'L', null] as const;

export type GameSlot = typeof gameSlots[number];

export type LaserGamePopupType = {
    id: number;
    image?: string;
    height: number;
    width: number;
    title: string;
    desc: string;
    isEvil: boolean;
}

export type ActiveLaserGamePopup = LaserGamePopupType & {
    x: number;
    y: number;
    pointLoss: number;
    actionDelay: number;
}