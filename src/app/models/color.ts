export interface ColorExternalId {
    ext_ids: number[];
    ext_descriptions: string[][];
}

export interface Color {
    id: number;
    name: string;
    rgb: string;
    is_trans: boolean;
    external_ids: {
        BrickLink: ColorExternalId[],
        BrickOwl: ColorExternalId[],
        Brickset: ColorExternalId[],
        LDraw: ColorExternalId[],
        LEGO: ColorExternalId[],
        Peeron: ColorExternalId[]
    }
}