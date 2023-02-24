export interface Part {
    part_num: string;
    name: string;
    part_cat_id: number;
    part_url: string;
    part_img_url: string;
    external_ids: {
        BrickLink: string[],
        BrickOwl: string[],
        Brickset: string[],
        LDraw: string[],
        LEGO: string[],
        Peeron: string[]
    },
    print_of: string
}