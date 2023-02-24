import { Color } from './color';
import { Part } from './part';

export interface SetInventoryItem {
    id: number;
    inv_part_id: number;
    part: Part;
    color: Color;
    set_num: string;
    quantity: 1;
    is_spare: boolean;
    element_id: string;
    num_sets: number;
}

export interface SetInventoryPage {
    count: number;
    next: string;
    previous: string;
    results: SetInventoryItem[];
}

export interface SetInventory {
    pages: SetInventoryPage[];
}